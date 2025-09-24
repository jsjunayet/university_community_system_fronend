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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
  CreateJobPost,
  getAllUserJobPost,
  getOwnJobPost,
} from "@/services/jobPoralService";
import {
  ApprovedOrRejectedStatusJobPostJoin,
  CreateTourJobPostJoin,
  getMyJobPostJoin,
} from "@/services/jopPortalJoinService";
import { JobApplication } from "@/types";
import { format } from "date-fns";
import {
  Building,
  Calendar,
  Check,
  MapPin,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { JobApplicationModal } from "../JobApplication/JobApplicationModal";

// Job Card Skeleton component for loading state
const JobCardSkeleton = () => (
  <Card className="hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <Skeleton className="h-6 w-48 mb-2" />
          <div className="flex items-center gap-4 mt-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <Skeleton className="h-5 w-16" />
      </div>
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-2" />
      <Skeleton className="h-4 w-4/6 mb-4" />
      <div className="flex flex-wrap gap-2 mb-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-24" />
      </div>
    </CardContent>
  </Card>
);

const Jobs = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] =
    useState<JobApplication | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const [jobs, setJobs] = useState<JobApplication[]>(mockJobs);
  const [applications, setApplications] = useState<any[]>([]);
  const [isActivetab, setIsActiveTab] = useState("browse");
  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    deadline: "",
  });
  const [Blood, setBlood] = useState<any>([]);
  console.log(Blood, "blood");
  const [Avaiableblood, setAvaiableblood] = useState<any>([]);
  const [myBlood, setMyblood] = useState<any>([]);
  const fetchMyblood = async () => {
    try {
      setIsLoading(true);
      const res = await getOwnJobPost();
      if (res.success) {
        setBlood(res.data);
      } else {
        toast.error("Failed to fetch your job posts");
      }
    } catch (error) {
      console.error("Error fetching own job posts:", error);
      toast.error("An error occurred while fetching your job posts");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllBlood = async () => {
    try {
      setIsLoading(true);
      const res = await getAllUserJobPost();
      if (res.success) {
        setAvaiableblood(res.data);
      } else {
        toast.error("Failed to fetch job posts");
      }
    } catch (error) {
      console.error("Error fetching all job posts:", error);
      toast.error("An error occurred while fetching job posts");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOwn = async () => {
    try {
      setIsLoading(true);
      const res = await getMyJobPostJoin();
      if (res.success) {
        setMyblood(res.data);
      } else {
        toast.error("Failed to fetch your job applications");
      }
    } catch (error) {
      console.error("Error fetching job applications:", error);
      toast.error("An error occurred while fetching your job applications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchMyblood(), fetchAllBlood(), fetchOwn()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setJobData({ ...jobData, [id]: value });
  };

  const handleSubmit = async () => {
    // Format deadline to ISO string
    const { title, company, description, requirements, deadline } = jobData;

    if (!title || !company || !description || !requirements || !deadline) {
      toast.error("Please fill in all fields before submitting.");
      return; // ⛔ stop submission
    }
    const formattedDeadline = jobData.deadline
      ? new Date(jobData.deadline).toISOString()
      : null;

    const payload = {
      ...jobData,
      deadline: formattedDeadline,
    };

    const res = await CreateJobPost(payload);
    if (res.success) {
      toast.success(`${res.message}`);
      setIsActiveTab("manage");
      fetchMyblood();
      fetchAllBlood();
      console.log(res);
    } else {
      toast.error(`${res.message}`);
    }

    // TODO: Send to backend with fetch/axios
    // await fetch("/api/jobs", { method: "POST", body: JSON.stringify(payload) });
  };
  const handleApply = (job: JobApplication) => {
    setSelectedJobForApplication(job);
    setIsApplicationModalOpen(true);
  };

  const handleApplicationSubmit = async (applicationData: any) => {
    const res = await CreateTourJobPostJoin(applicationData);
    console.log(res, "data");
    if (res.success) {
      toast.success(`${res.message}`);
    } else {
      toast.error(`${res.message}`);
    }
  };

  const handleApproveApplication = async (jobId: string, status: string) => {
    console.log(jobId, status);
    const res = await ApprovedOrRejectedStatusJobPostJoin(jobId, status);
    console.log(res, "data");
    if (res.success) {
      toast.success(`${res.message}`);
      fetchOwn();
      fetchMyblood();
    } else {
      toast.error(`${"something went wrong"}`);
    }
  };
  const filteredJobs = Avaiableblood?.filter(
    (job: any) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Job Portal</h1>
          <p className="text-muted-foreground">Discover career opportunities</p>
        </div>
        {(user?.role === "alumni" ||
          user?.role === "admin" ||
          user?.role == "superAdmin") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                  <Input
                    id="title"
                    placeholder="Software Engineer"
                    value={jobData.title}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    placeholder="Company Name"
                    value={jobData.company}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Job description..."
                    value={jobData.description}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="requirements">
                    Requirements (comma separated)
                  </Label>
                  <Input
                    id="requirements"
                    placeholder="React, TypeScript, Node.js"
                    value={jobData.requirements}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={jobData.deadline}
                    onChange={handleChange}
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={async () => {
                    await handleSubmit();
                    setIsDialogOpen(false); // ✅ success হলে modal বন্ধ হবে
                  }}
                >
                  Post Job
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs
        className="w-full"
        value={isActivetab}
        onValueChange={setIsActiveTab}
      >
        <TabsList
          className={`${
            user?.role !== "student"
              ? "grid w-full grid-cols-3"
              : "grid w-full grid-cols-2"
          }`}
        >
          <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
          <TabsTrigger value="applications">My Applications</TabsTrigger>
          {user?.role !== "student" && (
            <TabsTrigger value="manage">Manage Jobs</TabsTrigger>
          )}
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
            {isLoading ? (
              // Show skeleton loading while data is being fetched
              Array(3)
                .fill(0)
                .map((_, index) => <JobCardSkeleton key={index} />)
            ) : filteredJobs && filteredJobs.length > 0 ? (
              filteredJobs.map((job: any) => (
                <Card
                  key={job.id}
                  className="hover:shadow-md transition-shadow"
                >
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
                            Posted {job.postedDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {job.applications?.length} applicants
                          </span>
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          job.status === "open" ? "default" : "secondary"
                        }
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
                      {job.requirements
                        ?.split(",") // কমা দিয়ে ভাগ করবো
                        .map((req: any, index: any) => (
                          <Badge key={index} variant="outline">
                            {req.trim()}{" "}
                            {/* trim() দিয়ে অতিরিক্ত স্পেস মুছে ফেলবো */}
                          </Badge>
                        ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Deadline:{" "}
                        {job.deadline
                          ? new Date(job.deadline).toLocaleDateString()
                          : "N/A"}
                      </span>

                      <Button onClick={() => handleApply(job)}>
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No jobs found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="grid gap-4">
            {isLoading ? (
              // Show skeleton loading while data is being fetched
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-4 w-40 mb-2" />
                          <Skeleton className="h-5 w-20" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-9 w-24" />
                          <Skeleton className="h-9 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : myBlood.length > 0 ? (
              myBlood.map((job: any) => {
                return (
                  <Card key={job.id}>
                    <CardHeader>
                      <CardTitle>{job.jobPost.title}</CardTitle>
                      <CardDescription>{job.jobPost?.company}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-green-600">
                            Applied:{" "}
                            {format(new Date(job.createdAt), "dd MMM yyyy")}
                          </p>
                          <p className="text-sm">
                            Job Deadline:{" "}
                            {format(
                              new Date(job.jobPost.deadline),
                              "dd MMM yyyy"
                            )}
                          </p>

                          <Badge
                            variant={
                              job.status === "pending" ? "secondary" : "default"
                            }
                          >
                            {job.status}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          {job.resume && (
                            <a
                              href={job.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="secondary">View Resume</Button>
                            </a>
                          )}
                        </div>
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
        <TabsContent value="manage" className="space-y-4">
          {user?.role === "alumni" ||
          user?.role === "admin" ||
          user?.role === "superAdmin" ? (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Manage Posted Jobs</h2>

              {isLoading ? (
                // Show skeleton loading while data is being fetched
                <div className="grid gap-4">
                  {Array(3)
                    .fill(0)
                    .map((_, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <Skeleton className="h-6 w-48 mb-2" />
                              <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-5 w-16" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <Skeleton className="h-4 w-40" />
                            </div>
                            <div className="space-y-3">
                              <Skeleton className="h-5 w-24" />
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex-1">
                                  <Skeleton className="h-4 w-32 mb-1" />
                                  <Skeleton className="h-3 w-24 mb-1" />
                                  <Skeleton className="h-5 w-20" />
                                </div>
                                <div className="flex gap-2">
                                  <Skeleton className="h-8 w-8" />
                                  <Skeleton className="h-8 w-8" />
                                  <Skeleton className="h-8 w-8" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              ) : Blood.length > 0 ? (
                <div className="grid gap-4">
                  {Blood.map((job: any) => (
                    <Card key={job.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{job.title}</CardTitle>
                            <CardDescription>{job.company}</CardDescription>
                          </div>
                          <Badge
                            variant={
                              job.status === "open" ? "default" : "secondary"
                            }
                          >
                            {job.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              {job?.applications?.length || 0} applications
                              received
                            </span>
                          </div>

                          {job.applications?.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium">Applications:</h4>
                              {job.applications.map((app: any) => (
                                <div
                                  key={app.id}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                  <div className="flex-1">
                                    <p className="font-medium text-sm">
                                      {app.user?.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      Applied: {app.createdAt}
                                    </p>
                                    <Badge
                                      variant={
                                        app.status === "PENDING"
                                          ? "secondary"
                                          : app.status === "shortlisted"
                                          ? "default"
                                          : app.status === "REJECTED"
                                          ? "destructive"
                                          : "success"
                                      }
                                      className="text-xs mt-1"
                                    >
                                      {app.status}
                                    </Badge>
                                    {app.resume && (
                                      <p className="text-xs mt-1">
                                        Resume:{" "}
                                        <Link
                                          href={app.resume}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 underline hover:text-blue-800"
                                        >
                                          View Resume
                                        </Link>
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex gap-2">
                                    {app.status === "PENDING" && (
                                      <>
                                        <Button
                                          variant="success"
                                          size="sm"
                                          onClick={() =>
                                            handleApproveApplication(
                                              app.id,
                                              "ACCEPTED"
                                            )
                                          }
                                        >
                                          <Check className="w-4 h-4" />
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() =>
                                            handleApproveApplication(
                                              app.id,
                                              "REJECTED"
                                            )
                                          }
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">No jobs posted yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Only alumni and admin users can manage job postings
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <JobApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        jobTitle={selectedJobForApplication?.title || ""}
        jobId={selectedJobForApplication?.id || ""}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
};

export default Jobs;
