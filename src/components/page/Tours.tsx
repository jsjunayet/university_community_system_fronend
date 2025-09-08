"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Camera,
  CheckCircle,
  Clock,
  Info,
  MapPin,
  Route,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const Tours = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("available");

  // Mock tours data
  const availableTours = [
    {
      id: "1",
      title: "Historic Campus Walking Tour",
      description:
        "Explore the rich history and beautiful architecture of our century-old campus.",
      date: "2024-02-18",
      time: "10:00",
      duration: 2.5,
      maxParticipants: 20,
      currentParticipants: 12,
      guide: "Prof. Sarah Martinez",
      meetingPoint: "Main Gate Entrance",
      route: [
        "Historic Building",
        "Library",
        "Memorial Garden",
        "Clock Tower",
        "Administration Hall",
      ],
      difficulty: "Easy",
      highlights: ["Architecture", "History", "Photo Spots"],
      status: "upcoming",
    },
    {
      id: "2",
      title: "Science & Innovation Labs Tour",
      description:
        "Get an inside look at cutting-edge research facilities and laboratories.",
      date: "2024-02-22",
      time: "14:00",
      duration: 3,
      maxParticipants: 15,
      currentParticipants: 8,
      guide: "Dr. Michael Chen",
      meetingPoint: "Science Building Lobby",
      route: [
        "Physics Lab",
        "Chemistry Lab",
        "Innovation Center",
        "Research Wing",
        "Tech Hub",
      ],
      difficulty: "Moderate",
      highlights: ["Technology", "Research", "Innovation"],
      status: "upcoming",
    },
    {
      id: "3",
      title: "City Cultural Heritage Tour",
      description:
        "Discover the cultural landmarks and hidden gems of our vibrant city.",
      date: "2024-02-25",
      time: "09:00",
      duration: 4,
      maxParticipants: 25,
      currentParticipants: 22,
      guide: "Maya Rodriguez",
      meetingPoint: "University Bus Stop",
      route: [
        "Museum Quarter",
        "Art District",
        "Historic Market",
        "Cultural Center",
        "Riverside Park",
      ],
      difficulty: "Moderate",
      highlights: ["Culture", "Art", "Food", "Shopping"],
      status: "upcoming",
    },
  ];

  const myTours = [
    {
      id: "1",
      title: "Historic Campus Walking Tour",
      date: "2024-02-18",
      confirmationStatus: "confirmed",
      status: "upcoming",
    },
    {
      id: "2",
      title: "Alumni Garden Tour",
      date: "2024-01-15",
      confirmationStatus: "confirmed",
      status: "completed",
    },
  ];

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

  const handleJoinTour = (tourId: string) => {
    toast({
      title: "Tour Registration Successful!",
      description:
        "You've been registered for the tour. Check your email for confirmation details.",
    });
  };

  const handleCancelRegistration = (tourId: string) => {
    toast({
      title: "Registration Cancelled",
      description: "Your tour registration has been cancelled successfully.",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-accent text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Group Tours</h1>
            <p className="text-white/80">
              Explore campus and city with guided tours and fellow community
              members
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available Tours</TabsTrigger>
          <TabsTrigger value="my-tours">My Tours</TabsTrigger>
          <TabsTrigger value="guides">Tour Guides</TabsTrigger>
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
            {availableTours.map((tour) => (
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
                            {new Date(tour.date).toLocaleDateString()}
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
                          <span>{tour.guide}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span>{tour.meetingPoint}</span>
                        </div>
                      </div>

                      {/* Tour Route */}
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Route className="w-4 h-4" />
                          Tour Route
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {tour.route.map((stop, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-1"
                            >
                              <Badge variant="outline" className="text-xs">
                                {index + 1}. {stop}
                              </Badge>
                              {index < tour.route.length - 1 && (
                                <span className="text-muted-foreground">→</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="mb-4">
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Camera className="w-4 h-4" />
                          Highlights
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {tour.highlights.map((highlight, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {tour.currentParticipants}/{tour.maxParticipants}
                        </span>
                      </div>
                      <div className="w-24 bg-muted rounded-full h-2 mb-4">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              (tour.currentParticipants /
                                tour.maxParticipants) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>

                      <div className="space-y-2">
                        <Button
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
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Info className="w-4 h-4 mr-2" />
                          More Info
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Tours Tab */}
        <TabsContent value="my-tours" className="space-y-6">
          <h2 className="text-xl font-semibold">My Tour Registrations</h2>

          <div className="grid gap-4">
            {myTours.map((tour) => (
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
