-- SEED DATA UNTUK PORTFOLIO

-- users
INSERT INTO users (id, username, password) VALUES
  (1, 'admin', 'jamal2121');

-- profile
INSERT INTO profile (id, first_name, last_name, title, email, phone, location, hero_description, about_title, about_description_1) VALUES
  (1, 'Jamalludin', 'Nasution', 'Fullstack Developer', 'jamal@mail.com', '08123456789', 'Medan, Indonesia', 'Membuat solusi digital kreatif dan efisien.', 'Tentang Saya', 'Saya adalah pengembang web yang berfokus pada solusi modern dan efisien.');

-- skills
INSERT INTO skills (id, name, category, level, icon) VALUES
  (1, 'JavaScript', 'Frontend & Backend', 90, 'js.png'),
  (2, 'React', 'Frontend', 85, 'react.png'),
  (3, 'Node.js', 'Backend', 80, 'node.png'),
  (4, 'MySQL', 'Database', 75, 'mysql.png');

-- experiences
INSERT INTO experiences (id, title, company, period, description, technologies, current) VALUES
  (1, 'Web Developer', 'Digital Studio', '2022-2024', 'Membuat aplikasi web untuk klien nasional.', '["React","Node.js"]', false);

-- projects
INSERT INTO projects (id, title, description, image, technologies, live_url, github_url, featured) VALUES
  (1, 'Portfolio', 'Website portfolio pribadi menampilkan karya dan pengalaman.', 'portfolio.png', '["React","Express"]', 'https://jamal.dev', 'https://github.com/jamal/portfolio', true);

-- education
INSERT INTO education (id, degree, institution, period, description, type) VALUES
  (1, 'S1 Informatika', 'Universitas Medan', '2018-2022', 'Lulus dengan predikat sangat memuaskan.', 'degree');

-- activities
INSERT INTO activities (id, title, description, icon, url) VALUES
  (1, 'Hackathon', 'Juara 2 Hackathon Nasional 2023', 'trophy.png', 'https://event.com');

-- contacts
INSERT INTO contacts (id, name, email, subject, message, created_at) VALUES
  (1, 'Budi', 'budi@mail.com', 'Kerjasama', 'Halo, saya ingin kerjasama project.', '2024-07-01 10:00:00');

-- articles
INSERT INTO articles (id, title, content, excerpt, image, tags, published, created_at, updated_at) VALUES
  (1, 'Tips React', 'Berikut beberapa tips React untuk pemula...', 'Tips React', 'react.png', '["react"]', true, '2024-07-01 10:00:00', '2024-07-01 10:00:00');

-- pricing
INSERT INTO pricing (id, price, currency, period, title, description, features, is_active, is_premium, created_at, updated_at) VALUES
  (1, 1200, 'USD', 'month', 'Basic', 'Paket basic untuk personal.', '["1 Project","Support"]', true, false, '2024-07-01 10:00:00', '2024-07-01 10:00:00'); 