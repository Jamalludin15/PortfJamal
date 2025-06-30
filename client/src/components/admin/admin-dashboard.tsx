import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { authManager } from "@/lib/auth";
import { Link } from "wouter";
import { 
  LogOut, 
  User, 
  Briefcase, 
  Code, 
  GraduationCap, 
  Award, 
  Mail, 
  Settings,
  Home,
  FolderOpen,
  FileText,
  DollarSign
} from "lucide-react";
import ProjectManager from "./project-manager";
import SkillManager from "./skill-manager";
import ExperienceManager from "./experience-manager";
import EducationManager from "./education-manager";
import PricingManager from "./pricing-manager";
import ArticlesAdmin from "./articles-admin";
import type { Contact, Profile } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import ActivityManager from "./activity-manager";

interface AdminDashboardProps {
  onLogout: () => void;
}

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().optional(),
  title: z.string().min(2, "Title is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  profileImage: z.string().min(1, "Image URL is required").refine(
    (val) => val.startsWith("/uploads/") || val.startsWith("http"),
    { message: "Invalid image URL" }
  ),
  aboutTitle: z.string().min(2, "About title is required").optional(),
  aboutDescription1: z.string().min(5, "About description is required").optional(),
  experienceYears: z.coerce.number().min(0, "Years experience must be 0 or more"),
  projectsCompleted: z.coerce.number().min(0, "Projects completed must be 0 or more"),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional(),
  tiktokUrl: z.string().url("Invalid TikTok URL").optional(),
  instagramUrl: z.string().url("Invalid Instagram URL").optional(),
  contactMainHeading: z.string().optional(),
  contactMainDescription: z.string().optional(),
  contactSubHeading: z.string().optional(),
  contactSubDescription: z.string().optional(),
});
type ProfileForm = z.infer<typeof profileSchema>;

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const user = authManager.getUser();

  // Check authentication on component mount
  useEffect(() => {
    if (!authManager.isAuthenticated()) {
      onLogout();
      return;
    }
  }, [onLogout]);

  // Don't render if not authenticated
  if (!authManager.isAuthenticated()) {
    return null;
  }

  const { data: profile, isLoading: isProfileLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const { data: contacts = [] } = useQuery<Contact[]>({
    queryKey: ["/api/contact"],
  });

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: authManager.getAuthHeaders(),
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      onLogout();
    }
  };

  const recentContacts = contacts.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Admin Dashboard
              </h1>
              {user && (
                <Badge variant="outline">
                  Welcome, {user.username}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  View Site
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-10">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Skills</span>
              </TabsTrigger>
              <TabsTrigger value="experience" className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                <span className="hidden sm:inline">Experience</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">Education</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Pricing</span>
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span className="hidden sm:inline">Activity</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Messages</span>
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Articles</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{contacts.length}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Experience Years</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{profile?.experienceYears || 0}+</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Projects Completed</CardTitle>
                    <FolderOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{profile?.projectsCompleted || 0}+</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Portfolio Status</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">Active</div>
                  </CardContent>
                </Card>
              </div>

              {recentContacts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Messages</CardTitle>
                    <CardDescription>Latest contact form submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentContacts.map((contact) => (
                        <div key={contact.id} className="flex items-start space-x-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {contact.name}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : ''}
                              </p>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">{contact.email}</p>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-1">
                              {contact.subject}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 truncate">
                              {contact.message}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>
                    Update your personal information and portfolio details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isProfileLoading ? (
                    <p>Loading profile...</p>
                  ) : (
                    <ProfileEditForm profile={profile} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <ProjectManager />
            </TabsContent>

            <TabsContent value="skills">
              <SkillManager />
            </TabsContent>

            <TabsContent value="experience">
              <ExperienceManager />
            </TabsContent>

            <TabsContent value="education">
              <EducationManager />
            </TabsContent>

            <TabsContent value="pricing">
              <PricingManager />
            </TabsContent>

            <TabsContent value="activity">
              <ActivityManager />
            </TabsContent>

            <TabsContent value="contacts" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Messages</CardTitle>
                  <CardDescription>
                    Messages received through the contact form
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {contacts.length === 0 ? (
                    <div className="text-center py-8">
                      <Mail className="mx-auto h-12 w-12 text-slate-400" />
                      <h3 className="mt-4 text-sm font-medium text-slate-900 dark:text-white">No messages</h3>
                      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Contact form submissions will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contacts.map((contact) => (
                        <div key={contact.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                                  {contact.name}
                                </h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {contact.email}
                                </span>
                              </div>
                              <h5 className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-1">
                                {contact.subject}
                              </h5>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                                {contact.message}
                              </p>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : ''}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="articles">
              <ArticlesAdmin />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

function ProfileEditForm({ profile }: { profile?: Profile }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(profile?.profileImage || "");
  const [tempBlobUrl, setTempBlobUrl] = useState<string>("");
  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      title: profile?.title || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      profileImage: profile?.profileImage || "",
      aboutTitle: profile?.aboutTitle || "",
      aboutDescription1: profile?.aboutDescription1 || "",
      experienceYears: profile?.experienceYears ?? 0,
      projectsCompleted: profile?.projectsCompleted ?? 0,
      linkedinUrl: profile?.linkedinUrl || "",
      tiktokUrl: profile?.tiktokUrl || "",
      instagramUrl: profile?.instagramUrl || "",
      contactMainHeading: profile?.contactMainHeading || "",
      contactMainDescription: profile?.contactMainDescription || "",
      contactSubHeading: profile?.contactSubHeading || "",
      contactSubDescription: profile?.contactSubDescription || "",
    },
  });

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
          headers: { ...authManager.getAuthHeaders() },
          body: formData,
        });

        // More detailed logging for debugging
        console.log("Response Status:", res.status);
        console.log("Response Status Text:", res.statusText);
        console.log("Response Content-Type Header:", res.headers.get('Content-Type'));
        
        const responseText = await res.text();
        console.log("Raw Server Response Text:", responseText); // Log raw server response

        if (!res.ok) {
          // Attempt to parse error as JSON, otherwise use raw text
          try {
            const errorData = JSON.parse(responseText);
            throw new Error(errorData.message || "Upload failed");
          } catch (e) {
            throw new Error(responseText || "Upload failed");
          }
        }
        
        // Trim whitespace and remove potential BOM
        const cleanedResponseText = responseText.trim().replace(/^\\uFEFF/, '');
        const data = JSON.parse(cleanedResponseText);
        setPreviewUrl(data.url);
        setTempBlobUrl("");
        form.setValue("profileImage", data.url, { shouldValidate: true });

      } catch (err) {
        toast({ title: "Upload failed", description: (err as any).message, variant: "destructive" });
        setTempBlobUrl("");
      }
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: ProfileForm) => {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...authManager.getAuthHeaders(),
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Profile updated!", description: "Your profile has been saved." });
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6 max-w-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Last name (optional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Your location" {...field} />
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
                <Input placeholder="Your title or job" {...field} />
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
                <Input placeholder="Your email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedinUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn URL</FormLabel>
              <FormControl>
                <Input placeholder="https://linkedin.com/in/username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tiktokUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TikTok URL</FormLabel>
              <FormControl>
                <Input placeholder="https://tiktok.com/@username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="instagramUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram URL</FormLabel>
              <FormControl>
                <Input placeholder="https://instagram.com/username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactMainHeading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Main Heading</FormLabel>
              <FormControl>
                <Input placeholder="Get In Touch" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactMainDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Main Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Let's discuss your next project or just say hello" rows={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactSubHeading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Sub Heading</FormLabel>
              <FormControl>
                <Input placeholder="Let's Start a Conversation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactSubDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Sub Description</FormLabel>
              <FormControl>
                <Textarea placeholder="I'm always interested in hearing about new opportunities..." rows={3} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profileImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
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
                      alt="Profile Preview"
                      className="w-32 h-32 object-cover rounded-full border"
                    />
                  ) : previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Profile Preview"
                      className="w-32 h-32 object-cover rounded-full border"
                    />
                  )}
                  <Input
                    placeholder="https://..."
                    value={field.value}
                    onChange={field.onChange}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aboutTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Title</FormLabel>
              <FormControl>
                <Input placeholder="About section title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aboutDescription1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Short about description" rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experienceYears"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years Experience</FormLabel>
              <FormControl>
                <Input type="number" min={0} placeholder="Years of experience" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectsCompleted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Projects Completed</FormLabel>
              <FormControl>
                <Input type="number" min={0} placeholder="Total projects completed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isPending} className="w-full">
          {mutation.isPending ? "Saving..." : "Save Profile"}
        </Button>
      </form>
    </Form>
  );
}
