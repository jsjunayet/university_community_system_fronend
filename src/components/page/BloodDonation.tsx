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
import { Calendar, Droplet, Heart, Plus } from "lucide-react";
import { useState } from "react";
import { BloodRequestCard } from "../BloodRequestCard/BloodRequestCard";

const BloodDonation = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("requests");

  // Mock data - matches backend schema
  const bloodRequests = [
    {
      id: "1",
      bloodType: "O-",
      location: "City General Hospital, Downtown Campus",
      date: "2024-02-15T14:00:00Z",
      notes: "Urgent need for surgery patient. Critical condition.",
      status: "approved" as const,
      requester: {
        id: "req1",
        name: "Dr. Sarah Johnson",
        email: "sarah.johnson@hospital.com",
        phone: "+1-555-0123",
      },
      donations: [
        {
          id: "don1",
          donorId: "donor1",
          donor: { name: "John Smith", email: "john@email.com" },
          status: "PENDING" as const,
          donatedAt: undefined,
        },
        {
          id: "don2",
          donorId: "donor2",
          donor: { name: "Jane Doe", email: "jane@email.com" },
          status: "ACCEPTED" as const,
          donatedAt: "2024-02-14T10:00:00Z",
        },
      ],
      urgency: "critical" as const,
      unitsNeeded: 5,
    },
    {
      id: "2",
      bloodType: "A+",
      location: "University Medical Center, Medical District",
      date: "2024-02-20T09:00:00Z",
      notes: "Multiple patients requiring blood transfusion.",
      status: "approved" as const,
      requester: {
        id: "req2",
        name: "Nurse Mike Wilson",
        email: "mike.wilson@umc.com",
        phone: "+1-555-0124",
      },
      donations: [],
      urgency: "high" as const,
      unitsNeeded: 3,
    },
    {
      id: "3",
      bloodType: "B+",
      location: "Regional Blood Bank, Central Campus",
      date: "2024-02-25T11:00:00Z",
      notes: "Restocking blood bank reserves.",
      status: "approved" as const,
      requester: {
        id: "req3",
        name: "Dr. Emily Chen",
        email: "emily.chen@bloodbank.org",
        phone: "+1-555-0125",
      },
      donations: [
        {
          id: "don3",
          donorId: "donor3",
          donor: { name: "Bob Wilson", email: "bob@email.com" },
          status: "PENDING" as const,
          donatedAt: undefined,
        },
      ],
      urgency: "medium" as const,
      unitsNeeded: 8,
    },
  ];

  const myBloodRequests = [
    {
      id: "4",
      bloodType: "A+",
      location: "University Health Center",
      date: "2024-01-20T16:00:00Z",
      notes: "Need blood for scheduled surgery.",
      status: "approved" as const,
      requester: {
        id: user?.id || "current-user",
        name: user?.name || "Current User",
        email: user?.email || "user@email.com",
        phone: user?.phone,
      },
      donations: [
        {
          id: "don4",
          donorId: "donor4",
          donor: { name: "Alice Brown", email: "alice@email.com" },
          status: "PENDING" as const,
          donatedAt: undefined,
        },
        {
          id: "don5",
          donorId: "donor5",
          donor: { name: "Charlie Davis", email: "charlie@email.com" },
          status: "ACCEPTED" as const,
          donatedAt: "2024-01-18T14:00:00Z",
        },
      ],
      urgency: "medium" as const,
      unitsNeeded: 2,
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

  const handleBloodRequestAction = (
    requestId: string,
    action: "join" | "approve" | "reject"
  ) => {
    if (action === "join") {
      toast({
        title: "Donation Request Sent",
        description: "Your donation request has been sent to the requester.",
      });
    } else if (action === "approve") {
      toast({
        title: "Donation Approved",
        description:
          "The donation has been approved. Contact details will be shared.",
      });
    } else if (action === "reject") {
      toast({
        title: "Donation Rejected",
        description: "The donation request has been rejected.",
      });
    }
  };

  const handleCreateBloodRequest = () => {
    toast({
      title: "Blood Request Created!",
      description: "Your blood request has been submitted for approval.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-responsive sm:p-6 rounded-lg">
        <div className="flex items-center gap-2 sm:gap-4 flex-responsive-col sm:flex-row text-center sm:text-left">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-responsive-xl sm:text-xl lg:text-2xl font-bold">
              Blood Donation System
            </h1>
            <p className="text-white/80 text-responsive sm:text-base">
              Save lives through blood donation - every drop counts
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1">
          {/* <TabsTrigger value="donate" className="text-responsive sm:text-sm">
            Donate
          </TabsTrigger> */}
          <TabsTrigger value="requests" className="text-responsive sm:text-sm">
            Requests
          </TabsTrigger>
          <TabsTrigger
            value="my-requests"
            className="text-responsive sm:text-sm"
          >
            My Requests
          </TabsTrigger>
          <TabsTrigger value="history" className="text-responsive sm:text-sm">
            History
          </TabsTrigger>
          <TabsTrigger value="create" className="text-responsive sm:text-sm">
            Create Request
          </TabsTrigger>
        </TabsList>

        {/* Donate Blood Tab */}
        {/* <TabsContent value="donate" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-responsive sm:p-6">
                <CardTitle className="flex items-center gap-2 text-responsive-lg sm:text-lg">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Register for Blood Donation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-responsive sm:p-6 pt-0 space-y-3 sm:space-y-4">
                <div className="grid grid-responsive-cols sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label
                      htmlFor="blood-type"
                      className="text-responsive sm:text-sm"
                    >
                      Blood Type
                    </Label>
                    <Input
                      id="blood-type"
                      value={user?.bloodType || ""}
                      placeholder="A+, B+, O-, etc."
                      readOnly
                      className="text-responsive sm:text-sm"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="donation-date"
                      className="text-responsive sm:text-sm"
                    >
                      Preferred Date
                    </Label>
                    <Input
                      id="donation-date"
                      type="date"
                      className="text-responsive sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="location"
                    className="text-responsive sm:text-sm"
                  >
                    Preferred Location
                  </Label>
                  <select className="w-full p-2 border border-input rounded-md text-responsive sm:text-sm">
                    <option value="">Select location</option>
                    <option value="campus">University Health Center</option>
                    <option value="hospital">City General Hospital</option>
                    <option value="bank">Regional Blood Bank</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="notes" className="text-responsive sm:text-sm">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Any special requirements or medical conditions..."
                    className="min-h-16 sm:min-h-20 text-responsive sm:text-sm"
                  />
                </div>

                <Button
                  onClick={handleDonationRegistration}
                  className="w-full text-responsive sm:text-sm"
                  variant="hero"
                  size="sm"
                >
                  <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Register to Donate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-responsive sm:p-6">
                <CardTitle className="text-responsive-lg sm:text-lg">
                  Donation Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-responsive sm:p-6 pt-0 space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 bg-university-green rounded-full flex items-center justify-center mt-0.5">
                      <Droplet className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-responsive sm:text-sm">
                        Age Requirement
                      </p>
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

                <div className="p-3 sm:p-4 bg-muted rounded-lg">
                  <p className="text-responsive sm:text-sm font-medium mb-2">
                    Your Profile
                  </p>
                  <div className="space-y-1 text-responsive sm:text-sm text-muted-foreground">
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
        </TabsContent> */}

        {/* Blood Requests Tab */}
        <TabsContent value="requests" className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <h2 className="text-responsive-xl sm:text-xl font-semibold">
              Emergency Blood Requests
            </h2>
            <Badge variant="destructive" className="animate-pulse text-xs">
              {bloodRequests.filter((r) => r.urgency === "critical").length}{" "}
              Critical
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <Input
              placeholder="Search by blood type..."
              className="w-full sm:w-48 lg:w-64 text-responsive sm:text-sm"
            />
            <select className="p-2 border border-input rounded-md text-responsive sm:text-sm">
              <option value="">All Urgency</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {bloodRequests.map((request) => (
              <BloodRequestCard
                key={request.id}
                request={request}
                userBloodType={user?.bloodType}
                onRespond={handleBloodRequestAction}
              />
            ))}
          </div>
        </TabsContent>

        {/* My Blood Requests Tab */}
        <TabsContent value="my-requests" className="space-y-4 sm:space-y-6">
          <h2 className="text-responsive-xl sm:text-xl font-semibold">
            My Blood Requests
          </h2>

          <div className="grid gap-4 sm:gap-6">
            {myBloodRequests.map((request) => (
              <BloodRequestCard
                key={request.id}
                request={request}
                userBloodType={user?.bloodType}
                isOwnRequest={true}
                onRespond={handleBloodRequestAction}
              />
            ))}

            {myBloodRequests.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Droplet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Blood Requests
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't created any blood requests yet.
                  </p>
                  <Button variant="hero" onClick={() => setActiveTab("create")}>
                    Create Your First Request
                  </Button>
                </CardContent>
              </Card>
            )}
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

        {/* Create Blood Request Tab */}
        <TabsContent value="create" className="space-y-4 sm:space-y-6">
          <h2 className="text-responsive-xl sm:text-xl font-semibold">
            Create Blood Request
          </h2>

          <Card>
            <CardHeader className="p-responsive sm:p-6">
              <CardTitle className="flex items-center gap-2 text-responsive-lg sm:text-lg">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                Request Blood Donation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-responsive sm:p-6 pt-0 space-y-3 sm:space-y-4">
              <div className="grid grid-responsive-cols sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label
                    htmlFor="request-blood-type"
                    className="text-responsive sm:text-sm"
                  >
                    Blood Type Needed
                  </Label>
                  <select className="w-full p-2 border border-input rounded-md text-responsive sm:text-sm">
                    <option value="">Select blood type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor="units-needed"
                    className="text-responsive sm:text-sm"
                  >
                    Units Needed
                  </Label>
                  <Input
                    id="units-needed"
                    type="number"
                    placeholder="1"
                    min="1"
                    className="text-responsive sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-responsive-cols sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label
                    htmlFor="request-date"
                    className="text-responsive sm:text-sm"
                  >
                    Required Date
                  </Label>
                  <Input
                    id="request-date"
                    type="date"
                    className="text-responsive sm:text-sm"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="urgency"
                    className="text-responsive sm:text-sm"
                  >
                    Urgency Level
                  </Label>
                  <select className="w-full p-2 border border-input rounded-md text-responsive sm:text-sm">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="request-location"
                  className="text-responsive sm:text-sm"
                >
                  Location
                </Label>
                <Input
                  id="request-location"
                  placeholder="Hospital/clinic location"
                  className="text-responsive sm:text-sm"
                />
              </div>

              <div>
                <Label
                  htmlFor="request-notes"
                  className="text-responsive sm:text-sm"
                >
                  Additional Notes
                </Label>
                <Textarea
                  id="request-notes"
                  placeholder="Describe the medical need, patient condition, or any special requirements..."
                  className="min-h-16 sm:min-h-20 text-responsive sm:text-sm"
                />
              </div>

              <div>
                <Label
                  htmlFor="contact-phone"
                  className="text-responsive sm:text-sm"
                >
                  Contact Phone
                </Label>
                <Input
                  id="contact-phone"
                  type="tel"
                  placeholder="+1-555-0123"
                  className="text-responsive sm:text-sm"
                />
              </div>

              <Button
                onClick={handleCreateBloodRequest}
                className="w-full text-responsive sm:text-sm"
                variant="hero"
                size="sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Submit Blood Request
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BloodDonation;
