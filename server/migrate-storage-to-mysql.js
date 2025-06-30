const mysql = require('mysql2/promise');
const { MemStorage } = require('./storage.js');

async function migrate() {
  // 1. Koneksi ke MySQL
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password_anda', // Ganti sesuai MySQL Anda
    database: 'nama_database'  // Ganti sesuai MySQL Anda
  });

  const storage = new MemStorage();

  // USERS
  for (const user of storage.users.values()) {
    await connection.execute(
      'INSERT INTO users (id, username, password) VALUES (?, ?, ?)',
      [user.id, user.username, user.password]
    );
  }

  // PROFILE (asumsi hanya satu baris, id=1)
  if (storage.profile) {
    const p = storage.profile;
    await connection.execute(
      `INSERT INTO profile (id, firstName, lastName, title, email, phone, location, heroDescription, aboutTitle, aboutDescription1, aboutDescription2, aboutDescription3, profileImage, githubUrl, linkedinUrl, twitterUrl, tiktokUrl, instagramUrl, contactHeading, contactDescription, contactMainHeading, contactMainDescription, contactSubHeading, contactSubDescription, experienceYears, projectsCompleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [p.id, p.firstName, p.lastName, p.title, p.email, p.phone, p.location, p.heroDescription, p.aboutTitle, p.aboutDescription1, p.aboutDescription2, p.aboutDescription3, p.profileImage, p.githubUrl, p.linkedinUrl, p.twitterUrl, p.tiktokUrl, p.instagramUrl, p.contactHeading, p.contactDescription, p.contactMainHeading, p.contactMainDescription, p.contactSubHeading, p.contactSubDescription, p.experienceYears, p.projectsCompleted]
    );
  }

  // SKILLS
  for (const skill of storage.skills.values()) {
    await connection.execute(
      'INSERT INTO skills (id, name, category, level, icon) VALUES (?, ?, ?, ?, ?)',
      [skill.id, skill.name, skill.category, skill.level, skill.icon]
    );
  }

  // EXPERIENCES
  for (const exp of storage.experiences.values()) {
    await connection.execute(
      'INSERT INTO experiences (id, title, company, period, description, technologies, current) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [exp.id, exp.title, exp.company, exp.period, exp.description, JSON.stringify(exp.technologies), exp.current ? 1 : 0]
    );
  }

  // PROJECTS
  for (const project of storage.projects.values()) {
    await connection.execute(
      'INSERT INTO projects (id, title, description, image, technologies, liveUrl, githubUrl, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [project.id, project.title, project.description, project.image, JSON.stringify(project.technologies), project.liveUrl, project.githubUrl, project.featured ? 1 : 0]
    );
  }

  // EDUCATION
  for (const edu of storage.education.values()) {
    await connection.execute(
      'INSERT INTO education (id, degree, institution, period, description, type) VALUES (?, ?, ?, ?, ?, ?)',
      [edu.id, edu.degree, edu.institution, edu.period, edu.description, edu.type]
    );
  }

  // ACTIVITIES
  for (const act of storage.activities.values()) {
    await connection.execute(
      'INSERT INTO activities (id, title, description, icon, url) VALUES (?, ?, ?, ?, ?)',
      [act.id, act.title, act.description, act.icon, act.url]
    );
  }

  // CONTACTS
  for (const contact of storage.contacts.values()) {
    await connection.execute(
      'INSERT INTO contacts (id, name, email, message, createdAt) VALUES (?, ?, ?, ?, ?)',
      [contact.id, contact.name, contact.email, contact.message, contact.createdAt ? new Date(contact.createdAt) : null]
    );
  }

  // ARTICLES
  for (const article of storage.articles.values()) {
    await connection.execute(
      'INSERT INTO articles (id, title, content, excerpt, image, tags, published, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [article.id, article.title, article.content, article.excerpt, article.image, JSON.stringify(article.tags), article.published ? 1 : 0, article.createdAt ? new Date(article.createdAt) : null, article.updatedAt ? new Date(article.updatedAt) : null]
    );
  }

  // PRICING
  for (const pricing of storage.pricing.values()) {
    await connection.execute(
      'INSERT INTO pricing (id, price, currency, period, title, description, features, isActive, isPremium, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [pricing.id, pricing.price, pricing.currency, pricing.period, pricing.title, pricing.description, JSON.stringify(pricing.features), pricing.isActive ? 1 : 0, pricing.isPremium ? 1 : 0, pricing.createdAt ? new Date(pricing.createdAt) : null, pricing.updatedAt ? new Date(pricing.updatedAt) : null]
    );
  }

  await connection.end();
  console.log('Migrasi selesai!');
}

migrate().catch(console.error); 