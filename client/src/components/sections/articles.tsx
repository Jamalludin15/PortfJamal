import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Tag } from "lucide-react";
import ArticleDetailModal from "@/components/article-detail-modal";
import type { Article } from "@shared/schema";
import { GalaxyBackground } from "./hero";

export default function Articles() {
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/articles/all");
      const json = await response.json();
      console.log("Landing page articles response:", json);
      return Array.isArray(json) ? json : json.data;
    },
    select: (data: Article[]) =>
      data.map((article) => {
        let tags: string[] = [];
        if (typeof article.tags === "string") {
          try {
            const parsed = JSON.parse(article.tags);
            if (Array.isArray(parsed)) tags = parsed;
            else tags = [article.tags];
          } catch {
            tags = [article.tags];
          }
        } else if (Array.isArray(article.tags)) {
          tags = article.tags;
        }
        return { ...article, tags };
      }),
  });

  const handleReadMore = (articleId: number) => {
    setSelectedArticleId(articleId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticleId(null);
  };

  if (isLoading) {
    return (
      <section id="articles" className="py-20 relative z-10 overflow-hidden">
        <GalaxyBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Articles & Insights
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
            >
              Sharing knowledge and insights about web development, technology trends, and best practices.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent">
                <div className="h-48 rounded-lg mb-4 bg-slate-200 dark:bg-slate-700"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !articles || articles.length === 0) {
    return (
      <section id="articles" className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Articles & Insights
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-slate-600 dark:text-slate-400"
            >
              No articles available at the moment. Check back soon for new insights!
            </motion.p>
          </div>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section id="articles" className="py-20 relative z-10 overflow-hidden">
      <GalaxyBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-slate-900 dark:text-white mb-4"
          >
            Articles & Insights
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto"
          >
            Sharing knowledge and insights about web development, technology trends, and best practices.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow duration-300 bg-transparent">
                {article.image && (
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(article.createdAt)}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 line-clamp-3">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    onClick={() => handleReadMore(article.id)}
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            View All Articles
          </Button>
        </motion.div>
      </div>

      {selectedArticleId && (
        <ArticleDetailModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          articleId={selectedArticleId}
        />
      )}
    </section>
  );
} 