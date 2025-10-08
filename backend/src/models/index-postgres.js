import User from './User-postgres.js';
import Project from './Project-postgres.js';
import ProjectMember from './ProjectMember-postgres.js';
import Defect from './Defect-postgres.js';
import Attachment from './Attachment-postgres.js';
import Comment from './Comment-postgres.js';
import StatusHistory from './StatusHistory-postgres.js';
import AuditLog from './AuditLog-postgres.js';

// Ассоциации между моделями

// User - Project (через ProjectMember)
User.belongsToMany(Project, {
  through: ProjectMember,
  as: 'projects',
  foreignKey: 'user_id',
  otherKey: 'project_id'
});

Project.belongsToMany(User, {
  through: ProjectMember,
  as: 'members',
  foreignKey: 'project_id',
  otherKey: 'user_id'
});

// Project - Manager
Project.belongsTo(User, {
  as: 'manager',
  foreignKey: 'manager_id'
});

User.hasMany(Project, {
  as: 'managedProjects',
  foreignKey: 'manager_id'
});

// ProjectMember ассоциации
ProjectMember.belongsTo(Project, {
  foreignKey: 'project_id'
});

ProjectMember.belongsTo(User, {
  foreignKey: 'user_id'
});

// Project - Defects
Project.hasMany(Defect, {
  as: 'defects',
  foreignKey: 'project_id'
});

Defect.belongsTo(Project, {
  as: 'project',
  foreignKey: 'project_id'
});

// Defect - Users (reported_by, assigned_to)
Defect.belongsTo(User, {
  as: 'reporter',
  foreignKey: 'reported_by'
});

Defect.belongsTo(User, {
  as: 'assignee',
  foreignKey: 'assigned_to'
});

User.hasMany(Defect, {
  as: 'reportedDefects',
  foreignKey: 'reported_by'
});

User.hasMany(Defect, {
  as: 'assignedDefects',
  foreignKey: 'assigned_to'
});

// Defect - Attachments
Defect.hasMany(Attachment, {
  as: 'attachments',
  foreignKey: 'defect_id'
});

Attachment.belongsTo(Defect, {
  as: 'defect',
  foreignKey: 'defect_id'
});

// Attachment - User (uploaded_by)
Attachment.belongsTo(User, {
  as: 'uploader',
  foreignKey: 'uploaded_by'
});

User.hasMany(Attachment, {
  as: 'uploads',
  foreignKey: 'uploaded_by'
});

// Defect - Comments
Defect.hasMany(Comment, {
  as: 'comments',
  foreignKey: 'defect_id'
});

Comment.belongsTo(Defect, {
  as: 'defect',
  foreignKey: 'defect_id'
});

// Comment - User
Comment.belongsTo(User, {
  as: 'author',
  foreignKey: 'user_id'
});

User.hasMany(Comment, {
  as: 'comments',
  foreignKey: 'user_id'
});

// Defect - StatusHistory
Defect.hasMany(StatusHistory, {
  as: 'statusHistory',
  foreignKey: 'defect_id'
});

StatusHistory.belongsTo(Defect, {
  as: 'defect',
  foreignKey: 'defect_id'
});

// StatusHistory - User (changed_by)
StatusHistory.belongsTo(User, {
  as: 'changer',
  foreignKey: 'changed_by'
});

User.hasMany(StatusHistory, {
  as: 'statusChanges',
  foreignKey: 'changed_by'
});

// AuditLog - User
AuditLog.belongsTo(User, {
  as: 'user',
  foreignKey: 'user_id'
});

User.hasMany(AuditLog, {
  as: 'auditLogs',
  foreignKey: 'user_id'
});

// Экспорт всех моделей
export {
  User,
  Project,
  ProjectMember,
  Defect,
  Attachment,
  Comment,
  StatusHistory,
  AuditLog
};