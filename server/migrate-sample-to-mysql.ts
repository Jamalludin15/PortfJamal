import { db } from '../shared/db';
import { MemStorage } from './storage';
import {
  users, profile, skills, experiences, projects,
  education, activities, contacts, articles, pricing
} from '../shared/schema';

async function migrate() {
  const storage = new MemStorage();

  // Kosongkan semua tabel sebelum migrasi
  await db.delete(users);
  await db.delete(profile);
  await db.delete(skills);
  await db.delete(experiences);
  await db.delete(projects);
  await db.delete(education);
  await db.delete(activities);
  await db.delete(contacts);
  await db.delete(articles);
  await db.delete(pricing);

  // USERS (hanya admin sample)
  const admin = await storage.getUserByUsername('admin');
  if (admin) {
    await db.insert(users).values(admin);
  }

  // PROFILE
  const prof = await storage.getProfile();
  if (prof) {
    await db.insert(profile).values(prof);
  }

  // SKILLS
  for (const skill of await storage.getSkills()) {
    await db.insert(skills).values(skill);
  }

  // EXPERIENCES
  for (const exp of await storage.getExperiences()) {
    await db.insert(experiences).values({
      ...exp,
      technologies: JSON.stringify(exp.technologies)
    });
  }

  // PROJECTS
  for (const project of await storage.getProjects()) {
    await db.insert(projects).values({
      ...project,
      technologies: JSON.stringify(project.technologies)
    });
  }

  // EDUCATION
  for (const edu of await storage.getEducation()) {
    await db.insert(education).values(edu);
  }

  // ACTIVITIES
  for (const act of await storage.getActivities()) {
    await db.insert(activities).values(act);
  }

  // CONTACTS
  for (const contact of await storage.getContacts()) {
    await db.insert(contacts).values({
      ...contact,
      createdAt: contact.createdAt ? new Date(contact.createdAt) : null
    });
  }

  // ARTICLES
  for (const article of await storage.getArticles()) {
    await db.insert(articles).values({
      ...article,
      tags: JSON.stringify(article.tags),
      createdAt: article.createdAt ? new Date(article.createdAt) : null,
      updatedAt: article.updatedAt ? new Date(article.updatedAt) : null
    });
  }

  // PRICING
  for (const price of await storage.getPricing()) {
    await db.insert(pricing).values({
      ...price,
      features: JSON.stringify(price.features),
      createdAt: price.createdAt ? new Date(price.createdAt) : null,
      updatedAt: price.updatedAt ? new Date(price.updatedAt) : null
    });
  }

  console.log('Migrasi selesai!');
}

migrate().then(() => process.exit(0)); 