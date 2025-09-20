# -*- coding: utf-8 -*-
"""
Dashboard and reporting routes
"""

from flask import Blueprint, render_template, redirect, url_for
from flask_login import login_required, current_user
from sqlalchemy import func

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/')
@login_required
def dashboard():
    """Main dashboard with role-based content"""
    # Import here to avoid circular import
    from app import Defect, User, Assignment, db
    
    # Get statistics based on user role
    stats = {}
    
    if current_user.is_engineer:
        # Engineer dashboard - their defects and assignments
        stats['created_defects'] = Defect.query.filter_by(creator_id=current_user.id).count()
        assigned_ids = [a.defect_id for a in current_user.assigned_defects.filter_by(is_active=True)]
        stats['assigned_defects'] = len(assigned_ids)
        
        # Recent defects
        recent_defects = Defect.query.filter(
            (Defect.creator_id == current_user.id) | 
            (Defect.id.in_(assigned_ids))
        ).order_by(Defect.updated_at.desc()).limit(5).all()
        
    elif current_user.is_manager:
        # Manager dashboard - all defects overview
        stats['total_defects'] = Defect.query.count()
        stats['open_defects'] = Defect.query.filter(Defect.status.in_(['open', 'assigned', 'in_progress'])).count()
        stats['resolved_defects'] = Defect.query.filter_by(status='resolved').count()
        stats['closed_defects'] = Defect.query.filter_by(status='closed').count()
        
        # Priority breakdown
        stats['critical_defects'] = Defect.query.filter_by(severity='critical').count()
        stats['high_defects'] = Defect.query.filter_by(severity='high').count()
        
        # Recent defects
        recent_defects = Defect.query.order_by(Defect.created_at.desc()).limit(10).all()
        
    elif current_user.is_observer:
        # Observer dashboard - high-level overview and reports
        stats['total_defects'] = Defect.query.count()
        stats['open_defects'] = Defect.query.filter(Defect.status.in_(['open', 'assigned', 'in_progress'])).count()
        stats['resolved_defects'] = Defect.query.filter_by(status='resolved').count()
        stats['closed_defects'] = Defect.query.filter_by(status='closed').count()
        
        # Status distribution
        status_stats = db.session.query(
            Defect.status,
            func.count(Defect.id)
        ).group_by(Defect.status).all()
        stats['status_distribution'] = dict(status_stats)
        
        # Severity distribution
        severity_stats = db.session.query(
            Defect.severity,
            func.count(Defect.id)
        ).group_by(Defect.severity).all()
        stats['severity_distribution'] = dict(severity_stats)
        
        # Recent defects (limited view)
        recent_defects = Defect.query.order_by(Defect.created_at.desc()).limit(5).all()
    
    else:
        recent_defects = []
    
    return render_template('dashboard/index.html', stats=stats, recent_defects=recent_defects)

@dashboard_bp.route('/reports')
@login_required
def reports():
    """Reports page (Managers and Observers)"""
    # Import here to avoid circular import
    from app import Defect, User, Assignment, db
    
    if not (current_user.is_manager or current_user.is_observer):
        return redirect(url_for('dashboard.dashboard'))
    
    # Generate comprehensive reports
    
    # Status breakdown
    status_report = db.session.query(
        Defect.status,
        func.count(Defect.id).label('count')
    ).group_by(Defect.status).all()
    
    # Severity breakdown  
    severity_report = db.session.query(
        Defect.severity,
        func.count(Defect.id).label('count')
    ).group_by(Defect.severity).all()
    
    # Priority breakdown
    priority_report = db.session.query(
        Defect.priority,
        func.count(Defect.id).label('count')
    ).group_by(Defect.priority).all()
    
    # User activity (defects created)
    user_activity = db.session.query(
        User.full_name,
        User.role,
        func.count(Defect.id).label('defects_created')
    ).join(Defect, User.id == Defect.creator_id).group_by(User.id).all()
    
    # Assignment statistics
    assignment_stats = db.session.query(
        User.full_name,
        func.count(Assignment.id).label('assignments')
    ).join(Assignment, User.id == Assignment.assignee_id).filter(
        Assignment.is_active == True
    ).group_by(User.id).all()
    
    return render_template('dashboard/reports.html',
                         status_report=status_report,
                         severity_report=severity_report,
                         priority_report=priority_report,
                         user_activity=user_activity,
                         assignment_stats=assignment_stats)