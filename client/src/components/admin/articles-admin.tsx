import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, EyeOff, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Article, InsertArticle } from "@shared/schema";

export default function ArticlesAdmin() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [formData, setFormData] = useState<Partial<InsertArticle>>({
    title: "",
    content: "",
    excerpt: "",
    image: "",
    tags: [],
    published: false,
    createdAt: new Date().toISOString().split('T')[0],
  });
  const [tagInput, setTagInput] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [tempBlobUrl, setTempBlobUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ["articles", "all"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/articles/all");
      const json = await response.json();
      console.log("Response /api/articles/all:", json);
      return Array.isArray(json) ? json : json.data;
    },
    select: (data: Article[]) =>
      data.map((article) => {
        let tags: string[] = [];
        if (typeof article.tags === "string") {
          try {
            const parsed = JSON.parse(article.tags);
            if (Array.isArray(parsed)) {
              tags = parsed;
            } else {
              tags = [article.tags];
            }
          } catch {
            tags = [article.tags];
          }
        } else if (Array.isArray(article.tags)) {
          tags = article.tags;
        }
        return {
          ...article,
          tags,
        };
      }),
  });
  

  const createMutation = useMutation({
    mutationFn: async (data: InsertArticle) => {
      const response = await apiRequest("POST", "/api/articles", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Success",
        description: "Article created successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create article",
          variant: "destructive",
        });
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertArticle> }) => {
      const response = await apiRequest("PUT", `/api/articles/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to update article",
          variant: "destructive",
        });
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/articles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    },
    onError: (error: any) => {
      if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please login again.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = '/admin';
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to delete article",
          variant: "destructive",
        });
      }
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      image: "",
      tags: [],
      published: false,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setTagInput("");
    setPreviewUrl("");
    setTempBlobUrl("");
    setEditingArticle(null);
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    if (editingArticle) {
      updateMutation.mutate({ id: editingArticle.id, data: formData });
    } else {
      createMutation.mutate(formData as InsertArticle);
    }
  };

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      excerpt: article.excerpt || "",
      image: article.image || "",
      tags: article.tags || [],
      published: article.published,
      createdAt: article.createdAt ? new Date(article.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setPreviewUrl(article.image || "");
    setTempBlobUrl("");
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate(id);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handler untuk file input gambar article
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Tampilkan preview blob sementara
      const blobUrl = URL.createObjectURL(file);
      setTempBlobUrl(blobUrl);
      // Upload ke server
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: 'include',
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        // Simpan hanya path relatif (data.url)
        setPreviewUrl(data.url);
        setTempBlobUrl(""); // Hapus blob setelah upload sukses
        setFormData(prev => ({ ...prev, image: data.url }));
      } catch (err) {
        toast({ title: "Upload failed", description: (err as any).message, variant: "destructive" });
        setTempBlobUrl("");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Articles</h2>
          <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Articles</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingArticle ? "Edit Article" : "Add New Article"}
              </DialogTitle>
              <DialogDescription>
                {editingArticle ? "Update the article details below." : "Fill in the article details below."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Article title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    {tempBlobUrl ? (
                      <img
                        src={tempBlobUrl}
                        alt="Article Preview"
                        className="w-full h-32 object-cover rounded border"
                      />
                    ) : (previewUrl || formData.image) && (
                      <img
                        src={previewUrl || formData.image}
                        alt="Article Preview"
                        className="w-full h-32 object-cover rounded border"
                      />
                    )}
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="Brief description of the article"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Article content (supports markdown)"
                  rows={12}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="createdAt">Tanggal Dibuat</Label>
                <Input
                  id="createdAt"
                  type="date"
                  value={formData.createdAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, createdAt: e.target.value }))}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Published</Label>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingArticle ? "Update Article" : "Create Article"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {articles?.map((article) => (
          <Card key={article.id} className="bg-white dark:bg-slate-800">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    {article.published ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Eye className="h-3 w-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(article.createdAt)}
                    </span>
                    {article.tags && article.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        Tags: {article.tags.slice(0, 3).join(", ")}
                        {article.tags.length > 3 && ` +${article.tags.length - 3} more`}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(article)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {article.excerpt && (
              <CardContent className="pt-0">
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                  {article.excerpt}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {articles?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No articles found. Create your first article to get started.</p>
        </div>
      )}
    </div>
  );
} 