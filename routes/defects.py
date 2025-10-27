# -*- coding: utf-8 -*-
"""
Defects management routes
"""

import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename
from PIL import Image
from flask import Blueprint, render_template, redirect, url_for, flash, request, current_app, jsonify
from flask_login import login_required, current_user

defects_bp = Blueprint('defects', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def resize_image(image_path, max_size=(800, 600)):
    """Resize image to reduce file size while maintaining quality"""
    with Image.open(image_path) as img:
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        img.save(image_path, optimize=True, quality=85)

@defects_bp.route('/')
@login_required
def list_defects():
    """List defects based on user role"""
    from app import Defect, User, Assignment, db
    
    page = request.args.get('page', 1, type=int)
    status_filter = request.args.get('status', '')
    priority_filter = request.args.get('priority', '')
    
    query = Defect.query
    
    # Role-based filtering
    if current_user.is_engineer:
        # Engineers see their created defects and assigned defects
        assigned_defect_ids = [a.defect_id for a in current_user.assigned_defects.filter_by(is_active=True)]
        query = query.filter(
            (Defect.creator_id == current_user.id) | 
            (Defect.id.in_(assigned_defect_ids))
        )
    elif current_user.is_manager:
        # Managers see all defects
        pass
    elif current_user.is_observer:
        # Observers see all defects but in read-only mode
        pass
    
    # Apply filters
    if status_filter:
        query = query.filter(Defect.status == status_filter)
    if priority_filter:
        query = query.filter(Defect.priority == priority_filter)
    
    # Order by creation date (newest first)
    query = query.order_by(Defect.created_at.desc())
    
    defects = query.paginate(page=page, per_page=10, error_out=False)
    
    return render_template('defects/list.html', defects=defects, 
                         status_filter=status_filter, priority_filter=priority_filter)

@defects_bp.route('/create', methods=['GET', 'POST'])
@login_required
def create_defect():
    """Create new defect (Engineers only)"""
    from app import Defect, DefectPhoto, db
    
    if not current_user.is_engineer and not current_user.is_manager:
        flash('У вас нет прав для создания дефектов', 'error')
        return redirect(url_for('defects.list_defects'))
    
    if request.method == 'POST':
        title = request.form['title']
        description = request.form['description']
        location = request.form['location']
        severity = request.form['severity']
        
        # Create defect
        defect = Defect(
            title=title,
            description=description,
            location=location,
            severity=severity,
            creator_id=current_user.id
        )
        
        db.session.add(defect)
        db.session.flush()  # Get the ID
        
        # Handle photo uploads
        uploaded_files = request.files.getlist('photos')
        for file in uploaded_files:
            if file and file.filename and allowed_file(file.filename):
                # Generate unique filename
                filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
                filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                
                file.save(filepath)
                
                # Resize image
                try:
                    resize_image(filepath)
                    file_size = os.path.getsize(filepath)
                except Exception as e:
                    flash(f'Ошибка при обработке изображения: {e}', 'warning')
                    continue
                
                # Save to database
                photo = DefectPhoto(
                    filename=filename,
                    original_filename=secure_filename(file.filename),
                    defect_id=defect.id,
                    uploaded_by_id=current_user.id,
                    file_size=file_size
                )
                db.session.add(photo)
        
        db.session.commit()
        flash('Дефект успешно создан', 'success')
        return redirect(url_for('defects.view_defect', id=defect.id))
    
    return render_template('defects/create.html')

@defects_bp.route('/<int:id>')
@login_required
def view_defect(id):
    """View defect details"""
    from app import Defect, Comment, db
    
    defect = Defect.query.get_or_404(id)
    
    # Check access permissions
    if current_user.is_engineer:
        # Engineers can only see their own defects and assigned defects
        assigned_defect_ids = [a.defect_id for a in current_user.assigned_defects.filter_by(is_active=True)]
        if defect.creator_id != current_user.id and defect.id not in assigned_defect_ids:
            flash('У вас нет доступа к этому дефекту', 'error')
            return redirect(url_for('defects.list_defects'))
    
    comments = defect.comments.order_by(Comment.created_at.asc()).all()
    photos = defect.photos.all()
    
    return render_template('defects/view.html', defect=defect, comments=comments, photos=photos)

@defects_bp.route('/<int:id>/assign', methods=['POST'])
@login_required
def assign_defect(id):
    """Assign defect to user (Managers only)"""
    from app import Defect, Assignment, db
    
    if not current_user.is_manager:
        flash('У вас нет прав для назначения исполнителей', 'error')
        return redirect(url_for('defects.view_defect', id=id))
    
    defect = Defect.query.get_or_404(id)
    assignee_id = request.form['assignee_id']
    priority = request.form.get('priority', defect.priority)
    notes = request.form.get('notes', '')
    
    # Deactivate current assignment
    current_assignment = Assignment.query.filter_by(defect_id=id, is_active=True).first()
    if current_assignment:
        current_assignment.is_active = False
    
    # Create new assignment
    assignment = Assignment(
        defect_id=id,
        assignee_id=assignee_id,
        assigned_by_id=current_user.id,
        notes=notes
    )
    
    # Update defect status and priority
    defect.status = 'assigned'
    defect.priority = priority
    
    db.session.add(assignment)
    db.session.commit()
    
    flash('Дефект успешно назначен исполнителю', 'success')
    return redirect(url_for('defects.view_defect', id=id))

@defects_bp.route('/<int:id>/update_status', methods=['POST'])
@login_required
def update_status(id):
    """Update defect status"""
    from app import Defect, Assignment, db
    
    defect = Defect.query.get_or_404(id)
    new_status = request.form['status']
    
    # Check permissions
    can_update = False
    if current_user.is_manager:
        can_update = True
    elif current_user.is_engineer:
        # Engineers can update status of assigned defects
        assignment = Assignment.query.filter_by(defect_id=id, assignee_id=current_user.id, is_active=True).first()
        if assignment or defect.creator_id == current_user.id:
            can_update = True
    
    if not can_update:
        flash('У вас нет прав для изменения статуса этого дефекта', 'error')
        return redirect(url_for('defects.view_defect', id=id))
    
    defect.status = new_status
    if new_status == 'resolved':
        defect.resolved_at = datetime.utcnow()
    
    db.session.commit()
    flash('Статус дефекта обновлен', 'success')
    return redirect(url_for('defects.view_defect', id=id))

@defects_bp.route('/<int:id>/comment', methods=['POST'])
@login_required
def add_comment(id):
    """Add comment to defect"""
    from app import Defect, Comment, db
    
    defect = Defect.query.get_or_404(id)
    content = request.form['content']
    
    if not content.strip():
        flash('Комментарий не может быть пустым', 'error')
        return redirect(url_for('defects.view_defect', id=id))
    
    comment = Comment(
        content=content,
        defect_id=id,
        author_id=current_user.id
    )
    
    db.session.add(comment)
    db.session.commit()
    
    flash('Комментарий добавлен', 'success')
    return redirect(url_for('defects.view_defect', id=id))

@defects_bp.route('/users_json')
@login_required
def users_json():
    """API endpoint to get users for assignment dropdown"""
    from app import User
    
    if not current_user.is_manager:
        return jsonify([])
    
    users = User.query.filter(User.role.in_(['engineer', 'manager'])).all()
    return jsonify([{
        'id': user.id,
        'name': user.full_name,
        'username': user.username,
        'role': user.role
    } for user in users])