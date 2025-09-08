"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Droplet,
  Heart,
  MapPin,
  Phone,
  Plus,
  User,
} from "lucide-react";
import { useState } from "react";

const BloodDonation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("donate");

  // Mock data
  const bloodRequests = [
    {
      id: "1",
      bloodType: "O-",
      urgency: "critical",
      hospital: "Dhaka Medical College Hospital",
      location: "Dhaka",
      unitsNeeded: 5,
      requestDate: "2024-01-15",
      contactPerson: "Dr. Sarah Ahmed",
      phone: "+8801712345678",
      message: "Urgent need for surgery patient. Critical condition.",
    },
    {
      id: "2",
      bloodType: "A+",
      urgency: "high",
      hospital: "Chittagong Medical College",
      location: "Chittagong",
      unitsNeeded: 3,
      requestDate: "2024-01-14",
      contactPerson: "Nurse Mohammad Rahim",
      phone: "+8801912345678",
      message: "Multiple patients requiring blood transfusion.",
    },
    {
      id: "3",
      bloodType: "B+",
      urgency: "medium",
      hospital: "Rajshahi Blood Bank",
      location: "Rajshahi",
      unitsNeeded: 8,
      requestDate: "2024-01-13",
      contactPerson: "Dr. Emily Akter",
      phone: "+8801555123456",
      message: "Restocking blood bank reserves.",
    },
  ];

  const myDonations = [
    {
      id: "1",
      date: "2024-01-10",
      location: "University Health Center",
      bloodType: user?.bloodType || "A+",
      status: "completed",
      recipient: "Emergency Patient",
    },
    {
      id: "2",
      date: "2023-12-15",
      location: "City Blood Bank",
      bloodType: user?.bloodType || "A+",
      status: "completed",
      recipient: "Blood Bank Reserve",
    },
    {
      id: "3",
      date: "2024-01-20",
      location: "Campus Medical Center",
      bloodType: user?.bloodType || "A+",
      status: "scheduled",
      recipient: "Scheduled Donation",
    },
  ];

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "destructive";
      case "high":
        return "default";
      case "medium":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "scheduled":
        return "default";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleDonationRegistration = () => {
    toast({
      title: "Registration Successful!",
      description:
        "Your blood donation has been scheduled. You'll receive a confirmation email shortly.",
    });
  };

  const handleEmergencyResponse = (requestId: string) => {
    toast({
      title: "Emergency Response Confirmed",
      description:
        "Thank you for responding to this urgent request. The hospital has been notified.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Blood Donation System</h1>
            <p className="text-white/80">
              Save lives through blood donation - every drop counts
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="donate">Donate Blood</TabsTrigger>
          <TabsTrigger value="requests">Emergency Requests</TabsTrigger>
          <TabsTrigger value="history">My Donations</TabsTrigger>
          {/* <TabsTrigger value="schedule">Schedule</TabsTrigger> */}
        </TabsList>

        {/* Donate Blood Tab */}
        <TabsContent value="donate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Register for Blood Donation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="blood-type">Blood Type</Label>
                    <Input
                      id="blood-type"
                      value={user?.bloodType || ""}
                      placeholder="A+, B+, O-, etc."
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="donation-date">Preferred Date</Label>
                    <Input id="donation-date" type="date" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Preferred Location</Label>
                  <select className="w-full p-2 border border-input rounded-md">
                    <option value="">Select location</option>
                    <option value="campus">University Health Center</option>
                    <option value="hospital">City General Hospital</option>
                    <option value="bank">Regional Blood Bank</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements or medical conditions..."
                    className="min-h-20"
                  />
                </div>

                <Button
                  onClick={handleDonationRegistration}
                  className="w-full"
                  variant="hero"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Register to Donate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-university-green rounded-full flex items-center justify-center mt-0.5">
                      <Droplet className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Age Requirement</p>
                      <p className="text-xs text-muted-foreground">
                        18-65 years old
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-university-green rounded-full flex items-center justify-center mt-0.5">
                      <Droplet className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Weight Requirement</p>
                      <p className="text-xs text-muted-foreground">
                        Minimum 50kg (110 lbs)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-university-green rounded-full flex items-center justify-center mt-0.5">
                      <Droplet className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Health Status</p>
                      <p className="text-xs text-muted-foreground">
                        Good general health
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-university-green rounded-full flex items-center justify-center mt-0.5">
                      <Droplet className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Donation Frequency</p>
                      <p className="text-xs text-muted-foreground">
                        Every 56 days (8 weeks)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Your Profile</p>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                      Blood Type:{" "}
                      <span className="font-medium text-foreground">
                        {user?.bloodType || "Not specified"}
                      </span>
                    </p>
                    <p>
                      Last Donation:{" "}
                      <span className="font-medium text-foreground">
                        January 10, 2024
                      </span>
                    </p>
                    <p>
                      Next Eligible:{" "}
                      <span className="font-medium text-foreground">
                        March 6, 2024
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Emergency Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Emergency Blood Requests</h2>
            <Badge variant="destructive" className="animate-pulse">
              {bloodRequests.filter((r) => r.urgency === "critical").length}{" "}
              Critical
            </Badge>
          </div>

          <div className="grid gap-4">
            {bloodRequests.map((request) => (
              <Card
                key={request.id}
                className="border-l-4 border-l-destructive"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <Droplet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">
                            {request.bloodType} Blood Needed
                          </h3>
                          <Badge variant={getUrgencyColor(request.urgency)}>
                            {request.urgency.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.hospital}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-destructive">
                        {request.unitsNeeded}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        units needed
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">{request.message}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{request.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{request.phone}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => handleEmergencyResponse(request.id)}
                      disabled={user?.bloodType !== request.bloodType}
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Respond to Emergency
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>

                  {user?.bloodType !== request.bloodType && (
                    <p className="text-xs text-muted-foreground">
                      Your blood type ({user?.bloodType}) doesn't match this
                      request ({request.bloodType})
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Donations Tab */}
        <TabsContent value="history" className="space-y-6">
          <h2 className="text-xl font-semibold">My Donation History</h2>

          <div className="grid gap-4">
            {myDonations.map((donation) => (
              <Card key={donation.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {donation.bloodType} Donation
                          </h3>
                          <Badge variant={getStatusColor(donation.status)}>
                            {donation.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {donation.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          For: {donation.recipient}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(donation.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <h2 className="text-xl font-semibold">Donation Schedule</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Donations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 border border-border rounded-lg">
                  <Clock className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium">Scheduled Donation</p>
                    <p className="text-sm text-muted-foreground">
                      January 20, 2024 at 2:00 PM
                    </p>
                    <p className="text-sm text-muted-foreground">
                      University Health Center
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Centers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">University Health Center</p>
                    <p className="text-sm text-muted-foreground">
                      Building A, Room 101
                    </p>
                  </div>
                  <Badge variant="success">Open</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">City General Hospital</p>
                    <p className="text-sm text-muted-foreground">
                      Main Campus, Blood Bank
                    </p>
                  </div>
                  <Badge variant="success">Open</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Regional Blood Bank</p>
                    <p className="text-sm text-muted-foreground">
                      Downtown Location
                    </p>
                  </div>
                  <Badge variant="secondary">Closed</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BloodDonation;
