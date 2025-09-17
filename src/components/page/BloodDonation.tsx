"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";

import { messaging } from "@/lib/firebase";
import {
  ApprovedOrRejectedStatusBloodDonationJoin,
  CreateTourBloodDonationJoin,
  getMyBloodDonationJoin,
} from "@/services/BloodJoinService";
import {
  CreateBloodRequest,
  getAllUserBloodRequest,
  getOwnBloodRequest,
} from "@/services/bloodService";
import { onMessage } from "firebase/messaging";
import { Calendar, Droplet, Heart, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BloodRequestCard } from "../BloodRequestCard/BloodRequestCard";

// Blood Request Card Skeleton component for loading states
const BloodRequestCardSkeleton = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="text-right">
            <Skeleton className="h-4 w-24 ml-auto" />
            <div className="mt-4 flex justify-end gap-2">
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const BloodDonation = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("requests");
  const [isLoading, setIsLoading] = useState(true);

  // Define proper interfaces for the data types
  interface BloodRequest {
    id: string;
    bloodType: string;
    unitsNeeded: number;
    urgencyLevel: string;
    location: string;
    date: string;
    notes?: string;
    contactPhone: string;
  }

  interface BloodDonation {
    id: string;
    status: string;
    request: BloodRequest;
  }

  const [Blood, setBlood] = useState<BloodRequest[]>([]);
  const [Avaiableblood, setAvaiableblood] = useState<BloodRequest[]>([]);
  const [myBlood, setMyblood] = useState<BloodDonation[]>([]);

  const fetchMyblood = async () => {
    try {
      const res = await getOwnBloodRequest();
      if (res.success) {
        setBlood(res.data);
      } else {
        toast.error("Failed to fetch your blood requests");
      }
    } catch (error) {
      toast.error("Error fetching your blood requests");
      console.error(error);
    }
  };

  const fetchAllBlood = async () => {
    try {
      const res = await getAllUserBloodRequest();
      if (res.success) {
        setAvaiableblood(res.data);
      } else {
        toast.error("Failed to fetch blood requests");
      }
    } catch (error) {
      toast.error("Error fetching blood requests");
      console.error(error);
    }
  };

  const fetchOwn = async () => {
    try {
      const res = await getMyBloodDonationJoin();
      if (res.success) {
        setMyblood(res.data);
      } else {
        toast.error("Failed to fetch your donation history");
      }
    } catch (error) {
      toast.error("Error fetching your donation history");
      console.error(error);
    }
  };
  console.log(Blood, "nn");
  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchMyblood(), fetchAllBlood(), fetchOwn()]).finally(() => {
      setIsLoading(false);
    });
  }, []);
  const [formData, setFormData] = useState({
    bloodType: "",
    unitsNeeded: 1,
    urgencyLevel: "low",
    location: "",
    date: "",
    notes: "",
    contactPhone: "",
  });

  // Input change handler
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Submit handler
  const handleCreateBloodRequest = async () => {
    // Backend model-ready object
    const requestPayload = {
      bloodType: formData.bloodType,
      unitsNeeded: Number(formData.unitsNeeded),
      urgencyLevel: formData.urgencyLevel.toUpperCase(), // backend expects enum
      location: formData.location,
      date: new Date(formData.date), // convert string -> Date
      notes: formData.notes || null,
      contactPhone: formData.contactPhone,
    };

    const res = await CreateBloodRequest(requestPayload);
    if (res.success) {
      toast.success(`${res.message}`);
      fetchMyblood();
      fetchAllBlood();
      setActiveTab("my-requests");
    } else {
      toast.error(`${res.message}`);
    }
    // later => send requestPayload to backend API
  };
  // useEffect(() => {
  //   // Request permission for notifications and listen for messages
  //   requestForToken();

  //   onMessageListener()
  //     .then((payload: any) => {
  //       toast(`${payload.notification.title}`);
  //     })
  //     .catch((err) => console.log("failed: ", err));
  // }, [toast]);
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

  useEffect(() => {
    onMessage(messaging, (payload) => {
      console.log("Foreground Message:", payload);
      alert(`${payload.notification?.title}: ${payload.notification?.body}`);
    });
  }, []);
  const handleBloodRequestAction = async (
    requestId: string,
    action: "join" | "approve" | "reject"
  ) => {
    const payload = { requestId: requestId };
    const res = await CreateTourBloodDonationJoin(payload);
    console.log(res, "hhh");
    if (res.success) {
      toast.success("Sucessfull Join");
      fetchMyblood();
    } else {
      toast.error("Something is Wrong");
    }
  };
  const handleRequestAction = async (
    requestId: string,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    const res = await ApprovedOrRejectedStatusBloodDonationJoin(
      requestId,
      status
    );
    console.log(res);

    if (res.success) {
      toast.success(`${res.message}`);
      fetchMyblood();
    } else {
      toast.error("Something is Wrong");
    }
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
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
            <Input
              placeholder="Search by blood type..."
              className="w-full sm:w-48 lg:w-64 text-responsive sm:text-sm"
            />
            <select className="p-2 border border-input rounded-md text-responsive sm:text-sm">
              <option value="">All Urgency</option>

              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {isLoading ? (
              // Show skeleton loading while data is being fetched
              Array(3)
                .fill(0)
                .map((_, index) => <BloodRequestCardSkeleton key={index} />)
            ) : Avaiableblood.length > 0 ? (
              Avaiableblood.map((request) => (
                <BloodRequestCard
                  key={request.id}
                  request={request}
                  userBloodType={user?.bloodGroup}
                  onRespond={handleBloodRequestAction}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Droplet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Blood Requests
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    There are no blood requests available at the moment.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* My Blood Requests Tab */}
        <TabsContent value="my-requests" className="space-y-4 sm:space-y-6">
          <h2 className="text-responsive-xl sm:text-xl font-semibold">
            My Blood Requests
          </h2>

          <div className="grid gap-4 sm:gap-6">
            {isLoading ? (
              // Show skeleton loading while data is being fetched
              Array(3)
                .fill(0)
                .map((_, index) => <BloodRequestCardSkeleton key={index} />)
            ) : Blood.length > 0 ? (
              Blood.map((request) => (
                <BloodRequestCard
                  key={request.id}
                  request={request}
                  userBloodType={user?.bloodGroup}
                  isOwnRequest={true}
                  onRespond={handleRequestAction}
                />
              ))
            ) : (
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
            {isLoading ? (
              // Show skeleton loading while data is being fetched
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Skeleton className="w-12 h-12 rounded-lg" />
                          <div>
                            <div className="flex items-center gap-2">
                              <Skeleton className="h-5 w-32" />
                              <Skeleton className="h-5 w-20" />
                            </div>
                            <Skeleton className="h-4 w-40 mt-1" />
                            <Skeleton className="h-4 w-48 mt-1" />
                          </div>
                        </div>
                        <div className="text-right">
                          <Skeleton className="h-4 w-32 ml-auto" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : myBlood.length > 0 ? (
              myBlood.map((donation) => (
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
                              {donation.request.bloodType} Donation
                            </h3>
                            <Badge variant={getStatusColor(donation.status)}>
                              {donation.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {donation.request.location}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Blood Request User Number:{" "}
                            {donation.request.contactPhone}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {new Date(donation.request.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Donation History
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't made any blood donations yet.
                  </p>
                </CardContent>
              </Card>
            )}
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
                    htmlFor="bloodType"
                    className="text-responsive sm:text-sm"
                  >
                    Blood Type Needed
                  </Label>
                  <select
                    id="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full p-2 border border-input rounded-md text-responsive sm:text-sm"
                  >
                    <option value="">Select blood type</option>

                    <option value="A_POS">A+</option>
                    <option value="A_NEG">A-</option>
                    <option value="B_POS">B+</option>
                    <option value="B_NEG">B-</option>
                    <option value="AB_POS">AB+</option>
                    <option value="AB_NEG">AB-</option>
                    <option value="O_POS">O+</option>
                    <option value="O_NEG">O-</option>
                  </select>
                </div>
                <div>
                  <Label
                    htmlFor="unitsNeeded"
                    className="text-responsive sm:text-sm"
                  >
                    Units Needed
                  </Label>
                  <Input
                    id="unitsNeeded"
                    type="number"
                    placeholder="1"
                    min="1"
                    value={formData.unitsNeeded}
                    onChange={handleChange}
                    className="text-responsive sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-responsive-cols sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label htmlFor="date" className="text-responsive sm:text-sm">
                    Required Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="text-responsive sm:text-sm"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="urgencyLevel"
                    className="text-responsive sm:text-sm"
                  >
                    Urgency Level
                  </Label>
                  <select
                    id="urgencyLevel"
                    value={formData.urgencyLevel}
                    onChange={handleChange}
                    className="w-full p-2 border border-input rounded-md text-responsive sm:text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <Label
                  htmlFor="location"
                  className="text-responsive sm:text-sm"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Hospital/clinic location"
                  className="text-responsive sm:text-sm"
                />
              </div>

              <div>
                <Label htmlFor="notes" className="text-responsive sm:text-sm">
                  Additional Notes
                </Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Describe the medical need, patient condition, or any special requirements..."
                  className="min-h-16 sm:min-h-20 text-responsive sm:text-sm"
                />
              </div>

              <div>
                <Label
                  htmlFor="contactPhone"
                  className="text-responsive sm:text-sm"
                >
                  Contact Phone
                </Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="+1-555-0123"
                  className="text-responsive sm:text-sm"
                />
              </div>

              <Button
                onClick={handleCreateBloodRequest}
                className="w-full text-responsive sm:text-sm text-white"
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
