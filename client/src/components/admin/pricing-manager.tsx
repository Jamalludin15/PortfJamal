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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { authManager } from "@/lib/auth";
import { Plus, Edit, DollarSign, Star, Eye, EyeOff, Trash2 } from "lucide-react";
import { z } from "zod";
import { insertPricingSchema, type Pricing, type InsertPricing } from "@shared/schema";

export default function PricingManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPricing, setEditingPricing] = useState<Pricing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: pricingData = [], isLoading } = useQuery<Pricing[]>({
    queryKey: ["/api/pricing"],
    select: (data) =>
      data.map((p) => ({
        ...p,
        features:
          p.features && typeof p.features === "string"
            ? JSON.parse(p.features)
            : p.features || [],
      })),
  });

  const form = useForm({
    resolver: zodResolver(insertPricingSchema),
    defaultValues: {
      price: 1200,
      currency: "USD",
      period: "per project",
      title: "Project Pricing",
      description: "Professional web development services including design, development, testing, and deployment. Custom solutions tailored to your specific needs.",
      features: [
        "Custom Design & Development",
        "Responsive Web Applications",
        "Testing & Quality Assurance",
        "Deployment & Hosting Setup",
        "Post-Launch Support",
        "SEO Optimization"
      ],
      isActive: true,
      isPremium: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPricing) => {
      return await apiRequest("POST", "/api/pricing", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Pricing created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pricing"] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create pricing",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertPricing> }) => {
      return await apiRequest("PUT", `/api/pricing/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Pricing updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pricing"] });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update pricing",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("DELETE", `/api/pricing/${id}`, undefined);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Pricing deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pricing"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete pricing",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    form.reset({
      price: 1200,
      currency: "USD",
      period: "per project",
      title: "Project Pricing",
      description: "Professional web development services including design, development, testing, and deployment. Custom solutions tailored to your specific needs.",
      features: [
        "Custom Design & Development",
        "Responsive Web Applications",
        "Testing & Quality Assurance",
        "Deployment & Hosting Setup",
        "Post-Launch Support",
        "SEO Optimization"
      ],
      isActive: true,
      isPremium: true,
    });
    setEditingPricing(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (pricing: Pricing) => {
    setEditingPricing(pricing);
    form.reset({
      price: pricing.price,
      currency: pricing.currency,
      period: pricing.period,
      title: pricing.title,
      description: pricing.description,
      features: Array.isArray(pricing.features) ? pricing.features.join(", ") : [],
      isActive: pricing.isActive,
      isPremium: pricing.isPremium,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this pricing?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: InsertPricing) => {
    const formData = {
      ...data,
      price: Number(data.price),
      features: typeof data.features === 'string'
        ? data.features.split(',').map(f => f.trim()).filter(Boolean)
        : data.features || []
    };

    if (editingPricing) {
      updateMutation.mutate({ id: editingPricing.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pricing</h2>
          <p className="text-slate-600 dark:text-slate-400">Manage your project pricing and service offerings</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              if (pricingData.length > 0) {
                handleEdit(pricingData[0]);
              } else {
                resetForm();
                setIsDialogOpen(true);
              }
            }}>
              <Edit className="mr-2 h-4 w-4" />
              {pricingData.length > 0 ? "Edit Pricing" : "Add Pricing"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPricing ? "Edit Pricing Information" : "Add New Pricing"}
              </DialogTitle>
              <DialogDescription>
                Update your project pricing and service details that will be displayed on the contact page.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1200"
                            {...field}
                            value={field.value}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="USD"
                            {...field}
                          />
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
                          <Input
                            placeholder="per project"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Project Pricing"
                          {...field}
                        />
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
                          placeholder="Describe your services..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Active</FormLabel>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Show this pricing on the website
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

                  <FormField
                    control={form.control}
                    name="isPremium"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Premium Badge</FormLabel>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Display premium badge
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
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {createMutation.isPending || updateMutation.isPending ? "Saving..." : editingPricing ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {pricingData.map((pricing) => (
          <Card key={pricing.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{pricing.title}</CardTitle>
                      {pricing.isPremium && (
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                          <Star className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      {!pricing.isActive && (
                        <Badge variant="outline" className="text-slate-500">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Hidden
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(pricing.price, pricing.currency)}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {pricing.period}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pricing)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(pricing.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                {pricing.description}
              </p>
              {pricing.features && pricing.features.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {pricing.features.map((feature, index) => (
                      <li key={index} className="text-sm text-slate-600 dark:text-slate-400 flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {pricingData.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <DollarSign className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No pricing configured
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Set up your project pricing to display on the contact page.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Pricing
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
} 