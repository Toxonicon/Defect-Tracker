-- Defect Tracker Database Schema for PostgreSQL
-- Выполните этот скрипт в pgAdmin для создания всех необходимых таблиц

-- Создание базы данных (выполните отдельно если нужно)
-- CREATE DATABASE defect_tracker;

-- Подключитесь к базе defect_tracker и выполните следующие команды:

-- 1. Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('engineer', 'manager', 'supervisor')),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Таблица проектов
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on_hold', 'completed', 'cancelled')),
    manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Связующая таблица участников проекта
CREATE TABLE project_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('engineer', 'supervisor')),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(project_id, user_id)
);

-- 4. Таблица дефектов
CREATE TABLE defects (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('structural', 'electrical', 'plumbing', 'finishing', 'safety', 'other')),
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'review', 'resolved', 'closed', 'rejected')),
    location VARCHAR(255),
    floor VARCHAR(50),
    room VARCHAR(100),
    reported_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    due_date DATE,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Таблица вложений
CREATE TABLE attachments (
    id SERIAL PRIMARY KEY,
    defect_id INTEGER REFERENCES defects(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    uploaded_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Таблица комментариев
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    defect_id INTEGER REFERENCES defects(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Таблица истории изменений статусов
CREATE TABLE status_history (
    id SERIAL PRIMARY KEY,
    defect_id INTEGER REFERENCES defects(id) ON DELETE CASCADE,
    previous_status VARCHAR(20),
    new_status VARCHAR(20) NOT NULL,
    changed_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Таблица журнала аудита
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для оптимизации производительности
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_projects_manager ON projects(manager_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_project_members_project ON project_members(project_id);
CREATE INDEX idx_project_members_user ON project_members(user_id);
CREATE INDEX idx_defects_project ON defects(project_id);
CREATE INDEX idx_defects_status ON defects(status);
CREATE INDEX idx_defects_severity ON defects(severity);
CREATE INDEX idx_defects_assigned ON defects(assigned_to);
CREATE INDEX idx_defects_reported ON defects(reported_by);
CREATE INDEX idx_attachments_defect ON attachments(defect_id);
CREATE INDEX idx_comments_defect ON comments(defect_id);
CREATE INDEX idx_status_history_defect ON status_history(defect_id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_defects_updated_at BEFORE UPDATE ON defects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Вставка тестовых данных
INSERT INTO users (email, password_hash, first_name, last_name, role, phone) VALUES
('manager@demo.com', '$2b$10$rV8Z8QX9QHqH5cV6Vn5V5O5V5V5V5V5V5V5V5V5V5V5V5V5V5V5V5V5', 'Иван', 'Петров', 'manager', '+7-900-123-45-67'),
('engineer@demo.com', '$2b$10$rV8Z8QX9QHqH5cV6Vn5V5O5V5V5V5V5V5V5V5V5V5V5V5V5V5V5V5V5', 'Мария', 'Сидорова', 'engineer', '+7-900-234-56-78'),
('supervisor@demo.com', '$2b$10$rV8Z8QX9QHqH5cV6Vn5V5O5V5V5V5V5V5V5V5V5V5V5V5V5V5V5V5V5', 'Алексей', 'Козлов', 'supervisor', '+7-900-345-67-89');

INSERT INTO projects (name, description, location, start_date, end_date, status, manager_id) VALUES
('ЖК "Солнечный"', 'Строительство жилого комплекса на 200 квартир', 'г. Москва, ул. Солнечная, 15', '2025-01-15', '2026-06-30', 'active', 1),
('Торговый центр "Европа"', 'Реконструкция торгового центра', 'г. СПб, пр. Невский, 100', '2025-03-01', '2025-12-15', 'planning', 1);

INSERT INTO project_members (project_id, user_id, role) VALUES
(1, 2, 'engineer'),
(1, 3, 'supervisor'),
(2, 2, 'engineer');

INSERT INTO defects (project_id, title, description, category, severity, location, floor, room, reported_by, assigned_to, due_date) VALUES
(1, 'Трещина в стене', 'Обнаружена трещина в несущей стене на 5 этаже', 'structural', 'high', 'Корпус А', '5', '5-12', 3, 2, '2025-10-15'),
(1, 'Неисправная розетка', 'Розетка в квартире 3-25 не работает', 'electrical', 'medium', 'Корпус Б', '3', '3-25', 2, 2, '2025-10-12'),
(2, 'Протечка крыши', 'Вода капает с потолка в зоне фудкорта', 'plumbing', 'critical', 'Главное здание', '3', 'Фудкорт', 3, 2, '2025-10-10');

-- Комментарии к таблицам
COMMENT ON TABLE users IS 'Пользователи системы (инженеры, менеджеры, наблюдатели)';
COMMENT ON TABLE projects IS 'Строительные проекты';
COMMENT ON TABLE project_members IS 'Участники проектов';
COMMENT ON TABLE defects IS 'Дефекты на строительных объектах';
COMMENT ON TABLE attachments IS 'Файлы-вложения к дефектам';
COMMENT ON TABLE comments IS 'Комментарии к дефектам';
COMMENT ON TABLE status_history IS 'История изменений статусов дефектов';
COMMENT ON TABLE audit_logs IS 'Журнал аудита действий пользователей';