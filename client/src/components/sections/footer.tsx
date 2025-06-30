import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Github, Linkedin, Twitter, Mail, Instagram } from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { scrollToSection } from "@/lib/utils";
import type { Profile } from "@shared/schema";

export default function Footer() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: "about", label: "About" },
    { href: "skills", label: "Skills" },
    { href: "projects", label: "Projects" },
    { href: "contact", label: "Contact" }
  ];

  const handleLinkClick = (href: string) => {
    scrollToSection(href);
  };

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div>
            <h3 className="text-2xl font-bold text-primary-400 mb-4">
              {profile ? `${profile.firstName} ${profile.lastName}` : "Portfolio"}
            </h3>
            <p className="text-slate-300 leading-relaxed">
              {profile?.title || "Full Stack Developer"} passionate about creating exceptional digital experiences through clean code and innovative solutions.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => handleLinkClick(link.href)}
                    className="text-slate-300 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              {profile?.githubUrl && (
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-primary-400 text-xl transition-colors duration-200"
                >
                  <Github />
                </a>
              )}
              {profile?.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-primary-400 text-xl transition-colors duration-200"
                >
                  <Linkedin />
                </a>
              )}
              {profile?.twitterUrl && (
                <a
                  href={profile.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-primary-400 text-xl transition-colors duration-200"
                >
                  <Twitter />
                </a>
              )}
              {profile?.instagramUrl && (
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-primary-400 text-xl transition-colors duration-200"
                >
                  <Instagram />
                </a>
              )}
              {profile?.tiktokUrl && (
                <a
                  href={profile.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-primary-400 text-xl transition-colors duration-200"
                >
                  <SiTiktok />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`https://mail.google.com/mail/?view=cm&to=${profile.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-primary-400 text-xl transition-colors duration-200"
                >
                  <Mail />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            &copy; {currentYear} {profile ? `${profile.firstName} ${profile.lastName}` : "Portfolio"}. All rights reserved. Built with React, Node.js, and lots of
          </p>
        </div>
      </div>
    </footer>
  );
}
