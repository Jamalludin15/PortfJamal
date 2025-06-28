import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import type { Profile } from "@shared/schema";

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function About() {
  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  if (!profile) {
    return (
      <section id="about" className="py-20 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-8 mx-auto"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="py-20 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            About Me
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Get to know the person behind the code
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={item}>
            <img
              src={profile.profileImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=800"}
              alt="Profile"
              className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
            />
          </motion.div>

          <motion.div variants={item}>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {profile.aboutTitle}
            </h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
              {profile.aboutDescription1 && (
                <p>{profile.aboutDescription1}</p>
              )}
              {profile.aboutDescription2 && (
                <p>{profile.aboutDescription2}</p>
              )}
              {profile.aboutDescription3 && (
                <p>{profile.aboutDescription3}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="text-2xl font-bold text-primary">
                  {profile.experienceYears}+
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Years Experience
                </div>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                <div className="text-2xl font-bold text-primary">
                  {profile.projectsCompleted}+
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">
                  Projects Completed
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
