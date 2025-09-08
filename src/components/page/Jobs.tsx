"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { JobApplication } from "@/types";
import { Building, Calendar, MapPin, Plus, Search, Users } from "lucide-react";
import { useState } from "react";

const Jobs = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);

  // Mock job applications
  const mockJobs: JobApplication[] = [
    {
      id: "1",
      title: "Software Engineer",
      company: "Tech Solutions Inc.",
      description: "Join our dynamic team as a Software Engineer...",
      requirements: ["React", "TypeScript", "Node.js", "3+ years experience"],
      postedBy: "HR Manager",
      postedDate: new Date("2024-01-15"),
      applicationDeadline: new Date("2024-02-15"),
      status: "open",
      applications: [
        {
          id: "app1",
          applicantId: "1",
          appliedDate: new Date(),
          status: "pending",
          resume: "resume.pdf",
          coverLetter: "Cover letter content...",
        },
      ],
    },
    {
      id: "2",
      title: "Marketing Specialist",
      company: "Creative Agency",
      description: "Looking for a creative marketing professional...",
      requirements: [
        "Digital Marketing",
        "SEO",
        "Content Creation",
        "2+ years experience",
      ],
      postedBy: "Marketing Director",
      postedDate: new Date("2024-01-10"),
      applicationDeadline: new Date("2024-02-10"),
      status: "open",
      applications: [],
    },
  ];

  const [jobs] = useState<JobApplication[]>(mockJobs);
  const [applications, setApplications] = useState<any[]>([]);

  const handleApply = (jobId: string) => {
    const newApplication = {
      id: Date.now().toString(),
      jobId,
      applicantId: user?.id,
      appliedDate: new Date(),
      status: "pending",
    };
    setApplications([...applications, newApplication]);
  };

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const userApplications = applications.filter(
    (app) => app.applicantId === user?.id
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Portal</h1>
          <p className="text-muted-foreground">Discover career opportunities</p>
        </div>
        {(user?.role === "alumni" || user?.role === "admin") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Post Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Post New Job</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" placeholder="Software Engineer" />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" placeholder="Company Name" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Job description..." />
                </div>
                <div>
                  <Label htmlFor="requirements">
                    Requirements (comma separated)
                  </Label>
                  <Input
                    id="requirements"
                    placeholder="React, TypeScript, Node.js"
                  />
                </div>
                <Button className="w-full">Post Job</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          <TabsTrigger value="tracking">Application Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-primary" />
                        {job.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Posted {job.postedDate.toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {job.applications.length} applicants
                        </span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={job.status === "open" ? "default" : "secondary"}
                    >
                      {job.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.requirements.map((req, index) => (
                      <Badge key={index} variant="outline">
                        {req}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Deadline: {job.applicationDeadline.toLocaleDateString()}
                    </span>
                    <Button onClick={() => handleApply(job.id)}>
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="grid gap-4">
            {userApplications.length > 0 ? (
              userApplications.map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                return (
                  <Card key={app.id}>
                    <CardHeader>
                      <CardTitle>{job?.title}</CardTitle>
                      <CardDescription>{job?.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm">
                            Applied: {app.appliedDate.toLocaleDateString()}
                          </p>
                          <Badge
                            variant={
                              app.status === "pending" ? "secondary" : "default"
                            }
                          >
                            {app.status}
                          </Badge>
                        </div>
                        <Button variant="outline">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No applications yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Status Tracking</CardTitle>
              <CardDescription>Track your application progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userApplications.map((app) => {
                  const job = jobs.find((j) => j.id === app.jobId);
                  return (
                    <div key={app.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{job?.title}</h4>
                        <Badge>{app.status}</Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{job?.company}</span>
                        <span>
                          Applied: {app.appliedDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-3 flex space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            app.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        ></div>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            ["reviewing", "shortlisted", "hired"].includes(
                              app.status
                            )
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            ["shortlisted", "hired"].includes(app.status)
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            app.status === "hired"
                              ? "bg-green-500"
                              : "bg-gray-300"
                          }`}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Jobs;
