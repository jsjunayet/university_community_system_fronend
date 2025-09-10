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
import { BloodDonation, Event, User } from "@/types";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Heart,
  Search,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [adminEvents, setAdminEvents] = useState<any[]>([]);

  // Mock data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
    bloodGroup: "",
    studentId: "", // 👈 নতুন ফিল্ড
    password: "",
  });

  const mockUsers: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@university.edu",
      role: "student",
      department: "Computer Science",
      graduationYear: 2025,
      bloodGroup: "A+",
      phone: "+1234567890",
      verified: true,
    },
    {
      id: "2",
      name: "Sarah Wilson",
      email: "sarah@university.edu",
      role: "alumni",
      department: "Business Administration",
      graduationYear: 2020,
      bloodGroup: "O-",
      phone: "+1234567891",
      verified: true,
    },
  ];

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

  const mockEvents: Event[] = [
    {
      id: "1",
      title: "Alumni Networking Event",
      description: "Connect with alumni professionals",
      date: new Date("2024-02-15"),
      location: "Main Auditorium",
      maxParticipants: 100,
      currentParticipants: 45,
      organizer: "Admin",
      category: "professional",
      status: "upcoming",
      participants: ["1", "2"],
      rsvps: [],
    },
  ];

  const mockBloodDonations: BloodDonation[] = [
    {
      id: "1",
      donorId: "1",
      bloodGroup: "A+",
      donationDate: new Date(),
      location: "Medical Center",
      status: "pending",
      emergencyRequest: false,
    },
  ];

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

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [events] = useState<Event[]>(mockEvents);
  const [bloodDonations] = useState<BloodDonation[]>(mockBloodDonations);

  // Fetch users and events when component mounts
  useEffect(() => {
    fetchUsers();
    fetchEvents();
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
    const res = await getAlluser();
    console.log(res);
    if (res.success) {
      setUsers(res.data);
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
        toast.success("Event approved successfully");
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

  const stats = {
    totalUsers: users.length,
    totalEvents: events.length,
    pendingEvents: adminEvents.filter((e) => e.status === "pending").length,
    totalBloodDonations: bloodDonations.length,
  };

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
              <div className="text-2xl font-bold">{stats.totalEvents}</div>
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
            <CardTitle className="text-sm font-medium">
              Blood Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-2 text-muted-foreground" />
              <div className="text-2xl font-bold">
                {stats.totalBloodDonations}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="tours">Tours</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="jobs">Job Portal</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
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
                  {users
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
                <div className="text-center py-4">Loading events...</div>
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
        {/* <TabsContent value="tours" className="space-y-4">
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
                  {tours.map((tour) => (
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
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="donations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blood Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloodRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{req.bloodType}</TableCell>
                      <TableCell>{req.unitsNeeded}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            req.urgencyLevel === "HIGH"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {req.urgencyLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>{req.location}</TableCell>
                      <TableCell>{req.contactPhone}</TableCell>
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
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default Admin;
