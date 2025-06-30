import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { scrollToSection } from "@/lib/utils";
import type { Profile } from "@shared/schema";
import { useRef, useEffect } from "react";

export function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let animationId: number;
    let mouse = { x: width / 2, y: height / 2 };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Star particle
    class Star {
      x: number;
      y: number;
      z: number;
      o: number;
      r: number;
      speed: number;
      vx: number;
      vy: number;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.z = Math.random() * width;
        this.o = 0.7 + Math.random() * 0.3;
        this.r = 0.5 + Math.random() * 1.2;
        this.speed = 0.2 + Math.random() * 0.8;
        this.vx = 0;
        this.vy = 0;
      }
      update() {
        this.z -= this.speed;
        if (this.z <= 0) {
          this.x = Math.random() * width;
          this.y = Math.random() * height;
          this.z = width;
        }
        // Repulsion from mouse
        const sx = (this.x - width / 2) * (width / this.z) + width / 2;
        const sy = (this.y - height / 2) * (width / this.z) + height / 2;
        const dx = sx - mouse.x;
        const dy = sy - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulseRadius = 100;
        if (dist < repulseRadius) {
          // Repulsion force
          const force = (repulseRadius - dist) / repulseRadius;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force * 2;
          this.vy += Math.sin(angle) * force * 2;
        }
        // Apply velocity and friction
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.92;
        this.vy *= 0.92;
        // Keep in bounds
        if (this.x < 0) this.x = 0;
        if (this.x > width) this.x = width;
        if (this.y < 0) this.y = 0;
        if (this.y > height) this.y = height;
      }
      draw() {
        const sx = (this.x - width / 2) * (width / this.z) + width / 2;
        const sy = (this.y - height / 2) * (width / this.z) + height / 2;
        const scale = Math.min(width, height) / this.z;
        const radius = Math.max(Math.min(this.r * scale, 2.5), 0.7);
        ctx.save();
        ctx.globalAlpha = this.o;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#fff";
        ctx.shadowBlur = 0;
        ctx.fill();
        ctx.restore();
      }
    }

    // Create stars
    const numStars = 180;
    const stars: Star[] = Array.from({ length: numStars }, () => new Star());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      // Galaxy swirl effect
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.rotate(((mouse.x - width / 2) / width) * 0.2);
      ctx.translate(-width / 2, -height / 2);
      for (const star of stars) {
        star.update();
        star.draw();
      }
      ctx.restore();
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
    />
  );
}

export default function Hero() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  if (!profile) {
    return (
      <section id="home" className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-16 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-4 mx-auto"></div>
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-4 mx-auto"></div>
          <div className="h-6 w-96 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated galaxy background */}
      <GalaxyBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
          >
            <span className="text-slate-900 dark:text-white">
              {profile.firstName}
            </span>{" "}
            <span className="text-primary">{profile.lastName}</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 mb-8 font-light"
          >
            {profile.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            {profile.heroDescription}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Button
              size="lg"
              onClick={() => scrollToSection("projects")}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-base"
            >
              View My Work
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-base"
            >
              Get In Touch
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex justify-center space-x-6"
          >
            {profile.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-primary text-2xl transition-colors duration-200"
              >
                <Github />
              </a>
            )}
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-primary text-2xl transition-colors duration-200"
              >
                <Linkedin />
              </a>
            )}
            {profile.twitterUrl && (
              <a
                href={profile.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 dark:text-slate-400 hover:text-primary text-2xl transition-colors duration-200"
              >
                <Twitter />
              </a>
            )}
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="text-slate-600 dark:text-slate-400 hover:text-primary text-2xl transition-colors duration-200"
              >
                <Mail />
              </a>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
