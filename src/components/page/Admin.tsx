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
import { BloodDonation, Event, User } from "@/types";
import {
  AlertTriangle,
  BarChart3,
  Calendar,
  CheckCircle,
  Heart,
  Search,
  Settings,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setisLoading] = useState(false);
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
  useEffect(() => {
    fetchUsers();
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
  const stats = {
    totalUsers: users.length,
    activeEvents: events.filter((e) => e.status === "upcoming").length,
    pendingDonations: bloodDonations.filter((d) => d.status === "pending")
      .length,
    systemHealth: "Good",
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage system and users</p>
        </div>
        <Button className="gap-2">
          <Settings className="w-4 h-4" />
          System Settings
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEvents}</div>
            <p className="text-xs text-muted-foreground">Upcoming events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Donations
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDonations}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.systemHealth}
            </div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="events">Event Oversight</TabsTrigger>
          <TabsTrigger value="blood">Blood System</TabsTrigger>
          <TabsTrigger value="reports">System Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>Add User</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
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
                  {/* Email */}
                  <div>
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
                  <div>
                    <Label htmlFor="password">Default Password</Label>
                    <Input
                      id="password"
                      placeholder="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                  {/* Student ID */}
                  <div>
                    <Label htmlFor="studentId">Student ID</Label>
                    <Input
                      id="studentId"
                      type="text"
                      placeholder="cs-2203073"
                      value={formData.studentId}
                      onChange={(e) =>
                        setFormData({ ...formData, studentId: e.target.value })
                      }
                    />
                  </div>
                  {/* Role */}
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="alumni">Alumni</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">Blood Type</Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) =>
                        setFormData({ ...formData, bloodGroup: value })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select blood type" />
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
                  <Button
                    className="w-full"
                    disabled={isLoading}
                    onClick={handleCreateUser}
                  >
                    {isLoading ? " Create User..." : " Create User"}
                  </Button>{" "}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>StudentID</TableHead>

                  <TableHead>Role</TableHead>
                  <TableHead>bloodGroup</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.studentId}</TableCell>

                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>{formatbloodGroup(user.bloodGroup)}</TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDeleteUser(user.id)}
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
              <CardDescription>Oversee and manage all events</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell>{event.date.toLocaleDateString()}</TableCell>
                      <TableCell>
                        {event.currentParticipants}/{event.maxParticipants}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            event.status === "upcoming"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {event.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blood" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Blood Donation Management</CardTitle>
              <CardDescription>
                Manage blood donation requests and approvals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Donor</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bloodDonations.map((donation) => {
                    const donor = users.find((u) => u.id === donation.donorId);
                    return (
                      <TableRow key={donation.id}>
                        <TableCell className="font-medium">
                          {donor?.name}
                        </TableCell>
                        <TableCell>{donation.bloodGroup}</TableCell>
                        <TableCell>
                          {donation.donationDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell>{donation.location}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              donation.status === "pending"
                                ? "secondary"
                                : "default"
                            }
                          >
                            {donation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Analytics</CardTitle>
                <CardDescription>
                  User registration and activity trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>New Registrations (Month)</span>
                    <span className="font-medium">+12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Event Participation</span>
                    <span className="font-medium">67%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
                <CardDescription>Application health metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Server Uptime</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">99.9%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Response Time</span>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{"< 200ms"}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Error Rate</span>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">0.1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
