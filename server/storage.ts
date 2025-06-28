import {
  users, profile, skills, experiences, projects, education, activities, contacts, sessions,
  type User, type InsertUser, type Profile, type InsertProfile,
  type Skill, type InsertSkill, type Experience, type InsertExperience,
  type Project, type InsertProject, type Education, type InsertEducation,
  type Activity, type InsertActivity, type Contact, type InsertContact,
  type Session
} from "@shared/schema";

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
  
  // Sessions
  createSession(userId: number): Promise<Session>;
  getSession(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private profile: Profile | undefined;
  private skills: Map<number, Skill> = new Map();
  private experiences: Map<number, Experience> = new Map();
  private projects: Map<number, Project> = new Map();
  private education: Map<number, Education> = new Map();
  private activities: Map<number, Activity> = new Map();
  private contacts: Map<number, Contact> = new Map();
  private sessions: Map<string, Session> = new Map();
  private currentId: number = 1;

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create admin user
    const adminUser: User = {
      id: 1,
      username: "admin",
      password: "$2b$10$rOmn8P1q1CQ1K5ZnNKnXf.6gqHs0ZZn9.QJ2QZQ2KzQZqnKzQZqnK" // "admin"
    };
    this.users.set(1, adminUser);

    // Profile data
    this.profile = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      title: "Full Stack Developer",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      heroDescription: "Passionate about creating exceptional digital experiences through clean code and innovative solutions. Specializing in modern web technologies and user-centered design.",
      aboutTitle: "Building Digital Solutions That Matter",
      aboutDescription1: "With over 5 years of experience in full-stack development, I specialize in creating scalable web applications using modern technologies like React, Node.js, and TypeScript. My passion lies in solving complex problems and turning innovative ideas into reality.",
      aboutDescription2: "I believe in writing clean, maintainable code and following best practices. When I'm not coding, you can find me contributing to open-source projects, mentoring junior developers, or exploring the latest trends in web development.",
      aboutDescription3: "I'm always excited to take on new challenges and collaborate with teams that share my enthusiasm for creating exceptional user experiences.",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800",
      githubUrl: "https://github.com/johndoe",
      linkedinUrl: "https://linkedin.com/in/johndoe",
      twitterUrl: "https://twitter.com/johndoe",
      experienceYears: 5,
      projectsCompleted: 50
    };

    // Skills data
    const skillsData = [
      { name: "React & TypeScript", category: "Frontend Development", level: 95, icon: "fab fa-react" },
      { name: "Next.js & Vite", category: "Frontend Development", level: 85, icon: "fas fa-code" },
      { name: "Tailwind CSS", category: "Frontend Development", level: 90, icon: "fas fa-palette" },
      { name: "Node.js & Express", category: "Backend Development", level: 90, icon: "fab fa-node-js" },
      { name: "Prisma ORM", category: "Backend Development", level: 85, icon: "fas fa-database" },
      { name: "REST APIs", category: "Backend Development", level: 95, icon: "fas fa-server" },
      { name: "SQLite & PostgreSQL", category: "Database & Tools", level: 80, icon: "fas fa-database" },
      { name: "Git & GitHub", category: "Database & Tools", level: 95, icon: "fab fa-git-alt" },
      { name: "Docker & CI/CD", category: "Database & Tools", level: 70, icon: "fab fa-docker" }
    ];

    skillsData.forEach((skill, index) => {
      this.skills.set(index + 1, { id: index + 1, ...skill });
    });

    // Experience data
    const experienceData = [
      {
        title: "Senior Full Stack Developer",
        company: "Tech Innovations Inc.",
        period: "2022 - Present",
        description: "Leading development of scalable web applications using React, Node.js, and cloud technologies. Mentoring junior developers and implementing best practices for code quality and performance.",
        technologies: ["React", "TypeScript", "Node.js"],
        current: true
      },
      {
        title: "Full Stack Developer",
        company: "Digital Solutions Ltd.",
        period: "2020 - 2022",
        description: "Developed and maintained multiple client projects using modern web technologies. Collaborated with design teams to create responsive and user-friendly interfaces.",
        technologies: ["Vue.js", "Express", "MongoDB"],
        current: false
      },
      {
        title: "Junior Developer",
        company: "StartUp Ventures",
        period: "2019 - 2020",
        description: "Started my professional journey building internal tools and learning modern development practices. Gained experience in agile methodologies and collaborative development workflows.",
        technologies: ["JavaScript", "PHP", "MySQL"],
        current: false
      }
    ];

    experienceData.forEach((exp, index) => {
      this.experiences.set(index + 1, { id: index + 1, ...exp });
    });

    // Projects data
    const projectsData = [
      {
        title: "E-commerce Platform",
        description: "A full-featured e-commerce platform with user authentication, payment processing, inventory management, and admin dashboard.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&h=400",
        technologies: ["React", "Node.js", "Stripe"],
        liveUrl: "https://example.com",
        githubUrl: "https://github.com/johndoe/ecommerce",
        featured: true
      },
      {
        title: "Task Management App",
        description: "A collaborative task management application with real-time updates, team workspaces, and advanced project tracking features.",
        image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&h=400",
        technologies: ["Next.js", "Socket.io", "PostgreSQL"],
        liveUrl: "https://example.com",
        githubUrl: "https://github.com/johndoe/taskmanager",
        featured: true
      },
      {
        title: "Analytics Dashboard",
        description: "A comprehensive analytics dashboard with interactive charts, real-time data visualization, and customizable reporting features.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&h=400",
        technologies: ["React", "D3.js", "Express"],
        liveUrl: "https://example.com",
        githubUrl: "https://github.com/johndoe/analytics",
        featured: true
      }
    ];

    projectsData.forEach((project, index) => {
      this.projects.set(index + 1, { id: index + 1, ...project });
    });

    // Education data
    const educationData = [
      {
        degree: "Bachelor of Computer Science",
        institution: "University of Technology",
        period: "2015 - 2019",
        description: "Focused on software engineering, data structures, algorithms, and web development. Graduated with honors and completed a capstone project on distributed systems.",
        type: "degree"
      },
      {
        degree: "AWS Certified Developer",
        institution: "Amazon Web Services",
        period: "2023",
        description: "Demonstrated expertise in developing and maintaining applications on AWS platform, including Lambda, DynamoDB, S3, and other core services.",
        type: "certification"
      }
    ];

    educationData.forEach((edu, index) => {
      this.education.set(index + 1, { id: index + 1, ...edu });
    });

    // Activities data
    const activitiesData = [
      {
        title: "Open Source Contributor",
        description: "Active contributor to various open-source projects on GitHub. Maintained libraries with 1000+ stars and contributed to popular frameworks like React and Node.js ecosystem.",
        icon: "fas fa-users",
        url: "https://github.com/johndoe"
      },
      {
        title: "Tech Mentor",
        description: "Mentoring junior developers through coding bootcamps and online platforms. Helped 50+ developers transition into tech careers with personalized guidance and code reviews.",
        icon: "fas fa-chalkboard-teacher",
        url: "#"
      },
      {
        title: "Conference Speaker",
        description: "Regular speaker at tech conferences and meetups, sharing insights on modern web development, React best practices, and building scalable applications.",
        icon: "fas fa-microphone",
        url: "#"
      }
    ];

    activitiesData.forEach((activity, index) => {
      this.activities.set(index + 1, { id: index + 1, ...activity });
    });

    this.currentId = 100;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Profile
  async getProfile(): Promise<Profile | undefined> {
    return this.profile;
  }

  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    const id = this.profile?.id || 1;
    this.profile = { ...profileData, id };
    return this.profile;
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return Array.from(this.skills.values());
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = this.currentId++;
    const skill: Skill = { ...insertSkill, id };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: number, skillData: Partial<InsertSkill>): Promise<Skill> {
    const existing = this.skills.get(id);
    if (!existing) throw new Error("Skill not found");
    const updated = { ...existing, ...skillData };
    this.skills.set(id, updated);
    return updated;
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Experiences
  async getExperiences(): Promise<Experience[]> {
    return Array.from(this.experiences.values()).sort((a, b) => {
      if (a.current && !b.current) return -1;
      if (!a.current && b.current) return 1;
      return 0;
    });
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = this.currentId++;
    const experience: Experience = { ...insertExperience, id };
    this.experiences.set(id, experience);
    return experience;
  }

  async updateExperience(id: number, experienceData: Partial<InsertExperience>): Promise<Experience> {
    const existing = this.experiences.get(id);
    if (!existing) throw new Error("Experience not found");
    const updated = { ...existing, ...experienceData };
    this.experiences.set(id, updated);
    return updated;
  }

  async deleteExperience(id: number): Promise<boolean> {
    return this.experiences.delete(id);
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, projectData: Partial<InsertProject>): Promise<Project> {
    const existing = this.projects.get(id);
    if (!existing) throw new Error("Project not found");
    const updated = { ...existing, ...projectData };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Education
  async getEducation(): Promise<Education[]> {
    return Array.from(this.education.values());
  }

  async createEducation(insertEducation: InsertEducation): Promise<Education> {
    const id = this.currentId++;
    const education: Education = { ...insertEducation, id };
    this.education.set(id, education);
    return education;
  }

  async updateEducation(id: number, educationData: Partial<InsertEducation>): Promise<Education> {
    const existing = this.education.get(id);
    if (!existing) throw new Error("Education not found");
    const updated = { ...existing, ...educationData };
    this.education.set(id, updated);
    return updated;
  }

  async deleteEducation(id: number): Promise<boolean> {
    return this.education.delete(id);
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = { ...insertActivity, id };
    this.activities.set(id, activity);
    return activity;
  }

  async updateActivity(id: number, activityData: Partial<InsertActivity>): Promise<Activity> {
    const existing = this.activities.get(id);
    if (!existing) throw new Error("Activity not found");
    const updated = { ...existing, ...activityData };
    this.activities.set(id, updated);
    return updated;
  }

  async deleteActivity(id: number): Promise<boolean> {
    return this.activities.delete(id);
  }

  // Contacts
  async getContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = this.currentId++;
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async deleteContact(id: number): Promise<boolean> {
    return this.contacts.delete(id);
  }

  // Sessions
  async createSession(userId: number): Promise<Session> {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session: Session = {
      id: this.currentId++,
      userId,
      token,
      expiresAt
    };
    this.sessions.set(token, session);
    return session;
  }

  async getSession(token: string): Promise<Session | undefined> {
    const session = this.sessions.get(token);
    if (!session) return undefined;
    if (session.expiresAt < new Date()) {
      this.sessions.delete(token);
      return undefined;
    }
    return session;
  }

  async deleteSession(token: string): Promise<boolean> {
    return this.sessions.delete(token);
  }
}

export const storage = new MemStorage();
