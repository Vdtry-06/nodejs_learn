CREATE TABLE IF NOT EXISTS users (
  id         SERIAL       PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  created_at TIMESTAMP    DEFAULT NOW()
);

INSERT INTO users (name, email) VALUES
  ('Nguyen Van A', 'vana@example.com'),
  ('Tran Thi B',   'thib@example.com');