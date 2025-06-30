import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Calendar, Clock, Tag, X } from "lucide-react";
import type { Article } from "@shared/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleDetailModalProps {
  articleId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleDetailModal({ articleId, isOpen, onClose }: ArticleDetailModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      if (!articleId) return null;
      const response = await apiRequest("GET", `/api/articles/${articleId}`);
      return response.json();
    },
    enabled: !!articleId && isOpen,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const truncateContent = (content: string, maxLength: number = 300) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  const handleClose = () => {
    setIsExpanded(false);
    onClose();
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading article...</DialogTitle>
            <DialogDescription>Memuat data artikel</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !article) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>Gagal memuat data artikel</DialogDescription>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-slate-600 dark:text-slate-400">
              Failed to load article. Please try again.
            </p>
            <Button onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white pr-8">
            {article.title}
          </DialogTitle>
          <DialogDescription>
            {article.excerpt || "Article details and content"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Article metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatReadingTime(article.content)}</span>
            </div>
          </div>

          {/* Article image */}
          {article.image && (
            <div className="relative h-64 overflow-hidden rounded-lg">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Article excerpt */}
          {article.excerpt && (
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
              <p className="text-slate-700 dark:text-slate-300 italic">
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Article content */}
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed">
              {isExpanded ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
              ) : (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{truncateContent(article.content)}</ReactMarkdown>
              )}
            </div>
          </div>

          {/* Read more/less button */}
          {article.content.length > 300 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                {isExpanded ? "Read Less" : "Read More"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 