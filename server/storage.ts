import {
  users, profile, skills, experiences, projects, education, activities, contacts, articles, pricing, sessions,
  type User, type InsertUser, type Profile, type InsertProfile,
  type Skill, type InsertSkill, type Experience, type InsertExperience,
  type Project, type InsertProject, type Education, type InsertEducation,
  type Activity, type InsertActivity, type Contact, type InsertContact,
  type Article, type InsertArticle, type Pricing, type InsertPricing, type Session
} from "@shared/schema";
import { db } from "@shared/db";
import { eq, desc } from "drizzle-orm";
import crypto from "crypto";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Profile
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profile: InsertProfile): Promise<Profile>;
  
  // Skills
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<boolean>;
  
  // Experiences
  getExperiences(): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: number, experience: Partial<InsertExperience>): Promise<Experience>;
  deleteExperience(id: number): Promise<boolean>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<boolean>;
  
  // Education
  getEducation(): Promise<Education[]>;
  createEducation(education: InsertEducation): Promise<Education>;
  updateEducation(id: number, education: Partial<InsertEducation>): Promise<Education>;
  deleteEducation(id: number): Promise<boolean>;
  
  // Activities
  getActivities(): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity>;
  deleteActivity(id: number): Promise<boolean>;
  
  // Contacts
  getContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  deleteContact(id: number): Promise<boolean>;
  
  // Articles
  getArticles(): Promise<Article[]>;
  getPublishedArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<boolean>;
  
  // Pricing
  getPricing(): Promise<Pricing[]>;
  createPricing(pricing: InsertPricing): Promise<Pricing>;
  updatePricing(id: number, pricing: Partial<InsertPricing>): Promise<Pricing>;
  deletePricing(id: number): Promise<boolean>;
  
  // Sessions
  createSession(userId: number): Promise<Session>;
  getSession(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<boolean>;
}

