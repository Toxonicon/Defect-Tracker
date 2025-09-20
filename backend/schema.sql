CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(20) NOT NULL DEFAULT 'engineer',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS defects (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'NEW',
  reporter_id INT REFERENCES users(id),
  assignee_id INT REFERENCES users(id),
  due_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  defect_id INT REFERENCES defects(id) ON DELETE CASCADE,
  filename VARCHAR(255),
  original_name VARCHAR(255),
  url TEXT,
  uploaded_by INT REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id SERIAL PRIMARY KEY,
  defect_id INT REFERENCES defects(id) ON DELETE CASCADE,
  user_id INT REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  defect_id INT REFERENCES defects(id) ON DELETE CASCADE,
  action VARCHAR(100),
  payload JSONB,
  user_id INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);
