import { mysqlTable, serial, varchar, text, int, boolean, timestamp } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement().notNull(),
  username: varchar("username", { length: 100 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const profile = mysqlTable("profile", {
  id: int("id").primaryKey().autoincrement().notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 100 }),
  heroDescription: text("hero_description"),
  aboutTitle: varchar("about_title", { length: 255 }),
  aboutDescription1: text("about_description_1"),
  aboutDescription2: text("about_description_2"),
  aboutDescription3: text("about_description_3"),
  profileImage: varchar("profile_image", { length: 255 }),
  githubUrl: varchar("github_url", { length: 255 }),
  linkedinUrl: varchar("linkedin_url", { length: 255 }),
  twitterUrl: varchar("twitter_url", { length: 255 }),
  tiktokUrl: varchar("tiktok_url", { length: 255 }),
  instagramUrl: varchar("instagram_url", { length: 255 }),
  contactHeading: varchar("contact_heading", { length: 255 }),
  contactDescription: text("contact_description"),
  contactMainHeading: varchar("contact_main_heading", { length: 255 }),
  contactMainDescription: text("contact_main_description"),
  contactSubHeading: varchar("contact_sub_heading", { length: 255 }),
  contactSubDescription: text("contact_sub_description"),
  experienceYears: int("experience_years").default(0),
  projectsCompleted: int("projects_completed").default(0),
});

export const skills = mysqlTable("skills", {
  id: int("id").primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  level: int("level").notNull(), // 1-100
  icon: varchar("icon", { length: 100 }),
});

export const experiences = mysqlTable("experiences", {
  id: int("id").primaryKey().autoincrement().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  period: varchar("period", { length: 100 }).notNull(),
  description: text("description").notNull(),
  technologies: text("technologies"), // JSON string array
  current: boolean("current").default(false),
});

export const projects = mysqlTable("projects", {
  id: int("id").primaryKey().autoincrement().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 255 }),
  technologies: text("technologies"), // JSON string array
  liveUrl: varchar("live_url", { length: 255 }),
  githubUrl: varchar("github_url", { length: 255 }),
  featured: boolean("featured").default(false),
});

export const education = mysqlTable("education", {
  id: int("id").primaryKey().autoincrement().notNull(),
  degree: varchar("degree", { length: 255 }).notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  period: varchar("period", { length: 100 }).notNull(),
  description: text("description"),
  type: varchar("type", { length: 100 }).notNull(), // "degree" or "certification"
});

export const activities = mysqlTable("activities", {
  id: int("id").primaryKey().autoincrement().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 100 }),
  url: varchar("url", { length: 255 }),
});

export const contacts = mysqlTable("contacts", {
  id: int("id").primaryKey().autoincrement().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const articles = mysqlTable("articles", {
  id: int("id").primaryKey().autoincrement().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  image: varchar("image", { length: 255 }),
  tags: text("tags"), // JSON string array
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pricing = mysqlTable("pricing", {
  id: int("id").primaryKey().autoincrement().notNull(),
  price: int("price").notNull(),
  currency: varchar("currency", { length: 10 }).notNull().default("USD"),
  period: varchar("period", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  features: text("features"), // JSON string array
  isActive: boolean("is_active").default(true),
  isPremium: boolean("is_premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sessions = mysqlTable("sessions", {
  id: int("id").primaryKey().autoincrement().notNull(),
  userId: int("user_id").references(() => users.id),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProfileSchema = createInsertSchema(profile).omit({ id: true });
export const insertSkillSchema = createInsertSchema(skills).omit({ id: true });
export const insertExperienceSchema = createInsertSchema(experiences, {
  technologies: z.preprocess(
    (val) => {
      if (Array.isArray(val)) {
        return JSON.stringify(val);
      }
      return val;
    },
    z.string().optional()
  )
}).omit({ id: true });
export const insertProjectSchema = createInsertSchema(projects, {
  technologies: z.preprocess(
    (val) => {
      if (Array.isArray(val)) {
        return JSON.stringify(val);
      }
      return val;
    },
    z.string().optional()
  )
}).omit({ id: true });
export const insertEducationSchema = createInsertSchema(education).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true });
export const insertArticleSchema = createInsertSchema(articles, {
  tags: z.preprocess(
    (val) => {
      if (Array.isArray(val)) {
        return JSON.stringify(val);
      }
      return val;
    },
    z.string().optional()
  )
}).omit({ id: true });
export const insertPricingSchema = createInsertSchema(pricing, {
  features: z.preprocess(
    (val) => {
      if (Array.isArray(val)) {
        return JSON.stringify(val);
      }
      return val;
    },
    z.string().optional()
  ),
  price: z.coerce.number().min(0, "Price must be 0 or greater"),
}).omit({ id: true, createdAt: true, updatedAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Profile = typeof profile.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Experience = typeof experiences.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Education = typeof education.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Pricing = typeof pricing.$inferSelect;
export type InsertPricing = z.infer<typeof insertPricingSchema>;
export type Session = typeof sessions.$inferSelect;
