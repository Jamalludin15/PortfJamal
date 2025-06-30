import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { authManager } from "@/lib/auth";
import { Plus, Edit, Trash2, GraduationCap, Award, Calendar } from "lucide-react";
import { insertEducationSchema, type Education, type InsertEducation } from "@shared/schema";

export default function EducationManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: education = [], isLoading } = useQuery<Education[]>({
    queryKey: ["/api/education"],
  });

  const form = useForm({
    resolver: zodResolver(insertEducationSchema),
    defaultValues: {
      degree: "",
      institution: "",
      period: "",
      description: "",
      type: "degree",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertEducation) => {
      return await apiRequest("POST", "/api/education", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Education created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/education"] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create education",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertEducation> }) => {
      return await apiRequest("PUT", `/api/education/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Education updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/education"] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update education",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/education/${id}`, undefined);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Education deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/education"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete education",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    form.reset({
      degree: "",
      institution: "",
      period: "",
      description: "",
      type: "degree",
    });
    setEditingEducation(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    form.reset({
      degree: education.degree,
      institution: education.institution,
      period: education.period,
      description: education.description || "",
      type: education.type,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this education?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: InsertEducation) => {
    if (editingEducation) {
      updateMutation.mutate({ id: editingEducation.id, data });
    } else {
      createMutation.mutate(data);
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Education</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage your educational background and certifications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEducation ? "Edit Education" : "Add New Education"}
              </DialogTitle>
              <DialogDescription>
                {editingEducation 
                  ? "Update the education information below."
                  : "Fill in the details to add a new education to your portfolio."
                }
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree/Certification</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bachelor of Computer Science" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., University of Technology" {...field} />
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
                        <Input placeholder="e.g., 2018 - 2022" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select education type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="degree">Degree</SelectItem>
                          <SelectItem value="certification">Certification</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Brief description of your studies, achievements, or relevant coursework..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingEducation ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {education.map((edu) => (
          <Card key={edu.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    {edu.type === "degree" ? (
                      <GraduationCap className="text-primary h-6 w-6" />
                    ) : (
                      <Award className="text-primary h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{edu.degree}</CardTitle>
                    <CardDescription className="text-base font-medium text-primary">
                      {edu.institution}
                    </CardDescription>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {edu.period}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {edu.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(edu)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(edu.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {edu.description && (
              <CardContent>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {edu.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {education.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No education entries yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Add your educational background to showcase your academic achievements.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Education
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
} 