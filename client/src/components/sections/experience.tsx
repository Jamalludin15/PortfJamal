import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import type { Experience } from "@shared/schema";
import { GalaxyBackground } from "./hero";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export default function Experience() {
  const { data: experiences = [] } = useQuery<Experience[]>({
    queryKey: ["/api/experiences"],
    select: (data) =>
      data.map((exp) => ({
        ...exp,
        technologies:
          exp.technologies && typeof exp.technologies === "string"
            ? JSON.parse(exp.technologies)
            : exp.technologies || [],
      })),
  });

  if (experiences.length === 0) {
    return (
      <section id="experience" className="py-20 relative z-10 overflow-hidden">
        <GalaxyBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-8 mx-auto animate-pulse"></div>
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 relative z-10 overflow-hidden">
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
            Experience
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            My professional journey and key milestones
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-px bg-primary/20"></div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                variants={item}
                className={`relative flex items-center ${
                  index % 2 === 0 
                    ? "md:flex-row" 
                    : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 md:transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-white dark:border-slate-800 z-10"></div>

                <div className={`ml-12 md:ml-0 ${
                  index % 2 === 0 
                    ? "md:w-1/2 md:pr-8 md:text-right" 
                    : "md:w-1/2 md:pl-8"
                }`}>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6 shadow-lg">
                    <div className="text-primary font-semibold text-sm mb-2">
                      {experience.period}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      {experience.title}
                    </h3>
                    <h4 className="text-lg text-slate-600 dark:text-slate-300 mb-3">
                      {experience.company}
                    </h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                      {experience.description}
                    </p>
                    {experience.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Spacer for the other half */}
                <div className="hidden md:block md:w-1/2"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
