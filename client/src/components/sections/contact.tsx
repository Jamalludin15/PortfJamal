import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, Send, DollarSign, Star } from "lucide-react";
import { insertContactSchema, type Profile } from "@shared/schema";
import { GalaxyBackground } from "./hero";

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: profile } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  // Fetch pricing from API
  const { data: pricing = [] } = useQuery({
    queryKey: ["/api/pricing"],
  });

  const form = useForm({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    contactMutation.mutate(data);
  };

  if (!profile) {
    return (
      <section id="contact" className="py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-8 mx-auto animate-pulse"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                ))}
              </div>
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 relative z-10 overflow-hidden">
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
            {profile.contactMainHeading || "Get In Touch"}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {profile.contactMainDescription || "Let's discuss your next project or just say hello"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              {profile.contactSubHeading || "Contact Me Directly"}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              {profile.contactSubDescription || "I'm always interested in hearing about new opportunities, interesting projects, or just having a chat about technology. Feel free to reach out through the form or any of the contact methods below."}
            </p>

            <div className="space-y-4">
              {profile.email && (
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-medium">Email</div>
                    <a
                      href={`https://mail.google.com/mail/?view=cm&to=${profile.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-400"
                    >
                      {profile.email}
                    </a>
                  </div>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-medium">Phone</div>
                    <div className="text-slate-600 dark:text-slate-400">{profile.phone}</div>
                  </div>
                </div>
              )}
              {profile.location && (
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-slate-900 dark:text-white font-medium">Location</div>
                    <div className="text-slate-600 dark:text-slate-400">{profile.location}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Card from API */}
            {pricing.length > 0 && (
              <div className="mt-8">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-slate-900 dark:text-white">{pricing[0].title}</CardTitle>
                      {pricing[0].isPremium && (
                        <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                          <Star className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                        <DollarSign className="text-primary h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white">
                          ${pricing[0].price.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {pricing[0].period}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                      {pricing[0].description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your full name"
                          {...field}
                          className="bg-white dark:bg-slate-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                          className="bg-white dark:bg-slate-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What's this about?"
                          {...field}
                          className="bg-white dark:bg-slate-700"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about your project or just say hello..."
                          className="min-h-[120px] bg-white dark:bg-slate-700"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
