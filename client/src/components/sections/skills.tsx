import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Skill } from "@shared/schema";
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

export default function Skills() {
  const { data: skills = [] } = useQuery<Skill[]>({
    queryKey: ["/api/skills"],
  });

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Frontend Development":
        return "🎨";
      case "Backend Development":
        return "⚙️";
      case "Database & Tools":
        return "🛠️";
      default:
        return "💻";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Frontend Development":
        return "primary";
      case "Backend Development":
        return "emerald";
      case "Database & Tools":
        return "violet";
      default:
        return "primary";
    }
  };

  const getLevelText = (level: number) => {
    if (level >= 90) return "Expert";
    if (level >= 80) return "Advanced";
    if (level >= 70) return "Intermediate";
    return "Beginner";
  };

  const getBarColorClass = (category: string) => {
    switch (category) {
      case "Frontend Development":
        return "bg-blue-600";
      case "Backend Development":
        return "bg-emerald-600";
      case "Database & Tools":
        return "bg-violet-600";
      default:
        return "bg-primary-600";
    }
  };

  const getIconBgClass = (category: string) => {
    switch (category) {
      case "Frontend Development":
        return "bg-blue-100 dark:bg-blue-900";
      case "Backend Development":
        return "bg-emerald-100 dark:bg-emerald-900";
      case "Database & Tools":
        return "bg-violet-100 dark:bg-violet-900";
      default:
        return "bg-primary-100 dark:bg-primary-900";
    }
  };

  if (skills.length === 0) {
    return (
      <section id="skills" className="py-20 relative z-10 overflow-hidden">
        <GalaxyBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-8 mx-auto animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
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
    <section id="skills" className="py-20 relative z-10 overflow-hidden">
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
            Skills & Technologies
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            The tools and technologies I use to bring ideas to life
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {Object.entries(skillsByCategory).map(([category, categorySkills], index) => (
            <motion.div
              key={category}
              variants={item}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${getIconBgClass(category)} rounded-lg flex items-center justify-center mr-4 text-2xl`}>
                  {getCategoryIcon(category)}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {category}
                </h3>
              </div>
              <div className="space-y-3">
                {categorySkills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-300">
                        {skill.name}
                      </span>
                      <span className={`text-sm text-${getCategoryColor(category)}-600 dark:text-${getCategoryColor(category)}-400 font-medium`}>
                        {getLevelText(skill.level)}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        className={`${getBarColorClass(category)} h-2 rounded-full`}
                        style={{ width: 0 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
