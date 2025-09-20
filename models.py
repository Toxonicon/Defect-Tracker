# -*- coding: utf-8 -*-
"""
Database models for Defect Tracker - Updated to work with Flask app context
"""

from datetime import datetime
from flask import current_app
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

# This will work when called from within the app context
def get_db():
    return current_app.extensions['sqlalchemy']

# Import after db is available - will be set from app.py
db = None

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