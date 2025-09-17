"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  ApprovedOrRejectedStatusGroupJoin,
  CreateTourGroupJoin,
  getMyGroupJoin,
} from "@/services/TourJoinService";
import {
  CreateTourGroup,
  getAllUserTourGroup,
  getOwnTourGroup,
} from "@/services/tourService";
import {
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  DollarSign,
  Info,
  MapPin,
  Plus,
  Route,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TourManagementCard } from "../TourManageMentCart/TourManagementCard";

// Skeleton components for loading states
const TourCardSkeleton = () => (
  <Card className="hover:shadow-medium transition-shadow">
    <CardHeader className="pb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <div className="font-medium mb-2 flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>

          <div className="mb-4">
            <div className="font-medium mb-2 flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <div className="text-right ml-6">
          <div className="space-y-2">
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
    </CardHeader>
  </Card>
);

const Tours = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("available");
  const [isLoading, setIsLoading] = useState(true);

  // Group tours state with proper types
  interface TourJoin {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    bkashNumber: string;
    trxId: string;
    amount: number;
    verified: boolean;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    createdAt: Date;
  }

  interface GroupTour {
    id: string;
    title: string;
    description: string;
    difficulty: string;
    duration: string;
    route: string;
    highlights: string;
    deadline: Date;
    bkashNumber: string;
    price: string;
    status: "pending" | "approved";
    authorId: string;
    tourJoins: TourJoin[];
  }

  const [groupTours, setGroupTours] = useState<GroupTour[]>([]);
  const [AvaiableTour, setAvaiableTour] = useState<GroupTour[]>([]);
  const [myTours, setMyTours] = useState<TourJoin[]>([]);
  console.log(myTours, "my");
  
  const fetchMyTour = async () => {
    try {
      const res = await getOwnTourGroup();
      if (res.success) {
        setGroupTours(res.data);
      } else {
        toast.error(res.message || "Failed to fetch your tours");
      }
    } catch (error) {
      console.error("Error fetching your tours:", error);
      toast.error("An error occurred while fetching your tours");
    }
  };
  
  const fetchAllTour = async () => {
    try {
      setIsLoading(true);
      const res = await getAllUserTourGroup();
      if (res.success) {
        setAvaiableTour(res.data);
      } else {
        toast.error(res.message || "Failed to fetch available tours");
      }
    } catch (error) {
      console.error("Error fetching available tours:", error);
      toast.error("An error occurred while fetching available tours");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchOwn = async () => {
    try {
      const res = await getMyGroupJoin();
      if (res.success) {
        setMyTours(res.data);
      } else {
        toast.error(res.message || "Failed to fetch joined tours");
      }
    } catch (error) {
      console.error("Error fetching joined tours:", error);
      toast.error("An error occurred while fetching joined tours");
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchMyTour(),
          fetchAllTour(),
          user ? fetchOwn() : Promise.resolve()
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  const [newTourData, setNewTourData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    duration: "",
    route: "",
    highlights: "",
    deadline: "",
    bkashNumber: "",
    price: "",
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "success";
      case "moderate":
        return "secondary";
      case "hard":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Group tour functions
  const handleCreateTour = async () => {
    if (!newTourData.title || !newTourData.description || !newTourData.price) {
      return;
    }

    const newTour: GroupTour = {
      id: Date.now().toString(),
      ...newTourData,
      deadline: new Date(newTourData.deadline),
    };
    console.log(newTour);
    const res = await CreateTourGroup(newTour);
    if (res?.success) {
      toast(`${res?.message}`);
    } else {
      toast(`${res?.message}`);
    }
    setNewTourData({
      title: "",
      description: "",
      difficulty: "Easy",
      duration: "",
      route: "",
      highlights: "",
      deadline: "",
      bkashNumber: "",
      price: "",
    });
    setSelectedTour(null);
    toast.success("Successfull Create Group tour");
  };

  const handleTourJoin = (tourId: string, joinData: any) => {
    const newJoin: TourJoin = {
      id: Date.now().toString(),
      userId: user?.id || "",
      userName: user?.name || "",
      userEmail: user?.email || "",
      ...joinData,
      verified: false,
      status: "PENDING",
      createdAt: new Date(),
    };

    setGroupTours((tours) =>
      tours.map((tour) =>
        tour.id === tourId
          ? { ...tour, tourJoins: [...tour.tourJoins, newJoin] }
          : tour
      )
    );
  };

  const handleApproveJoin = async (joinId: string) => {
    setGroupTours((tours) =>
      tours.map((tour) => ({
        ...tour,
        tourJoins: tour.tourJoins.map((join) =>
          join.id === joinId ? { ...join, status: "ACCEPTED" } : join
        ),
      }))
    );
    await ApprovedOrRejectedStatusGroupJoin(joinId, "ACCEPTED");
  };

  const handleRejectJoin = async (joinId: string) => {
    setGroupTours((tours) =>
      tours.map((tour) => ({
        ...tour,
        tourJoins: tour.tourJoins.map((join) =>
          join.id === joinId ? { ...join, status: "REJECTED" } : join
        ),
      }))
    );
    await ApprovedOrRejectedStatusGroupJoin(joinId, "REJECTED");
  };
  const [joinFormData, setJoinFormData] = useState({
    bkashNumber: "",
    trxId: "",
  });
  const [selectedTour, setSelectedTour] = useState<any>(null);

  const handleJoinSubmit = async () => {
    if (!selectedTour) return;

    const payload = {
      tourId: selectedTour.id,
      bkashNumber: joinFormData.bkashNumber,
      trxId: joinFormData.trxId,
      amount: parseFloat(selectedTour.price),
    };
    console.log(payload);
    const res = await CreateTourGroupJoin(payload);
    console.log(res);
    if (res.success) {
      toast.success(`${res.message}`);
    } else {
      toast.error(`${res.message}`);
    }
    // TODO: Send to backend API
    // await fetch("/api/join-tour", { method: "POST", body: JSON.stringify(payload) });

    // Reset after submit
    setJoinFormData({ bkashNumber: "", trxId: "" });
    setSelectedTour(null);
  };
  const myCreatedTours = groupTours.filter(
    (tour) => tour.authorId === user?.id
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-accent text-white p-responsive sm:p-6 rounded-lg">
        <div className="flex items-center gap-2 sm:gap-4 flex-responsive-col sm:flex-row text-center sm:text-left">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-responsive-xl sm:text-xl lg:text-2xl font-bold">
              Group Tours
            </h1>
            <p className="text-white/80 text-responsive sm:text-base">
              Explore campus and city with guided tours and fellow community
              members
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 gap-1">
          <TabsTrigger value="available" className="text-responsive sm:text-sm">
            Available
          </TabsTrigger>
          <TabsTrigger
            value="group-tours"
            className="text-responsive sm:text-sm"
          >
            Group Tours
          </TabsTrigger>
          <TabsTrigger value="my-tours" className="text-responsive sm:text-sm">
            My Tours
          </TabsTrigger>
          {/* <TabsTrigger value="guides" className="text-responsive sm:text-sm">
            Guides
          </TabsTrigger> */}
        </TabsList>

        {/* Available Tours Tab */}
        <TabsContent value="available" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Tours</h2>
            <div className="flex gap-2">
              <select className="p-2 border border-input rounded-md">
                <option value="">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="hard">Hard</option>
              </select>
              <select className="p-2 border border-input rounded-md">
                <option value="">All Types</option>
                <option value="campus">Campus Tours</option>
                <option value="city">City Tours</option>
                <option value="cultural">Cultural Tours</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6">
            {isLoading ? (
              // Show skeleton loading while data is being fetched
              Array(3).fill(0).map((_, index) => (
                <TourCardSkeleton key={index} />
              ))
            ) : (
              AvaiableTour?.map((tour) => (
                <Card
                  key={tour.id}
                  className="hover:shadow-medium transition-shadow"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{tour.title}</h3>
                          <Badge variant={getDifficultyColor(tour.difficulty)}>
                            {tour.difficulty}
                          </Badge>
                          <Badge variant="outline">{tour.duration}h</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {tour.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {new Date(tour.deadline).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {tour.time} ({tour.duration}h)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>By {tour.author.name}</span>
                          </div>
                        </div>

                        {/* Tour Route */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Route className="w-4 h-4" />
                            Tour Route
                          </h4>
                          {tour.route}
                        </div>

                        {/* Highlights */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Camera className="w-4 h-4" />
                            Highlights
                          </h4>
                          <div>{tour.highlights}</div>
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <div className="space-y-2">
                          {/* <Button
                            variant="hero"
                            size="sm"
                            onClick={() => handleJoinTour(tour.id)}
                            disabled={
                              tour.currentParticipants >= tour.maxParticipants
                            }
                            className="w-full"
                          >
                            {tour.currentParticipants >= tour.maxParticipants
                              ? "Full"
                              : "Join Tour"}
                          </Button> */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="hero"
                                size="sm"
                                className="w-full"
                                onClick={() => setSelectedTour(tour)}
                                disabled={
                                  tour.currentParticipants >= tour.maxParticipants
                                }
                              >
                                {tour.currentParticipants >= tour.maxParticipants
                                  ? "Full"
                                  : "Join Tour"}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Join {selectedTour?.title || "Tour"}
                                </DialogTitle>
                              </DialogHeader>

                              {selectedTour && (
                                <div className="space-y-4">
                                  <div className="bg-muted p-4 rounded-lg">
                                    <p className="text-sm font-medium mb-2">
                                      Payment Details:
                                    </p>
                                    <p className="text-sm">
                                      Amount: ৳{selectedTour.price}
                                    </p>
                                    <p className="text-sm">
                                      bKash: {selectedTour.bkashNumber}
                                    </p>
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium">
                                      Your bKash Number
                                    </label>
                                    <Input
                                      value={joinFormData.bkashNumber}
                                      onChange={(e) =>
                                        setJoinFormData((prev) => ({
                                          ...prev,
                                          bkashNumber: e.target.value,
                                        }))
                                      }
                                      placeholder="01XXXXXXXXX"
                                    />
                                  </div>

                                  <div>
                                    <label className="text-sm font-medium">
                                      Transaction ID
                                    </label>
                                    <Input
                                      value={joinFormData.trxId}
                                      onChange={(e) =>
                                        setJoinFormData((prev) => ({
                                          ...prev,
                                          trxId: e.target.value,
                                        }))
                                      }
                                      placeholder="Transaction ID from bKash"
                                    />
                                  </div>

                                  <Button
                                    onClick={handleJoinSubmit}
                                    className="w-full"
                                  >
                                    Submit Join Request
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Group Tours Tab */}
        <TabsContent value="group-tours" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Group Tours</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Group Tour
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Group Tour</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <Label htmlFor="title">Tour Title *</Label>
                    <Input
                      id="title"
                      value={newTourData.title}
                      onChange={(e) =>
                        setNewTourData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Cox's Bazar Beach Adventure"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newTourData.description}
                      onChange={(e) =>
                        setNewTourData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Describe your tour..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <select
                        id="difficulty"
                        value={newTourData.difficulty}
                        onChange={(e) =>
                          setNewTourData((prev) => ({
                            ...prev,
                            difficulty: e.target.value,
                          }))
                        }
                        className="w-full p-2 border border-input rounded-md"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        value={newTourData.duration}
                        onChange={(e) =>
                          setNewTourData((prev) => ({
                            ...prev,
                            duration: e.target.value,
                          }))
                        }
                        placeholder="3 days 2 nights"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="route">Route *</Label>
                    <Input
                      id="route"
                      value={newTourData.route}
                      onChange={(e) =>
                        setNewTourData((prev) => ({
                          ...prev,
                          route: e.target.value,
                        }))
                      }
                      placeholder="Dhaka → Cox's Bazar → Inani Beach"
                    />
                  </div>

                  <div>
                    <Label htmlFor="highlights">Highlights *</Label>
                    <Textarea
                      id="highlights"
                      value={newTourData.highlights}
                      onChange={(e) =>
                        setNewTourData((prev) => ({
                          ...prev,
                          highlights: e.target.value,
                        }))
                      }
                      placeholder="Beach activities, local seafood, sunset views"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deadline">Registration Deadline *</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={newTourData.deadline}
                        onChange={(e) =>
                          setNewTourData((prev) => ({
                            ...prev,
                            deadline: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price (BDT) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newTourData.price}
                        onChange={(e) =>
                          setNewTourData((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        placeholder="8500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bkashNumber">bKash Number *</Label>
                    <Input
                      id="bkashNumber"
                      value={newTourData.bkashNumber}
                      onChange={(e) =>
                        setNewTourData((prev) => ({
                          ...prev,
                          bkashNumber: e.target.value,
                        }))
                      }
                      placeholder="01XXXXXXXXX"
                    />
                  </div>

                  <Button onClick={handleCreateTour} className="w-full">
                    Create Tour
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6">
            {isLoading ? (
              // Show skeleton loading while data is being fetched
              Array(3).fill(0).map((_, index) => (
                <TourCardSkeleton key={index} />
              ))
            ) : groupTours.map((tour) => (
              <TourManagementCard
                key={tour.id}
                tour={tour}
                isAuthor={tour.authorId === user?.id}
                onApprove={handleApproveJoin}
                onReject={handleRejectJoin}
                onJoin={handleTourJoin}
              />
            ))}
          </div>

          {/* My Created Tours */}
          {myCreatedTours && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">My Created Tours</h3>
              <div className="grid gap-4">
                {isLoading ? (
                  // Show skeleton loading while data is being fetched
                  Array(3).fill(0).map((_, index) => (
                    <Card key={index} className="bg-muted/50">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="w-full">
                            <Skeleton className="h-6 w-48 mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6 mb-2" />
                            <div className="flex gap-2 mt-2">
                              <Skeleton className="h-5 w-20" />
                              <Skeleton className="h-5 w-32" />
                            </div>
                          </div>
                          <div className="text-right">
                            <Skeleton className="h-5 w-16" />
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                ) : myCreatedTours.length > 0 ? (
                  myCreatedTours.map((tour) => (
                    <Card key={tour.id} className="bg-muted/50">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {tour.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {tour.description}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge
                                variant={
                                  tour.status === "approved"
                                    ? "success"
                                    : "secondary"
                                }
                              >
                                {tour.status}
                              </Badge>
                              <Badge variant="outline">
                                {tour.tourJoins.length} participants
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <DollarSign className="w-4 h-4" />৳{tour.price}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">You haven't created any tours yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </TabsContent>

        {/* My Tours Tab */}
        <TabsContent value="my-tours" className="space-y-6">
          <h2 className="text-xl font-semibold">My Tour Registrations</h2>

          <div className="grid gap-4">
            {isLoading ? (
              // Show skeleton loading while data is being fetched
              Array(3).fill(0).map((_, index) => (
                <TourCardSkeleton key={index} />
              ))
            ) : myTours.map((tour) => (
              <Card key={tour.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{tour.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(tour.date).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={getStatusColor(tour.confirmationStatus)}
                          >
                            {tour.confirmationStatus}
                          </Badge>
                          <Badge
                            variant={
                              tour.status === "completed"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {tour.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Info className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                      {tour.status === "upcoming" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleCancelRegistration(tour.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tour Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Pre-Tour Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-university-green" />
                <span className="text-sm">
                  Confirm your attendance 24 hours before
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-university-green" />
                <span className="text-sm">
                  Arrive at meeting point 10 minutes early
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-university-green" />
                <span className="text-sm">Bring comfortable walking shoes</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-university-green" />
                <span className="text-sm">
                  Check weather and dress appropriately
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-university-green" />
                <span className="text-sm">
                  Bring water and snacks for longer tours
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tour Guides Tab */}
        <TabsContent value="guides" className="space-y-6">
          <h2 className="text-xl font-semibold">Our Tour Guides</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Prof. Sarah Martinez",
                expertise: "History & Architecture",
                experience: "8 years",
                tours: 45,
                rating: 4.9,
                bio: "Passionate about university history and architectural heritage.",
              },
              {
                name: "Dr. Michael Chen",
                expertise: "Science & Technology",
                experience: "5 years",
                tours: 32,
                rating: 4.8,
                bio: "Research scientist with expertise in innovation and technology.",
              },
              {
                name: "Maya Rodriguez",
                expertise: "Cultural Heritage",
                experience: "6 years",
                tours: 38,
                rating: 4.9,
                bio: "Cultural anthropologist and local history enthusiast.",
              },
            ].map((guide, index) => (
              <Card key={index}>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg">{guide.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {guide.expertise}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-center">{guide.bio}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{guide.experience}</p>
                      <p className="text-muted-foreground">Experience</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{guide.tours}</p>
                      <p className="text-muted-foreground">Tours Led</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-lg font-bold">{guide.rating}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average Rating
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tours;
