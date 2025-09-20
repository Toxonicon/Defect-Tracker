#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Defect Tracker - Monolithic Web Application
For centralized defect management on construction sites
"""

import os
from datetime import datetime
from flask import Flask, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY') or 'defect-tracker-secret-key-2023'
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL') or 'sqlite:///defect_tracker.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Initialize extensions
db = SQLAlchemy()
db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Пожалуйста, войдите в систему для доступа к этой странице.'
login_manager.login_message_category = 'info'

# Create upload directory if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Template filters
@app.template_filter('nl2br')
def nl2br_filter(text):
    """Convert newlines to HTML breaks"""
    if not text:
        return text
    return text.replace('\n', '<br>\n')

app.jinja_env.filters['nl2br'] = nl2br_filter

# Database Models
class User(UserMixin, db.Model):
    """User model with role-based access"""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='engineer')  # engineer, manager, observer
    full_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships
    created_defects = db.relationship('Defect', foreign_keys='Defect.creator_id', backref='creator', lazy='dynamic')
    assigned_defects = db.relationship('Assignment', foreign_keys='Assignment.assignee_id', backref='assignee', lazy='dynamic')
    comments = db.relationship('Comment', backref='author', lazy='dynamic')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    @property
    def is_engineer(self):
        return self.role == 'engineer'
    
    @property
    def is_manager(self):
        return self.role == 'manager'
    
    @property
    def is_observer(self):
        return self.role == 'observer'
    
    def __repr__(self):
        return f'<User {self.username}>'

class Defect(db.Model):
    """Defect model for tracking construction defects"""
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    severity = db.Column(db.String(20), nullable=False, default='medium')  # low, medium, high, critical
    status = db.Column(db.String(20), nullable=False, default='open')  # open, assigned, in_progress, resolved, closed
    priority = db.Column(db.String(20), nullable=False, default='normal')  # low, normal, high, urgent
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    due_date = db.Column(db.DateTime)
    resolved_at = db.Column(db.DateTime)
    
    # Foreign keys
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relationships
    assignments = db.relationship('Assignment', backref='defect', lazy='dynamic', cascade='all, delete-orphan')
    comments = db.relationship('Comment', backref='defect', lazy='dynamic', cascade='all, delete-orphan')
    photos = db.relationship('DefectPhoto', backref='defect', lazy='dynamic', cascade='all, delete-orphan')
    
    @property
    def current_assignee(self):
        assignment = self.assignments.filter_by(is_active=True).first()
        return assignment.assignee if assignment else None
    
    @property
    def is_overdue(self):
        return self.due_date and self.due_date < datetime.utcnow() and self.status not in ['resolved', 'closed']
    
    def __repr__(self):
        return f'<Defect {self.id}: {self.title}>'

class Assignment(db.Model):
    """Assignment of defects to users"""
    id = db.Column(db.Integer, primary_key=True)
    defect_id = db.Column(db.Integer, db.ForeignKey('defect.id'), nullable=False)
    assignee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    assigned_by_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    assigned_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    notes = db.Column(db.Text)
    
    # Relationships
    assigned_by = db.relationship('User', foreign_keys=[assigned_by_id])
    
    def __repr__(self):
        return f'<Assignment {self.defect_id} -> {self.assignee_id}>'

class Comment(db.Model):
    """Comments on defects"""
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign keys
    defect_id = db.Column(db.Integer, db.ForeignKey('defect.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    def __repr__(self):
        return f'<Comment {self.id} on Defect {self.defect_id}>'

class DefectPhoto(db.Model):
    """Photos attached to defects"""
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    file_size = db.Column(db.Integer)
    
    # Foreign key
    defect_id = db.Column(db.Integer, db.ForeignKey('defect.id'), nullable=False)
    uploaded_by_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relationships
    uploaded_by = db.relationship('User')
    
    def __repr__(self):
        return f'<DefectPhoto {self.filename}>'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Register blueprints
from routes.auth import auth_bp
from routes.defects import defects_bp
from routes.dashboard import dashboard_bp

app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(defects_bp, url_prefix='/defects')
app.register_blueprint(dashboard_bp)

@app.route('/')
def index():
    return redirect(url_for('dashboard.dashboard'))

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Create default admin user if it doesn't exist
        if not User.query.filter_by(username='admin').first():
            admin = User(
                username='admin',
                email='admin@defecttracker.local',
                password_hash=generate_password_hash('admin123'),
                role='manager',
                full_name='Администратор системы'
            )
            db.session.add(admin)
            db.session.commit()
            print("Created default admin user: admin/admin123")
    
    app.run(debug=True, host='0.0.0.0', port=5000)