"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Createeventjoin, getMyeventJoin } from "@/services/eventJoinService";
import { CreateEvent, getEvenUser, getOwnEvent } from "@/services/eventService";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  MapPin,
  Plus,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Define interfaces based on the backend model
interface User {
  id: string;
  email: string;
  role: string;
  image: string | null;
  name: string;
  bloodGroup: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
}

interface EventJoin {
  id: string;
  userId: string;
  eventId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  joinedAt: string | null;
  meetLink: string | null;
  createdAt: string;
  user: User;
  event: Event;
}

interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  registrationDeadline: string;
  contactEmail: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
  organizerId: string;
  organizer: User;
  participants: EventJoin[];
  currentParticipants?: number; // Calculated field
}

const Events = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("browse");
  const [isLoading, setIsLoading] = useState(false);
  const [isEventLoading, setIsEventLoading] = useState(false);
  const [isJoinLoading, setIsJoinLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [myJoinedEvents, setMyJoinedEvents] = useState<EventJoin[]>([]);
  const [newEventData, setNewEventData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    maxParticipants: 0,
    registrationDeadline: "",
    contactEmail: "",
  });

  // Add state for location selection
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Function to detect user's current location
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetectingLocation(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use OpenStreetMap's Nominatim API to get address from coordinates
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );

          const data = await response.json();

          if (data && data.display_name) {
            // Format the address to be more readable
            const formattedAddress = data.display_name
              .split(", ")
              .slice(0, 3)
              .join(", ");

            setNewEventData({
              ...newEventData,
              location: formattedAddress,
            });
            toast.success("Location detected successfully");
          } else {
            setLocationError("Could not determine address from your location");
            toast.error("Could not determine address from your location");
          }
        } catch (error) {
          console.error("Error fetching location data:", error);
          setLocationError("Error fetching location data");
          toast.error("Error fetching location data");
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        setLocationError(`Error getting location: ${error.message}`);
        toast.error(`Error getting location: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "academic":
        return "default";
      case "professional":
        return "success";
      case "cultural":
        return "secondary";
      case "social":
        return "outline";
      case "sports":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRSVPColor = (status: string | null) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "REJECTED":
        return "destructive";
      case "PENDING":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleRSVP = async (eventId: string) => {
    if (!user) {
      toast.error("Please login to join events");
      return;
    }

    try {
      setIsJoinLoading(true);
      const response = await Createeventjoin(eventId);

      if (response.success) {
        toast.success("Event join request submitted!");
        // Refresh events and joined events
        fetchEvents();
        fetchMyJoinedEvents();
      } else {
        toast.error(response.message || "Failed to join event");
      }
    } catch (error) {
      console.error("Error joining event:", error);
      toast.error("Failed to join event. Please try again.");
    } finally {
      setIsJoinLoading(false);
    }
  };

  const handleCreateEvent = async () => {
    // Validate form
    if (
      !newEventData.title ||
      !newEventData.description ||
      !newEventData.category ||
      !newEventData.date ||
      !newEventData.time ||
      !newEventData.location ||
      !newEventData.maxParticipants ||
      !newEventData.registrationDeadline ||
      !newEventData.contactEmail
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsEventLoading(true);
      console.log(newEventData);
      const response = await CreateEvent(newEventData);
      console.log(response);

      if (response.success) {
        toast.success("Event created successfully!");
        // Reset form
        setNewEventData({
          title: "",
          description: "",
          category: "",
          date: "",
          time: "",
          location: "",
          maxParticipants: 0,
          registrationDeadline: "",
          contactEmail: "",
        });
        // Refresh events
        fetchEvents();
        fetchMyEvents();
        // Switch to browse tab
        setActiveTab("browse");
      } else {
        toast.error(response.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setIsEventLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await getEvenUser();

      if (response.success) {
        // Calculate current participants for each event
        const eventsWithParticipants = response.data.map((event: Event) => ({
          ...event,
          currentParticipants: event.participants.filter(
            (p) => p.status === "APPROVED"
          ).length,
        }));

        setEvents(eventsWithParticipants);
      } else {
        toast.error(response.message || "Failed to fetch events");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyEvents = async () => {
    if (!user) return;

    try {
      const response = await getOwnEvent();

      if (response.success) {
        setMyEvents(response.data);
      } else {
        toast.error(response.message || "Failed to fetch your events");
      }
    } catch (error) {
      console.error("Error fetching your events:", error);
      toast.error("Failed to fetch your events. Please try again.");
    }
  };

  const fetchMyJoinedEvents = async () => {
    if (!user) return;

    try {
      const response = await getMyeventJoin();

      if (response.success) {
        setMyJoinedEvents(response.data);
      } else {
        toast.error(response.message || "Failed to fetch your joined events");
      }
    } catch (error) {
      console.error("Error fetching your joined events:", error);
      toast.error("Failed to fetch your joined events. Please try again.");
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
    if (user) {
      fetchMyEvents();
      fetchMyJoinedEvents();
    }
  }, [user]);

  // Get user's join status for an event
  const getUserEventJoinStatus = (eventId: string) => {
    if (!user || !myJoinedEvents.length) return null;

    const joinedEvent = myJoinedEvents.find((join) => join.eventId === eventId);
    return joinedEvent ? joinedEvent.status : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-secondary text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Event Management</h1>
            <p className="text-white/80">
              Discover, organize, and participate in university events
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Events</TabsTrigger>
          <TabsTrigger value="my-events">My Events</TabsTrigger>
          <TabsTrigger value="create">Create Event</TabsTrigger>
          {/* <TabsTrigger value="calendar">Calendar View</TabsTrigger> */}
        </TabsList>

        {/* Browse Events Tab */}
        <TabsContent value="browse" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <div className="flex gap-2">
              <Input placeholder="Search events..." className="w-64" />
              <select className="p-2 border border-input rounded-md">
                <option value="">All Categories</option>
                <option value="academic">Academic</option>
                <option value="professional">Professional</option>
                <option value="cultural">Cultural</option>
                <option value="social">Social</option>
                <option value="sports">Sports</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">No events found</div>
          ) : (
            <div className="grid gap-6">
              {events.map((event) => {
                const joinStatus = getUserEventJoinStatus(event.id);

                return (
                  <Card
                    key={event.id}
                    className="hover:shadow-medium transition-shadow"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold">
                              {event.title}
                            </h3>
                            <Badge variant={getCategoryColor(event.category)}>
                              {event.category}
                            </Badge>
                            {joinStatus && (
                              <Badge variant={getRSVPColor(joinStatus)}>
                                {joinStatus}
                              </Badge>
                            )}
                            {event.status !== "approved" && (
                              <Badge variant="outline">{event.status}</Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground mb-3">
                            {event.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {new Date(event.date).toLocaleDateString()} at{" "}
                                {event.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span>By {event.organizer.name}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {event.currentParticipants}/
                              {event.maxParticipants}
                            </span>
                          </div>
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{
                                width: `${
                                  ((event.currentParticipants || 0) /
                                    event.maxParticipants) *
                                  100
                                }%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="flex gap-2">
                        {!joinStatus ? (
                          <Button
                            variant="hero"
                            size="sm"
                            onClick={() => handleRSVP(event.id)}
                            disabled={isJoinLoading}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Join Event
                          </Button>
                        ) : joinStatus === "PENDING" ? (
                          <Button variant="secondary" size="sm" disabled>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Request Pending
                          </Button>
                        ) : joinStatus === "APPROVED" ? (
                          <Button variant="success" size="sm" disabled>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approved
                          </Button>
                        ) : (
                          <Button variant="destructive" size="sm" disabled>
                            <XCircle className="w-4 h-4 mr-2" />
                            Rejected
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* My Events Tab */}
        <TabsContent value="my-events" className="space-y-6">
          <h2 className="text-xl font-semibold">My Events</h2>

          {!user ? (
            <div className="text-center py-8">
              Please login to view your events
            </div>
          ) : myEvents.length === 0 ? (
            <div className="text-center py-8">
              You haven't created any events yet
            </div>
          ) : (
            <div className="grid gap-4">
              {myEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.date).toLocaleDateString()} at{" "}
                            {event.time}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                event.status === "approved"
                                  ? "success"
                                  : "secondary"
                              }
                            >
                              {event.status}
                            </Badge>
                            <Badge variant="outline">Organizer</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="university" size="sm">
                          Manage Event
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <h2 className="text-xl font-semibold mt-8">Events I've Joined</h2>

          {!user ? (
            <div className="text-center py-8">
              Please login to view joined events
            </div>
          ) : myJoinedEvents.length === 0 ? (
            <div className="text-center py-8">
              You haven't joined any events yet
            </div>
          ) : (
            <div className="grid gap-4">
              {myJoinedEvents.map((joinedEvent) => (
                <Card key={joinedEvent.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-accent rounded-lg flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            {joinedEvent.event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(
                              joinedEvent.event.date
                            ).toLocaleDateString()}{" "}
                            at {joinedEvent.event.time}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getRSVPColor(joinedEvent.status)}>
                              {joinedEvent.status}
                            </Badge>
                            <Badge variant="outline">Participant</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {joinedEvent.status === "APPROVED" &&
                          joinedEvent.meetLink && (
                            <Button variant="university" size="sm" asChild>
                              <a
                                href={joinedEvent.meetLink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Join Meeting
                              </a>
                            </Button>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Create Event Tab */}
        <TabsContent value="create" className="space-y-6">
          <h2 className="text-xl font-semibold">Create New Event</h2>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    placeholder="Enter event title"
                    value={newEventData.title}
                    onChange={(e) =>
                      setNewEventData({
                        ...newEventData,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="event-category">Category</Label>
                  <select
                    id="event-category"
                    className="w-full p-2 border border-input rounded-md"
                    value={newEventData.category}
                    onChange={(e) =>
                      setNewEventData({
                        ...newEventData,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="">Select category</option>
                    <option value="academic">Academic</option>
                    <option value="professional">Professional</option>
                    <option value="cultural">Cultural</option>
                    <option value="social">Social</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  placeholder="Describe your event..."
                  className="min-h-24"
                  value={newEventData.description}
                  onChange={(e) =>
                    setNewEventData({
                      ...newEventData,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="event-date">Date</Label>
                  <Input
                    id="registration-deadline"
                    type="date"
                    value={
                      newEventData.registrationDeadline
                        ? newEventData.registrationDeadline.split("T")[0] // keep only YYYY-MM-DD
                        : ""
                    }
                    onChange={(e) => {
                      const selectedDate = new Date(e.target.value);
                      const isoDate = selectedDate.toISOString(); // save as ISO for backend
                      setNewEventData({
                        ...newEventData,
                        date: isoDate,
                      });
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="event-time">Time</Label>
                  <Input
                    id="event-time"
                    type="time"
                    value={newEventData.time}
                    onChange={(e) =>
                      setNewEventData({ ...newEventData, time: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="event-location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="event-location"
                      placeholder="Event location"
                      className="flex-1"
                      value={newEventData.location}
                      onChange={(e) =>
                        setNewEventData({
                          ...newEventData,
                          location: e.target.value,
                        })
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={detectCurrentLocation}
                      disabled={isDetectingLocation}
                    >
                      {isDetectingLocation ? "Detecting..." : "Detect Location"}
                    </Button>
                  </div>
                  {locationError && (
                    <p className="text-sm text-red-500 mt-1">{locationError}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="max-participants">Max Participants</Label>
                <Input
                  id="max-participants"
                  type="number"
                  placeholder="100"
                  value={newEventData.maxParticipants || ""}
                  onChange={(e) =>
                    setNewEventData({
                      ...newEventData,
                      maxParticipants: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="registration-deadline">
                  Registration Deadline
                </Label>
                <Input
                  id="registration-deadline"
                  type="date"
                  value={
                    newEventData.registrationDeadline
                      ? newEventData.registrationDeadline.split("T")[0] // keep only YYYY-MM-DD
                      : ""
                  }
                  onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    const isoDate = selectedDate.toISOString(); // save as ISO for backend
                    setNewEventData({
                      ...newEventData,
                      registrationDeadline: isoDate,
                    });
                  }}
                />
              </div>
              <div>
                <Label htmlFor="contact-email">Contact Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="contact@event.com"
                  value={newEventData.contactEmail}
                  onChange={(e) =>
                    setNewEventData({
                      ...newEventData,
                      contactEmail: e.target.value,
                    })
                  }
                />
              </div>
            </CardContent>

            <Button
              onClick={handleCreateEvent}
              className="w-full"
              variant="hero"
              disabled={isEventLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              {isEventLoading ? "Creating Event..." : "Create Event"}
            </Button>
          </Card>
        </TabsContent>

        {/* Calendar View Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <h2 className="text-xl font-semibold">Event Calendar</h2>

          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
                <p className="text-muted-foreground">
                  Interactive calendar view will be implemented here with event
                  scheduling and timeline visualization.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Events;
