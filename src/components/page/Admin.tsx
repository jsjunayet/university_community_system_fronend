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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeletedUser, getAlluser, SignUpUser } from "@/services/authSeverice";
import { ApprovedEvent, getEventForAdmin } from "@/services/eventService";
import {
  ApprovedJobPost,
  getAllAdminJobPost,
} from "@/services/jobPoralService";
import { getAllPostForAdmin, postAprroved } from "@/services/postService";
import {
  ApprovedTourGroup,
  getAllAdminTourGroup,
} from "@/services/tourService";
import { BloodDonation, Event, User } from "@/types";
import {
  AlertTriangle,
  Bookmark,
  Calendar,
  CheckCircle,
  Search,
  Trash2,
  User2,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Skeleton components for loading states
const StatCardSkeleton = () => (
  <Card>
    <CardHeader className="pb-2">
      <Skeleton className="h-4 w-1/3" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-10 w-16 mb-2" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

const TableRowSkeleton = () => (
  <TableRow>
    {Array(5)
      .fill(0)
      .map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-6 w-full" />
        </TableCell>
      ))}
  </TableRow>
);

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setisLoading] = useState(true);
  const [isEventLoading, setIsEventLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [adminEvents, setAdminEvents] = useState<any[]>([]);
  const [jobs, setJobs] = useState([]);
  const [tours, setTours] = useState([]);

  // Mock data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    bloodGroup: "",
    studentId: "", // 👈 নতুন ফিল্ড
    password: "",
  });
  const [posts, setPosts] = useState([]);

  const formatbloodGroup = (type: string) => {
    const map: Record<string, string> = {
      A_POS: "A+",
      A_NEG: "A-",
      B_POS: "B+",
      B_NEG: "B-",
      AB_POS: "AB+",
      AB_NEG: "AB-",
      O_POS: "O+",
      O_NEG: "O-",
    };
    return map[type] || type;
  };

  // State to control dialog open/close
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateUser = async () => {
    try {
      console.log(formData);
      setisLoading(true);
      const res = await SignUpUser(formData);

      if (res.success) {
        toast.success(res.message || "User created successfully!");
        // form reset
        setFormData({
          name: "",
          email: "",
          studentId: "",
          role: "student",
          bloodGroup: "",
          password: "",
        });

        // Close the dialog
        setDialogOpen(false);

        // Refresh the user list
        fetchUsers();
      } else {
        toast.error(res.message || "Failed to create user");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setisLoading(false);
    }
  };

  const [users, setUsers] = useState<User[]>();
  const [events] = useState<Event[]>();
  const [bloodDonations] = useState<BloodDonation[]>();

  // Fetch users and events when component mounts
  useEffect(() => {
    fetchUsers();
    fetchEvents();
    fetchPost();
    fetchTours();
    fetchJob();
  }, []);

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await DeletedUser(id);
      if (res.success) {
        toast.success(res.message);
        setUsers(users.filter((u) => u.id !== id));
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  const fetchUsers = async () => {
    try {
      setisLoading(true);
      const res = await getAlluser();
      console.log(res);
      if (res.success) {
        setUsers(res.data);
      } else {
        toast.error(res.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users");
    } finally {
      setisLoading(false);
    }
  };
  const fetchTours = async () => {
    try {
      setisLoading(true);
      const res = await getAllAdminTourGroup();
      console.log(res);
      if (res.success) {
        setTours(res.data);
      } else {
        toast.error(res.message || "Failed to fetch tours");
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
      toast.error("An error occurred while fetching tours");
    } finally {
      setisLoading(false);
    }
  };
  const fetchJob = async () => {
    const res = await getAllAdminJobPost();
    console.log(res);
    if (res.success) {
      setJobs(res.data);
    }
  };
  const fetchPost = async () => {
    const res = await getAllPostForAdmin();
    if (res.success) {
      setPosts(res.data);
    }
  };
  // Fetch events for admin
  const fetchEvents = async () => {
    try {
      setIsEventLoading(true);
      const response = await getEventForAdmin();
      if (response.success) {
        setAdminEvents(response.data);
      } else {
        toast.error(response.message || "Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("An error occurred while fetching events");
    } finally {
      setIsEventLoading(false);
    }
  };

  // Handle event approval
  const handleApproveEvent = async (eventId: string, status: string) => {
    try {
      setIsActionLoading(true);
      const response = await ApprovedEvent(eventId, status);
      if (response.success) {
        fetchEvents(); // Refresh events list
      } else {
        toast.error(response.message || "Failed to approve event");
      }
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("An error occurred while approving the event");
    } finally {
      setIsActionLoading(false);
    }
  };
  const handleApprovePost = async (eventId: string, status: string) => {
    try {
      setIsActionLoading(true);
      const response = await postAprroved(eventId, status);
      if (response.success) {
        toast.success(`${response.message}`);
        fetchPost(); // Refresh events list
      } else {
        toast.error(response.message || "Failed to approve event");
      }
    } catch (error) {
      console.error("Error approving event:", error);
      toast.error("An error occurred while approving the event");
    } finally {
      setIsActionLoading(false);
    }
  };
  const stats = {
    totalUsers: users?.length,
    pendingEvents: adminEvents.filter((e) => e.status === "pending").length,
    pendingTour: tours.filter((e) => e.status === "pending").length,
    pendingJobPortal: jobs.filter((e) => e.status === "pending").length,
    pendingPost: posts.filter((e) => e.status === "pending").length,
  };
  const handleApproveTour = async (eventId: string, status: string) => {
    try {
      setIsActionLoading(true);
      const response = await ApprovedTourGroup(eventId, status);
      if (response.success) {
        fetchEvents(); // Refresh events list
      } else {
        toast.error(response.message || "Failed to approve Tour");
      }
    } catch (error) {
      console.error("Error approving Tour:", error);
      toast.error("An error occurred while approving the Tour");
    } finally {
      setIsActionLoading(false);
    }
  };
  const handleApproveJobPoral = async (eventId: string, status: string) => {
    try {
      setIsActionLoading(true);
      const response = await ApprovedJobPost(eventId, status);
      if (response.success) {
        fetchEvents(); // Refresh events list
      } else {
        toast.error(response.message || "Failed to approve Job");
      }
    } catch (error) {
      console.error("Error approving Job:", error);
      toast.error("An error occurred while approving the Job");
    } finally {
      setIsActionLoading(false);
    }
  };
  console.log(tours);
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Users className="w-4 h-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@university.edu"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger className=" w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="alumni">Alumni</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blood-group">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) =>
                      setFormData({ ...formData, bloodGroup: value })
                    }
                  >
                    <SelectTrigger className=" w-full">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A_POS">A+</SelectItem>
                      <SelectItem value="A_NEG">A-</SelectItem>
                      <SelectItem value="B_POS">B+</SelectItem>
                      <SelectItem value="B_NEG">B-</SelectItem>
                      <SelectItem value="AB_POS">AB+</SelectItem>
                      <SelectItem value="AB_NEG">AB-</SelectItem>
                      <SelectItem value="O_POS">O+</SelectItem>
                      <SelectItem value="O_NEG">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="student-id">Student ID</Label>
                <Input
                  id="student-id"
                  placeholder="12345678"
                  value={formData.studentId}
                  onChange={(e) =>
                    setFormData({ ...formData, studentId: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>

              <Button
                className="w-full"
                onClick={handleCreateUser}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create User"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.pendingEvents}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Tour</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.pendingTour}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Job Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Bookmark className="w-4 h-4 mr-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.pendingJobPortal}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Cummunity Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User2 className="w-4 h-4 mr-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.pendingPost}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="tours">Tours</TabsTrigger>
          <TabsTrigger value="jobs">Job Portal</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Management</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <CardDescription>
                Manage user accounts, roles, and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? // Show skeleton loading while fetching data
                      Array(5)
                        .fill(0)
                        .map((_, index) => <TableRowSkeleton key={index} />)
                    : users
                        .filter(
                          (user) =>
                            user.name
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            user.email
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        )
                        .map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.role === "admin"
                                    ? "destructive"
                                    : user.role === "faculty"
                                    ? "outline"
                                    : "default"
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.bloodGroup}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Event Management</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search events..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <CardDescription>
                Approve or reject event submissions from users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEventLoading ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array(4)
                      .fill(0)
                      .map((_, index) => (
                        <TableRowSkeleton key={index} />
                      ))}
                  </TableBody>
                </Table>
              ) : adminEvents.length === 0 ? (
                <div className="text-center py-4">No events found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Organizer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminEvents
                      .filter((event) =>
                        event.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase())
                      )
                      .map((event) => (
                        <TableRow key={event.id}>
                          <TableCell className="font-medium">
                            {event.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{event.category}</Badge>
                          </TableCell>
                          <TableCell>{event.date}</TableCell>
                          <TableCell>{event.organizer?.name}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                event.status === "approved"
                                  ? "success"
                                  : event.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {event.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      handleApproveEvent(event.id, "approved")
                                    }
                                    disabled={isActionLoading}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      handleApproveEvent(event.id, "rejected")
                                    }
                                    disabled={isActionLoading}
                                  >
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tours" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tour Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Guide</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading
                    ? // Show skeleton loading while fetching data
                      Array(4)
                        .fill(0)
                        .map((_, index) => <TableRowSkeleton key={index} />)
                    : tours.map((tour) => (
                        <TableRow key={tour.id}>
                          <TableCell>{tour.title}</TableCell>
                          <TableCell>{tour.author?.name}</TableCell>
                          <TableCell>{tour.difficulty}</TableCell>
                          <TableCell>৳{tour.price}</TableCell>
                          <TableCell>
                            {new Date(tour.deadline).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                tour.status === "approved"
                                  ? "success"
                                  : tour.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {tour.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {tour.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      handleApproveTour(tour.id, "approved")
                                    }
                                    disabled={isActionLoading}
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                      handleApproveTour(tour.id, "rejected")
                                    }
                                    disabled={isActionLoading}
                                  >
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="community" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>{post.description}</TableCell>
                      <TableCell>{post.location}</TableCell>
                      <TableCell>{post.user?.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            post?.status === "approved"
                              ? "success"
                              : post?.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {post?.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {post?.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleApprovePost(post.id, "approved")
                                }
                                disabled={isActionLoading}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleApprovePost(post.id, "rejected")
                                }
                                disabled={isActionLoading}
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Portal</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Position</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Deadline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobs.map((job) => (
                    <TableRow key={job.id}>
                      <TableCell>{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.author?.name}</TableCell>
                      <TableCell>
                        {new Date(job.deadline).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            job.status === "approved"
                              ? "success"
                              : job.status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {job.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {job.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleApproveJobPoral(job.id, "approved")
                                }
                                disabled={isActionLoading}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                  handleApproveJobPoral(job.id, "rejected")
                                }
                                disabled={isActionLoading}
                              >
                                <XCircle className="h-4 w-4 text-red-500" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
