import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Users, Presentation, Mic, ExternalLink } from "lucide-react";
import type { Activity } from "@shared/schema";
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

export default function Activities() {
  const { data: activities = [] } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const getIcon = (title: string) => {
    if (title.toLowerCase().includes("contributor")) return <Users className="h-6 w-6" />;
    if (title.toLowerCase().includes("mentor")) return <Presentation className="h-6 w-6" />;
    if (title.toLowerCase().includes("speaker")) return <Mic className="h-6 w-6" />;
    return <Users className="h-6 w-6" />;
  };

  const getIconColor = (index: number) => {
    const colors = ["primary", "emerald", "violet"];
    return colors[index % colors.length];
  };

  if (activities.length === 0) {
    return (
      <section id="activity" className="py-20 relative z-10 overflow-hidden">
        <GalaxyBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-8 mx-auto animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl p-6 animate-pulse border border-slate-200 dark:border-slate-700 bg-transparent"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="activity" className="py-20 relative z-10 overflow-hidden">
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
            Activities & Interests
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Beyond coding - my involvement in the tech community
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              variants={item}
              className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200 dark:border-slate-700 bg-transparent"
            >
              <div className={`w-16 h-16 bg-${getIconColor(index)}-100 dark:bg-${getIconColor(index)}-900 rounded-lg flex items-center justify-center mb-4 text-${getIconColor(index)}-600 dark:text-${getIconColor(index)}-400`}>
                {getIcon(activity.title)}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                {activity.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                {activity.description}
              </p>
              {activity.url && activity.url !== "#" && (
                <a
                  href={activity.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center text-sm text-${getIconColor(index)}-600 dark:text-${getIconColor(index)}-400 hover:underline`}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  <span>Learn More</span>
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
