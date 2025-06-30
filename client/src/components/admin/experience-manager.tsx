import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { authManager } from "@/lib/auth";
import { Plus, Edit, Trash2, Briefcase, Calendar } from "lucide-react";
import { insertExperienceSchema, type Experience, type InsertExperience } from "@shared/schema";

export default function ExperienceManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: experiences = [], isLoading } = useQuery<Experience[]>({
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

  const form = useForm({
    resolver: zodResolver(insertExperienceSchema),
    defaultValues: {
      title: "",
      company: "",
      period: "",
      description: "",
      technologies: [],
      current: false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertExperience) => {
      return await apiRequest("POST", "/api/experiences", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Experience created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create experience",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertExperience> }) => {
      return await apiRequest("PUT", `/api/experiences/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Experience updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update experience",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/experiences/${id}`, undefined);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/experiences"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete experience",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    form.reset({
      title: "",
      company: "",
      period: "",
      description: "",
      technologies: [],
      current: false,
    });
    setEditingExperience(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    form.reset({
      title: experience.title,
      company: experience.company,
      period: experience.period,
      description: experience.description,
      technologies: Array.isArray(experience.technologies) ? experience.technologies.join(", ") : [],
      current: experience.current || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: InsertExperience) => {
    // Parse technologies from comma-separated string to array
    const formData = {
      ...data,
      technologies: typeof data.technologies === 'string' 
        ? data.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : data.technologies || []
    };

    if (editingExperience) {
      updateMutation.mutate({ id: editingExperience.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Experience</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage your work experience and career history</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? "Edit Experience" : "Add New Experience"}
              </DialogTitle>
              <DialogDescription>
                {editingExperience 
                  ? "Update the experience information below."
                  : "Fill in the details to add a new work experience to your portfolio."
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Senior Full Stack Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Tech Innovations Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Period</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2022 - Present, Jan 2020 - Dec 2021" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your role, responsibilities, and achievements..."
                          className="min-h-[120px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies Used</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="React, Node.js, TypeScript, AWS (comma-separated)"
                          value={Array.isArray(field.value) ? field.value.join(', ') : field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="current"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Current Position</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Check if this is your current job
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingExperience ? "Update" : "Create"} Experience
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {experiences.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">No experience</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Get started by adding your first work experience.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-xl">{experience.title}</CardTitle>
                        {experience.current && (
                          <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            Current
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-lg font-medium text-primary">
                        {experience.company}
                      </CardDescription>
                      <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                        <Calendar className="mr-1 h-4 w-4" />
                        {experience.period}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(experience)}
                        aria-label={`Edit experience: ${experience.title} at ${experience.company}`}
                        title="Edit experience"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(experience.id)}
                        className="text-red-600 hover:text-red-700"
                        aria-label={`Delete experience: ${experience.title} at ${experience.company}`}
                        title="Delete experience"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                    {experience.description}
                  </p>
                  
                  {experience.technologies && experience.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech, techIndex) => (
                        <Badge key={techIndex} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
