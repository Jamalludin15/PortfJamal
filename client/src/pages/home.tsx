import { motion } from "framer-motion";
import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import About from "@/components/sections/about";
import Skills from "@/components/sections/skills";
import Experience from "@/components/sections/experience";
import Projects from "@/components/sections/projects";
import Articles from "@/components/sections/articles";
import Education from "@/components/sections/education";
import Activities from "@/components/sections/activities";
import Contact from "@/components/sections/contact";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-violet-900 text-foreground relative overflow-hidden"
    >
      <Navbar />
      {/* Animated background elements, hanya sekali di global */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-400/20 rounded-full"
        />
      </div>
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Articles />
        <Education />
        <Activities />
        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
}
