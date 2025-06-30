import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Users, Presentation, Mic, ExternalLink } from "lucide-react";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { authManager } from "@/lib/auth";
import type { Activity, InsertActivity } from "@shared/schema";

const activitySchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(5, "Description is required"),
  icon: z.string().optional(),
  url: z.string().optional(),
});

type ActivityForm = z.infer<typeof activitySchema>;

export default function ActivityManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: activities = [], isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  const form = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      title: "",
      description: "",
      icon: "",
      url: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ActivityForm) => {
      return await apiRequest("POST", "/api/activities", data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Activity created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create activity", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ActivityForm> }) => {
      return await apiRequest("PUT", `/api/activities/${id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Activity updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      resetForm();
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update activity", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/activities/${id}`, undefined);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Activity deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete activity", variant: "destructive" });
    },
  });

  const resetForm = () => {
    form.reset({ title: "", description: "", icon: "", url: "" });
    setEditingActivity(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    form.reset({
      title: activity.title,
      description: activity.description,
      icon: activity.icon || "",
      url: activity.url || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this activity?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: ActivityForm) => {
    if (editingActivity) {
      updateMutation.mutate({ id: editingActivity.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Activities</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingActivity(null); form.reset({ title: "", description: "", icon: "", url: "" }); setIsDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" /> Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingActivity ? "Edit Activity" : "Add Activity"}</DialogTitle>
              <DialogDescription>
                {editingActivity ? "Update the activity information below." : "Fill in the details to add a new activity."}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Open Source Contributor" {...field} />
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
                        <Textarea placeholder="Describe the activity..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Icon Class (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., fas fa-users" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2 pt-2">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingActivity ? "Update" : "Create"} Activity
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4">
        {isLoading ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">Loading activities...</div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">No activities found.</div>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{activity.title}</CardTitle>
                  <CardDescription>{activity.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(activity)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(activity.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              {activity.url && (
                <CardContent>
                  <a href={activity.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center">
                    <ExternalLink className="mr-1 h-4 w-4" />
                    {activity.url}
                  </a>
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 