export class DrizzleStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    return await db.select().from(users).where(eq(users.id, id)).then(rows => rows[0]);
  }
  async getUserByUsername(username: string): Promise<User | undefined> {
    return await db.select().from(users).where(eq(users.username, username)).then(rows => rows[0]);
  }
  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user);
    return await this.getUser(result[0].insertId);
  }

  // Profile
  async getProfile(): Promise<Profile | undefined> {
    return await db.select().from(profile).then(rows => rows[0]);
  }
  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    await db.update(profile).set(profileData);
    return await this.getProfile();
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills);
  }
  async createSkill(skill: InsertSkill): Promise<Skill> {
    const result = await db.insert(skills).values(skill);
    const newId = result[0].insertId;
    return (await db.select().from(skills).where(eq(skills.id, newId)))[0];
  }
  async updateSkill(id: number, skillData: Partial<InsertSkill>): Promise<Skill> {
    await db.update(skills).set(skillData).where(eq(skills.id, id));
    return (await db.select().from(skills).where(eq(skills.id, id)))[0];
  }
  async deleteSkill(id: number): Promise<boolean> {
    const result = await db.delete(skills).where(eq(skills.id, id));
    return result[0].affectedRows > 0;
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experiences).orderBy(desc(experiences.current), desc(experiences.id));
  }
  async createExperience(experience: InsertExperience): Promise<Experience> {
    const result = await db.insert(experiences).values(experience);
    const newId = result[0].insertId;
    return (await db.select().from(experiences).where(eq(experiences.id, newId)))[0];
  }
  async updateExperience(id: number, experienceData: Partial<InsertExperience>): Promise<Experience> {
    await db.update(experiences).set(experienceData).where(eq(experiences.id, id));
    return (await db.select().from(experiences).where(eq(experiences.id, id)))[0];
  }
  async deleteExperience(id: number): Promise<boolean> {
    const result = await db.delete(experiences).where(eq(experiences.id, id));
    return result[0].affectedRows > 0;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects);
  }
  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project);
    const newId = result[0].insertId;
    return (await db.select().from(projects).where(eq(projects.id, newId)))[0];
  }
  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project> {
    await db.update(projects).set(projectData).where(eq(projects.id, id));
    return (await db.select().from(projects).where(eq(projects.id, id)))[0];
  }
  async deleteProject(id: number): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result[0].affectedRows > 0;
  }

  // Education
  async getEducation(): Promise<Education[]> {
    return await db.select().from(education);
  }
  async createEducation(educationData: InsertEducation): Promise<Education> {
    const result = await db.insert(education).values(educationData);
    const newId = result[0].insertId;
    return (await db.select().from(education).where(eq(education.id, newId)))[0];
  }
  async updateEducation(id: number, educationData: Partial<InsertEducation>): Promise<Education> {
    await db.update(education).set(educationData).where(eq(education.id, id));
    return (await db.select().from(education).where(eq(education.id, id)))[0];
  }
  async deleteEducation(id: number): Promise<boolean> {
    const result = await db.delete(education).where(eq(education.id, id));
    return result[0].affectedRows > 0;
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(activity);
    const newId = result[0].insertId;
    return (await db.select().from(activities).where(eq(activities.id, newId)))[0];
  }
  async updateActivity(id: number, activityData: Partial<InsertActivity>): Promise<Activity> {
    await db.update(activities).set(activityData).where(eq(activities.id, id));
    return (await db.select().from(activities).where(eq(activities.id, id)))[0];
  }
  async deleteActivity(id: number): Promise<boolean> {
    const result = await db.delete(activities).where(eq(activities.id, id));
    return result[0].affectedRows > 0;
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }
  async createContact(contact: InsertContact): Promise<Contact> {
    const result = await db.insert(contacts).values(contact);
    const newId = result[0].insertId;
    return (await db.select().from(contacts).where(eq(contacts.id, newId)))[0];
  }
  async deleteContact(id: number): Promise<boolean> {
    const result = await db.delete(contacts).where(eq(contacts.id, id));
    return result[0].affectedRows > 0;
  }

  // Articles
  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles).orderBy(desc(articles.createdAt));
  }
  async getPublishedArticles(): Promise<Article[]> {
    return await db.select().from(articles).where(eq(articles.published, true)).orderBy(desc(articles.createdAt));
  }
  async getArticle(id: number): Promise<Article | undefined> {
    return await db.select().from(articles).where(eq(articles.id, id)).then(rows => rows[0]);
  }
  async createArticle(article: InsertArticle): Promise<Article> {
    const result = await db.insert(articles).values(article);
    const newId = result[0].insertId;
    return (await db.select().from(articles).where(eq(articles.id, newId)))[0];
  }
  async updateArticle(id: number, articleData: Partial<InsertArticle>): Promise<Article> {
    await db.update(articles).set(articleData).where(eq(articles.id, id));
    return (await db.select().from(articles).where(eq(articles.id, id)))[0];
  }
  async deleteArticle(id: number): Promise<boolean> {
    const result = await db.delete(articles).where(eq(articles.id, id));
    return result[0].affectedRows > 0;
  }

  // Pricing
  async getPricing(): Promise<Pricing[]> {
    return await db.select().from(pricing);
  }
  async createPricing(pricingData: InsertPricing): Promise<Pricing> {
    const result = await db.insert(pricing).values(pricingData);
    const newId = result[0].insertId;
    return (await db.select().from(pricing).where(eq(pricing.id, newId)))[0];
  }
  async updatePricing(id: number, pricingData: Partial<InsertPricing>): Promise<Pricing> {
    await db.update(pricing).set(pricingData).where(eq(pricing.id, id));
    return (await db.select().from(pricing).where(eq(pricing.id, id)))[0];
  }
  async deletePricing(id: number): Promise<boolean> {
    const result = await db.delete(pricing).where(eq(pricing.id, id));
    return result[0].affectedRows > 0;
  }

  // Sessions
  async createSession(userId: number): Promise<Session> {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const newSession = { userId, token, expiresAt };
    await db.insert(sessions).values(newSession);
    return newSession;
  }
  async getSession(token: string): Promise<Session | undefined> {
    return await db.select().from(sessions).where(eq(sessions.token, token)).then(rows => rows[0]);
  }
  async deleteSession(token: string): Promise<boolean> {
    const result = await db.delete(sessions).where(eq(sessions.token, token));
    return result[0].affectedRows > 0;
  }
}

export const storage: IStorage = new DrizzleStorage();
