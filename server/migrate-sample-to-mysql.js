"use strict";
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
var storage_1 = require("./storage");
var promise_1 = require("mysql2/promise");
// Konfigurasi koneksi MySQL
var connectionConfig = {
    host: "localhost",
    user: "root",
    password: "", // ganti jika ada password
    database: "portfolio_db",
};
function migrate() {
    return __awaiter(this, void 0, void 0, function () {
        var storage, conn, _i, _a, user, p, _b, _c, skill, _d, _e, exp, _f, _g, proj, _h, _j, edu, _k, _l, act, _m, _o, contact, _p, _q, art, _r, _s, price, _t, _u, session;
        return __generator(this, function (_v) {
            switch (_v.label) {
                case 0:
                    storage = new storage_1.MemStorage();
                    return [4 /*yield*/, promise_1.default.createConnection(connectionConfig)];
                case 1:
                    conn = _v.sent();
                    _i = 0, _a = Array.from(storage.users.values());
                    _v.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    user = _a[_i];
                    return [4 /*yield*/, conn.execute("INSERT IGNORE INTO users (id, username, password) VALUES (?, ?, ?)", [user.id, user.username, user.password])];
                case 3:
                    _v.sent();
                    _v.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    if (!storage.profile) return [3 /*break*/, 7];
                    p = storage.profile;
                    return [4 /*yield*/, conn.execute("INSERT IGNORE INTO profile (id, first_name, last_name, title, email, phone, location, hero_description, about_title, about_description_1, about_description_2, about_description_3, profile_image, github_url, linkedin_url, twitter_url, tiktok_url, instagram_url, contact_heading, contact_description, contact_main_heading, contact_main_description, contact_sub_heading, contact_sub_description, experience_years, projects_completed)\n      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [p.id, p.firstName, p.lastName, p.title, p.email, p.phone, p.location, p.heroDescription, p.aboutTitle, p.aboutDescription1, p.aboutDescription2, p.aboutDescription3, p.profileImage, p.githubUrl, p.linkedinUrl, p.twitterUrl, p.tiktokUrl, p.instagramUrl, p.contactHeading, p.contactDescription, p.contactMainHeading, p.contactMainDescription, p.contactSubHeading, p.contactSubDescription, p.experienceYears, p.projectsCompleted])];
                case 6:
                    _v.sent();
                    _v.label = 7;
                case 7:
                    _b = 0, _c = Array.from(storage.skills.values());
                    _v.label = 8;
                case 8:
                    if (!(_b < _c.length)) return [3 /*break*/, 11];
                    skill = _c[_b];
                    return [4 /*yield*/, conn.execute("INSERT IGNORE INTO skills (id, name, category, level, icon) VALUES (?, ?, ?, ?, ?)", [skill.id, skill.name, skill.category, skill.level, skill.icon])];
                case 9:
                    _v.sent();
                    _v.label = 10;
                case 10:
                    _b++;
                    return [3 /*break*/, 8];
                case 11:
                    _d = 0, _e = Array.from(storage.experiences.values());
                    _v.label = 12;
                case 12:
                    if (!(_d < _e.length)) return [3 /*break*/, 15];
                    exp = _e[_d];
                    return [4 /*yield*/, conn.execute("INSERT IGNORE INTO experiences (id, title, company, period, description, technologies, current) VALUES (?, ?, ?, ?, ?, ?, ?)", [exp.id, exp.title, exp.company, exp.period, exp.description, JSON.stringify(exp.technologies), exp.current])];
                case 13:
                    _v.sent();
                    _v.label = 14;
                case 14:
                    _d++;
                    return [3 /*break*/, 12];
                case 15:
                    _f = 0, _g = Array.from(storage.projects.values());
                    _v.label = 16;
                case 16:
                    if (!(_f < _g.length)) return [3 /*break*/, 19];
                    proj = _g[_f];
                    return [4 /*yield*/, conn.execute("INSERT IGNORE INTO projects (id, title, description, image, technologies, live_url, github_url, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [proj.id, proj.title, proj.description, proj.image, JSON.stringify(proj.technologies), proj.liveUrl, proj.githubUrl, proj.featured])];
                case 17:
                    _v.sent();
                    _v.label = 18;
                case 18:
                    _f++;
                    return [3 /*break*/, 16];
                case 19:
                    _h = 0, _j = Array.from(storage.education.values());
                    _v.label = 20;
                case 20:
                    if (!(_h < _j.length)) return [3 /*break*/, 23];
                    edu = _j[_h];
                    return [4 /*yield*/, conn.execute("INSERT IGNORE INTO education (id, degree, institution, period, description, type) VALUES (?, ?, ?, ?, ?, ?)", [edu.id, edu.degree, edu.institution, edu.period, edu.description, edu.type])];
                case 21:
                    _v.sent();
                    _v.label = 22;
                case 22:
                    _h++;
                    return [3 /*break*/, 20];
                case 23:
                    _k = 0, _l = Array.from(storage.activities.values());
                    _v.label = 24;
                case 24:
                    if (!(_k < _l.length)) return [3 /*break*/, 27];
                    act = _l[_k];
                    return [4 /*yield*/, conn.execute("INSERT IGNORE INTO activities (id, title, description, icon, url) VALUES (?, ?, ?, ?, ?)", [act.id, act.title, act.description, act.icon, act.url])];
                case 25:
                    _v.sent();
                    _v.label = 26;
                case 26:
                    _k++;
                    return [3 /*break*/, 24];
                case 27:
                    _m = 0, _o = Array.from(storage.contacts.values());
                    _v.label = 28;
                case 28:
                    if (!(_m < _o.length)) return [3 /*break*/, 31];
                    contact = _o[_m];
                    return [4 /*yield*/, conn.execute("INSERT IGNORE INTO contacts (id, name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?, ?)", [contact.id, contact.name, contact.email, contact.subject, contact.message, contact.createdAt || new Date()])];
                case 29:
                    _v.sent();
                    _v.label = 30;
                case 30:
                    _m++;
                    return [3 /*break*/, 28];
                case 31:
                    _p = 0, _q = Array.from(storage.articles.values());
                    _v.label = 32;
                case 32:
                    if (!(_p < _q.length)) return [3 /*break*/, 35];
                    art = _q[_p];
                    return [4 /*yield*/, conn.execute("INSERT IGNORE INTO articles (id, title, content, excerpt, image, tags, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [art.id, art.title, art.content, art.excerpt, art.image, JSON.stringify(art.tags), art.published, art.createdAt || new Date(), art.updatedAt || new Date()])];
                case 33:
                    _v.sent();
                    _v.label = 34;
                case 34:
                    _p++;
                    return [3 /*break*/, 32];
                case 35:
                    _r = 0, _s = Array.from(storage.pricing.values());
                    _v.label = 36;
                case 36:
                    if (!(_r < _s.length)) return [3 /*break*/, 39];
                    price = _s[_r];
                    return [4 /*yield*/, conn.execute("INSERT IGNORE INTO pricing (id, price, currency, period, title, description, features, is_active, is_premium, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [price.id, price.price, price.currency, price.period, price.title, price.description, JSON.stringify(price.features), price.isActive, price.isPremium, price.createdAt || new Date(), price.updatedAt || new Date()])];
                case 37:
                    _v.sent();
                    _v.label = 38;
                case 38:
                    _r++;
                    return [3 /*break*/, 36];
                case 39:
                    _t = 0, _u = Array.from(storage.sessions.values());
                    _v.label = 40;
                case 40:
                    if (!(_t < _u.length)) return [3 /*break*/, 43];
                    session = _u[_t];
                    return [4 /*yield*/, conn.execute("INSERT IGNORE INTO sessions (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)", [session.id, session.userId, session.token, session.expiresAt || new Date()])];
                case 41:
                    _v.sent();
                    _v.label = 42;
                case 42:
                    _t++;
                    return [3 /*break*/, 40];
                case 43: return [4 /*yield*/, conn.end()];
                case 44:
                    _v.sent();
                    console.log("Sample data migration to MySQL completed!");
                    return [2 /*return*/];
            }
        });
    });
}
migrate().catch(function (err) {
    console.error("Migration failed:", err);
    process.exit(1);
});
