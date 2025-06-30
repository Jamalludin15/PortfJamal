"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.MemStorage = void 0;
var MemStorage = /** @class */ (function () {
    function MemStorage() {
        this.users = new Map();
        this.skills = new Map();
        this.experiences = new Map();
        this.projects = new Map();
        this.education = new Map();
        this.activities = new Map();
        this.contacts = new Map();
        this.articles = new Map();
        this.pricing = new Map();
        this.sessions = new Map();
        this.currentId = 1;
        this.initializeSampleData();
    }
    MemStorage.prototype.initializeSampleData = function () {
        var _this = this;
        // Create admin user
        var adminUser = {
            id: 1,
            username: "admin",
            password: "$2b$10$fOVqokmf3FRMrpdrBWVvR.ezpxDuseRGQ/Bc38m6jg1q72Km51S92" // "jamal2121"
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
            tiktokUrl: null,
            instagramUrl: null,
            contactHeading: null,
            contactDescription: null,
            contactMainHeading: null,
            contactMainDescription: null,
            contactSubHeading: null,
            contactSubDescription: null,
            experienceYears: 5,
            projectsCompleted: 50
        };
        // Skills data
        var skillsData = [
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
        skillsData.forEach(function (skill, index) {
            _this.skills.set(index + 1, __assign({ id: index + 1 }, skill));
        });
        // Experience data
        var experienceData = [
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
        experienceData.forEach(function (exp, index) {
            _this.experiences.set(index + 1, __assign({ id: index + 1 }, exp));
        });
        // Projects data
        var projectsData = [
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
        projectsData.forEach(function (project, index) {
            _this.projects.set(index + 1, __assign({ id: index + 1 }, project));
        });
        // Education data
        var educationData = [
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
        educationData.forEach(function (edu, index) {
            _this.education.set(index + 1, __assign({ id: index + 1 }, edu));
        });
        // Activities data
        var activitiesData = [
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
        activitiesData.forEach(function (activity, index) {
            _this.activities.set(index + 1, __assign({ id: index + 1 }, activity));
        });
        // Articles data
        var articlesData = [
            {
                title: "Building Modern Web Applications with React and TypeScript",
                content: "In this comprehensive guide, we'll explore how to build scalable web applications using React and TypeScript. We'll cover best practices, common patterns, and advanced techniques that will help you create maintainable and performant applications.\n\n## Getting Started\n\nTypeScript provides static typing for JavaScript, which helps catch errors early in development and improves code quality. When combined with React, it creates a powerful development experience.\n\n## Key Benefits\n\n- **Type Safety**: Catch errors at compile time\n- **Better IDE Support**: Enhanced autocomplete and refactoring\n- **Improved Maintainability**: Self-documenting code\n- **Team Collaboration**: Clear interfaces and contracts",
                excerpt: "Learn how to build scalable web applications using React and TypeScript with best practices and advanced techniques.",
                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&h=400",
                tags: ["React", "TypeScript", "Web Development"],
                published: true
            },
            {
                title: "The Future of Full-Stack Development",
                content: "The landscape of full-stack development is constantly evolving. New frameworks, tools, and methodologies are emerging that promise to make development faster, more efficient, and more enjoyable.\n\n## Current Trends\n\n- **Serverless Architecture**: Reducing infrastructure complexity\n- **Edge Computing**: Bringing computation closer to users\n- **AI Integration**: Automating development tasks\n- **Microservices**: Building scalable applications\n\n## What's Next?\n\nAs we look to the future, we can expect to see more integration between frontend and backend technologies, improved developer experience tools, and new paradigms for building applications.",
                excerpt: "Explore the latest trends and future directions in full-stack development, from serverless architecture to AI integration.",
                image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&h=400",
                tags: ["Full-Stack", "Trends", "Technology"],
                published: true
            },
            {
                title: "Optimizing Performance in React Applications",
                content: "Performance optimization is crucial for providing a great user experience. In this article, we'll explore various techniques for optimizing React applications.\n\n## Common Performance Issues\n\n- **Unnecessary Re-renders**: Components updating when they don't need to\n- **Large Bundle Sizes**: Slow initial load times\n- **Memory Leaks**: Applications consuming more memory over time\n\n## Optimization Techniques\n\n1. **React.memo**: Prevent unnecessary re-renders\n2. **useMemo and useCallback**: Memoize expensive calculations\n3. **Code Splitting**: Load only what's needed\n4. **Lazy Loading**: Defer loading of non-critical components",
                excerpt: "Discover effective techniques for optimizing React application performance and improving user experience.",
                image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&h=400",
                tags: ["React", "Performance", "Optimization"],
                published: true
            }
        ];
        articlesData.forEach(function (article, index) {
            var now = new Date();
            _this.articles.set(index + 1, __assign(__assign({ id: index + 1 }, article), { createdAt: now, updatedAt: now }));
        });
        // Pricing data
        var pricingData = [
            {
                price: 1200,
                currency: "USD",
                period: "per project",
                title: "Project Pricing",
                description: "Professional web development services including design, development, testing, and deployment. Custom solutions tailored to your specific needs.",
                features: [
                    "Custom Design & Development",
                    "Responsive Web Applications",
                    "Testing & Quality Assurance",
                    "Deployment & Hosting Setup",
                    "Post-Launch Support",
                    "SEO Optimization"
                ],
                isActive: true,
                isPremium: true,
            }
        ];
        pricingData.forEach(function (pricing, index) {
            var now = new Date();
            _this.pricing.set(index + 1, __assign(__assign({ id: index + 1 }, pricing), { createdAt: now, updatedAt: now }));
        });
        this.currentId = 100;
    };
    // Users
    MemStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.users.get(id)];
            });
        });
    };
    MemStorage.prototype.getUserByUsername = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.users.values()).find(function (user) { return user.username === username; })];
            });
        });
    };
    MemStorage.prototype.createUser = function (insertUser) {
        return __awaiter(this, void 0, void 0, function () {
            var id, user;
            return __generator(this, function (_a) {
                id = this.currentId++;
                user = __assign(__assign({}, insertUser), { id: id });
                this.users.set(id, user);
                return [2 /*return*/, user];
            });
        });
    };
    // Profile
    MemStorage.prototype.getProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.profile];
            });
        });
    };
    MemStorage.prototype.updateProfile = function (profileData) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            var _a;
            return __generator(this, function (_b) {
                id = ((_a = this.profile) === null || _a === void 0 ? void 0 : _a.id) || 1;
                this.profile = __assign(__assign({}, profileData), { id: id });
                return [2 /*return*/, this.profile];
            });
        });
    };
    // Skills
    MemStorage.prototype.getSkills = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.skills.values())];
            });
        });
    };
    MemStorage.prototype.createSkill = function (insertSkill) {
        return __awaiter(this, void 0, void 0, function () {
            var id, skill;
            return __generator(this, function (_a) {
                id = this.currentId++;
                skill = __assign(__assign({}, insertSkill), { id: id });
                this.skills.set(id, skill);
                return [2 /*return*/, skill];
            });
        });
    };
    MemStorage.prototype.updateSkill = function (id, skillData) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, updated;
            return __generator(this, function (_a) {
                existing = this.skills.get(id);
                if (!existing)
                    throw new Error("Skill not found");
                updated = __assign(__assign({}, existing), skillData);
                this.skills.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.deleteSkill = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.skills.delete(id)];
            });
        });
    };
    // Experiences
    MemStorage.prototype.getExperiences = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.experiences.values()).sort(function (a, b) {
                        if (a.current && !b.current)
                            return -1;
                        if (!a.current && b.current)
                            return 1;
                        return 0;
                    })];
            });
        });
    };
    MemStorage.prototype.createExperience = function (insertExperience) {
        return __awaiter(this, void 0, void 0, function () {
            var id, experience;
            return __generator(this, function (_a) {
                id = this.currentId++;
                experience = __assign(__assign({}, insertExperience), { id: id });
                this.experiences.set(id, experience);
                return [2 /*return*/, experience];
            });
        });
    };
    MemStorage.prototype.updateExperience = function (id, experienceData) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, updated;
            return __generator(this, function (_a) {
                existing = this.experiences.get(id);
                if (!existing)
                    throw new Error("Experience not found");
                updated = __assign(__assign({}, existing), experienceData);
                this.experiences.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.deleteExperience = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.experiences.delete(id)];
            });
        });
    };
    // Projects
    MemStorage.prototype.getProjects = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.projects.values()).sort(function (a, b) {
                        if (a.featured && !b.featured)
                            return -1;
                        if (!a.featured && b.featured)
                            return 1;
                        return 0;
                    })];
            });
        });
    };
    MemStorage.prototype.createProject = function (insertProject) {
        return __awaiter(this, void 0, void 0, function () {
            var id, project;
            return __generator(this, function (_a) {
                id = this.currentId++;
                project = __assign(__assign({}, insertProject), { id: id });
                this.projects.set(id, project);
                return [2 /*return*/, project];
            });
        });
    };
    MemStorage.prototype.updateProject = function (id, projectData) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, updated;
            return __generator(this, function (_a) {
                existing = this.projects.get(id);
                if (!existing)
                    throw new Error("Project not found");
                updated = __assign(__assign({}, existing), projectData);
                this.projects.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.deleteProject = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.projects.delete(id)];
            });
        });
    };
    // Education
    MemStorage.prototype.getEducation = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.education.values())];
            });
        });
    };
    MemStorage.prototype.createEducation = function (insertEducation) {
        return __awaiter(this, void 0, void 0, function () {
            var id, education;
            return __generator(this, function (_a) {
                id = this.currentId++;
                education = __assign(__assign({}, insertEducation), { id: id });
                this.education.set(id, education);
                return [2 /*return*/, education];
            });
        });
    };
    MemStorage.prototype.updateEducation = function (id, educationData) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, updated;
            return __generator(this, function (_a) {
                existing = this.education.get(id);
                if (!existing)
                    throw new Error("Education not found");
                updated = __assign(__assign({}, existing), educationData);
                this.education.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.deleteEducation = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.education.delete(id)];
            });
        });
    };
    // Activities
    MemStorage.prototype.getActivities = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.activities.values())];
            });
        });
    };
    MemStorage.prototype.createActivity = function (insertActivity) {
        return __awaiter(this, void 0, void 0, function () {
            var id, activity;
            return __generator(this, function (_a) {
                id = this.currentId++;
                activity = __assign(__assign({}, insertActivity), { id: id });
                this.activities.set(id, activity);
                return [2 /*return*/, activity];
            });
        });
    };
    MemStorage.prototype.updateActivity = function (id, activityData) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, updated;
            return __generator(this, function (_a) {
                existing = this.activities.get(id);
                if (!existing)
                    throw new Error("Activity not found");
                updated = __assign(__assign({}, existing), activityData);
                this.activities.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.deleteActivity = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.activities.delete(id)];
            });
        });
    };
    // Contacts
    MemStorage.prototype.getContacts = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.contacts.values()).sort(function (a, b) {
                        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
                    })];
            });
        });
    };
    MemStorage.prototype.createContact = function (insertContact) {
        return __awaiter(this, void 0, void 0, function () {
            var id, contact;
            return __generator(this, function (_a) {
                id = this.currentId++;
                contact = __assign(__assign({}, insertContact), { id: id, createdAt: new Date() });
                this.contacts.set(id, contact);
                return [2 /*return*/, contact];
            });
        });
    };
    MemStorage.prototype.deleteContact = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.contacts.delete(id)];
            });
        });
    };
    // Articles
    MemStorage.prototype.getArticles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.articles.values()).map(function (article) { return (__assign(__assign({}, article), { createdAt: article.createdAt ? article.createdAt.toISOString() : null, updatedAt: article.updatedAt ? article.updatedAt.toISOString() : null })); })];
            });
        });
    };
    MemStorage.prototype.getPublishedArticles = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.articles.values())
                        .filter(function (article) { return article.published; })
                        .map(function (article) { return (__assign(__assign({}, article), { createdAt: article.createdAt ? article.createdAt.toISOString() : null, updatedAt: article.updatedAt ? article.updatedAt.toISOString() : null })); })];
            });
        });
    };
    MemStorage.prototype.getArticle = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var article;
            return __generator(this, function (_a) {
                article = this.articles.get(id);
                if (!article)
                    return [2 /*return*/, undefined];
                return [2 /*return*/, __assign(__assign({}, article), { createdAt: article.createdAt ? article.createdAt.toISOString() : null, updatedAt: article.updatedAt ? article.updatedAt.toISOString() : null })];
            });
        });
    };
    MemStorage.prototype.createArticle = function (insertArticle) {
        return __awaiter(this, void 0, void 0, function () {
            var id, now, article;
            return __generator(this, function (_a) {
                id = this.currentId++;
                now = new Date();
                article = {
                    id: id,
                    title: insertArticle.title,
                    content: insertArticle.content,
                    excerpt: insertArticle.excerpt || null,
                    image: insertArticle.image || null,
                    tags: insertArticle.tags || null,
                    published: insertArticle.published || null,
                    createdAt: insertArticle.createdAt ? new Date(insertArticle.createdAt) : now,
                    updatedAt: insertArticle.updatedAt ? new Date(insertArticle.updatedAt) : now
                };
                this.articles.set(id, article);
                return [2 /*return*/, article];
            });
        });
    };
    MemStorage.prototype.updateArticle = function (id, articleData) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, updated;
            return __generator(this, function (_a) {
                existing = this.articles.get(id);
                if (!existing)
                    throw new Error("Article not found");
                updated = __assign(__assign(__assign({}, existing), articleData), { updatedAt: new Date() });
                this.articles.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.deleteArticle = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.articles.delete(id)];
            });
        });
    };
    // Pricing
    MemStorage.prototype.getPricing = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Array.from(this.pricing.values()).filter(function (p) { return p.isActive; })];
            });
        });
    };
    MemStorage.prototype.createPricing = function (insertPricing) {
        return __awaiter(this, void 0, void 0, function () {
            var id, now, pricing;
            return __generator(this, function (_a) {
                id = this.currentId++;
                now = new Date();
                pricing = __assign(__assign({}, insertPricing), { id: id, createdAt: now, updatedAt: now });
                this.pricing.set(id, pricing);
                return [2 /*return*/, pricing];
            });
        });
    };
    MemStorage.prototype.updatePricing = function (id, pricingData) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, updated;
            return __generator(this, function (_a) {
                existing = this.pricing.get(id);
                if (!existing)
                    throw new Error("Pricing not found");
                updated = __assign(__assign(__assign({}, existing), pricingData), { updatedAt: new Date() });
                this.pricing.set(id, updated);
                return [2 /*return*/, updated];
            });
        });
    };
    MemStorage.prototype.deletePricing = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.pricing.delete(id)];
            });
        });
    };
    // Sessions
    MemStorage.prototype.createSession = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var token, expiresAt, session;
            return __generator(this, function (_a) {
                token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
                session = {
                    id: this.currentId++,
                    userId: userId,
                    token: token,
                    expiresAt: expiresAt
                };
                this.sessions.set(token, session);
                return [2 /*return*/, session];
            });
        });
    };
    MemStorage.prototype.getSession = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var session;
            return __generator(this, function (_a) {
                session = this.sessions.get(token);
                if (!session)
                    return [2 /*return*/, undefined];
                if (session.expiresAt < new Date()) {
                    this.sessions.delete(token);
                    return [2 /*return*/, undefined];
                }
                return [2 /*return*/, session];
            });
        });
    };
    MemStorage.prototype.deleteSession = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.sessions.delete(token)];
            });
        });
    };
    return MemStorage;
}());
exports.MemStorage = MemStorage;
exports.storage = new MemStorage();
