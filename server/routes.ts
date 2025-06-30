import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcryptjs";
import {
  insertSkillSchema, insertExperienceSchema, insertProjectSchema,
  insertEducationSchema, insertActivitySchema, insertContactSchema,
  insertProfileSchema, insertArticleSchema, insertPricingSchema
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loginSchema = z.object({
  username: z.string(),
  password: z.string()
});

// Custom article schema that handles date string conversion
const articleSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  image: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
  createdAt: z.union([
    z.string().transform((val) => new Date(val)),
    z.date()
  ]).optional(),
  updatedAt: z.union([
    z.string().transform((val) => new Date(val)),
    z.date()
  ]).optional(),
});

// Konfigurasi multer untuk upload ke folder uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "uploads"));
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed!"));
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = await storage.getSession(token);
    if (!session) {
      return res.status(401).json({ message: "Invalid session" });
    }

    req.userId = session.userId;
    next();
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const session = await storage.createSession(user.id);
      res.json({ token: session.token, user: { id: user.id, username: user.username } });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/logout", requireAuth, async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      await storage.deleteSession(token);
    }
    res.json({ message: "Logged out successfully" });
  });

  // Profile routes
  app.get("/api/profile", async (req, res) => {
    const profile = await storage.getProfile();
    res.json(profile);
  });

  app.put("/api/profile", requireAuth, async (req: any, res: any) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.updateProfile(profileData);
      res.json(profile);
    } catch (error) {
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    const skills = await storage.getSkills();
    res.json(skills);
  });

  app.post("/api/skills", requireAuth, async (req, res) => {
    try {
      const skillData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(skillData);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.put("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const skillData = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(id, skillData);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.delete("/api/skills/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteSkill(id);
    if (deleted) {
      res.json({ message: "Skill deleted successfully" });
    } else {
      res.status(404).json({ message: "Skill not found" });
    }
  });

  // Experience routes
  app.get("/api/experiences", async (req, res) => {
    const experiences = await storage.getExperiences();
    res.json(experiences);
  });

  app.post("/api/experiences", requireAuth, async (req, res) => {
    try {
      const experienceData = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(experienceData);
      res.json(experience);
    } catch (error) {
      res.status(400).json({ message: "Invalid experience data" });
    }
  });

  app.put("/api/experiences/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const experienceData = insertExperienceSchema.partial().parse(req.body);
      const experience = await storage.updateExperience(id, experienceData);
      res.json(experience);
    } catch (error) {
      res.status(400).json({ message: "Invalid experience data" });
    }
  });

  app.delete("/api/experiences/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteExperience(id);
    if (deleted) {
      res.json({ message: "Experience deleted successfully" });
    } else {
      res.status(404).json({ message: "Experience not found" });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const projectData = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, projectData);
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).toString() });
      }
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteProject(id);
    if (deleted) {
      res.json({ message: "Project deleted successfully" });
    } else {
      res.status(404).json({ message: "Project not found" });
    }
  });

  // Education routes
  app.get("/api/education", async (req, res) => {
    const education = await storage.getEducation();
    res.json(education);
  });

  app.post("/api/education", requireAuth, async (req, res) => {
    try {
      const educationData = insertEducationSchema.parse(req.body);
      const education = await storage.createEducation(educationData);
      res.json(education);
    } catch (error) {
      res.status(400).json({ message: "Invalid education data" });
    }
  });

  app.put("/api/education/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const educationData = insertEducationSchema.partial().parse(req.body);
      const education = await storage.updateEducation(id, educationData);
      res.json(education);
    } catch (error) {
      res.status(400).json({ message: "Invalid education data" });
    }
  });

  app.delete("/api/education/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteEducation(id);
    if (deleted) {
      res.json({ message: "Education deleted successfully" });
    } else {
      res.status(404).json({ message: "Education not found" });
    }
  });

  // Activities routes
  app.get("/api/activities", async (req, res) => {
    const activities = await storage.getActivities();
    res.json(activities);
  });

  app.post("/api/activities", requireAuth, async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  app.put("/api/activities/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const activityData = insertActivitySchema.partial().parse(req.body);
      const activity = await storage.updateActivity(id, activityData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });

  app.delete("/api/activities/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteActivity(id);
    if (deleted) {
      res.json({ message: "Activity deleted successfully" });
    } else {
      res.status(404).json({ message: "Activity not found" });
    }
  });

  // Contact routes
  app.get("/api/contact", requireAuth, async (req, res) => {
    const contacts = await storage.getContacts();
    res.json(contacts);
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json(contact);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact data" });
    }
  });

  app.delete("/api/contact/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteContact(id);
    if (deleted) {
      res.json({ message: "Contact deleted successfully" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  });

  // Articles routes
  app.get("/api/articles", async (req, res) => {
    const articles = await storage.getPublishedArticles();
    res.json(articles);
  });

  app.get("/api/articles/all", async (req, res) => {
    const articles = await storage.getArticles();
    res.json(articles);
  });

  app.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const article = await storage.getArticle(id);
      if (!article) {
        res.status(404).json({ message: "Article not found" });
        return;
      }
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article ID" });
    }
  });

  app.post("/api/articles", requireAuth, async (req, res) => {
    try {
      const articleData = articleSchema.parse(req.body);
      const article = await storage.createArticle(articleData);
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });

  app.put("/api/articles/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const articleData = articleSchema.parse(req.body);
      const article = await storage.updateArticle(id, articleData);
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
  });

  app.delete("/api/articles/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deleteArticle(id);
    if (deleted) {
      res.json({ message: "Article deleted successfully" });
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  });

  // Pricing routes
  app.get("/api/pricing", async (req, res) => {
    const pricing = await storage.getPricing();
    res.json(pricing);
  });

  app.post("/api/pricing", requireAuth, async (req, res) => {
    try {
      const pricingData = insertPricingSchema.parse(req.body);
      const pricing = await storage.createPricing(pricingData);
      res.json(pricing);
    } catch (error) {
      res.status(400).json({ message: "Invalid pricing data" });
    }
  });

  app.put("/api/pricing/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const pricingData = insertPricingSchema.partial().parse(req.body);
      const pricing = await storage.updatePricing(id, pricingData);
      res.json(pricing);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
  });

  app.delete("/api/pricing/:id", requireAuth, async (req, res) => {
    const id = parseInt(req.params.id);
    const deleted = await storage.deletePricing(id);
    if (deleted) {
      res.json({ message: "Pricing deleted successfully" });
    } else {
      res.status(404).json({ message: "Pricing not found" });
    }
  });

  // Endpoint upload gambar (rewrite)
  app.post("/api/upload", requireAuth, (req: any, res: any) => {
    upload.single("file")(<any>req, <any>res, (err: any) => {
      if (err) {
        return res.status(400).json({ message: err.message || "Upload error" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const fileUrl = `/uploads/${req.file.filename}`;
      res.status(200).json({ url: fileUrl });
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
