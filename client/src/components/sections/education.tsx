import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Award } from "lucide-react";
import type { Education } from "@shared/schema";
import { GalaxyBackground } from "./hero";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Education() {
  const { data: education = [] } = useQuery<Education[]>({
    queryKey: ["/api/education"],
  });

  if (education.length === 0) {
    return (
      <section id="education" className="py-20 relative z-10 overflow-hidden">
        <GalaxyBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-8 mx-auto animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 animate-pulse">
                  <div className="h-20 bg-slate-200 dark:bg-slate-600 rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-600 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20 relative z-10 overflow-hidden">
      <GalaxyBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Education
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            My academic background and continuous learning journey
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {education.map((edu) => (
            <motion.div
              key={edu.id}
              variants={item}
              className="rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 bg-transparent"
            >
              <div className="flex items-start">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                  {edu.type === "degree" ? (
                    <GraduationCap className="text-primary h-8 w-8" />
                  ) : (
                    <Award className="text-primary h-8 w-8" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {edu.degree}
                  </h3>
                  <h4 className="text-lg text-primary font-semibold mb-2">
                    {edu.institution}
                  </h4>
                  <div className="text-slate-600 dark:text-slate-300 mb-3">
                    {edu.period}
                  </div>
                  {edu.description && (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
