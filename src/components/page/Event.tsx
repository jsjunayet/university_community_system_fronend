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
  AlertCircle,
  Calendar,
  CheckCircle,
  MapPin,
  Plus,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

const Events = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("browse");

  // Mock events data
  const events = [
    {
      id: "1",
      title: "Annual Alumni Meetup 2024",
      description:
        "Join fellow alumni for networking, career discussions, and university updates.",
      date: "2024-02-15",
      time: "18:00",
      location: "University Convention Center",
      maxParticipants: 200,
      currentParticipants: 145,
      organizer: "Eshan",
      category: "professional",
      status: "upcoming",
      rsvpStatus: "yes",
    },
    {
      id: "2",
      title: "Tech Innovation Workshop",
      description:
        "Learn about latest technologies and their applications in various industries.",
      date: "2024-02-20",
      time: "14:00",
      location: "Engineering Building, Hall A",
      maxParticipants: 50,
      currentParticipants: 32,
      organizer: "Junayet",
      category: "academic",
      status: "upcoming",
      rsvpStatus: "maybe",
    },
    {
      id: "3",
      title: "Cultural Night Celebration",
      description:
        "Experience diverse cultures through food, music, and performances.",
      date: "2024-02-25",
      time: "19:00",
      location: "Student Activity Center",
      maxParticipants: 300,
      currentParticipants: 278,
      organizer: "Erfan",
      category: "cultural",
      status: "upcoming",
      rsvpStatus: null,
    },
    {
      id: "4",
      title: "Career Fair 2024",
      description:
        "Meet recruiters from top companies and explore job opportunities.",
      date: "2024-03-05",
      time: "10:00",
      location: "Main Auditorium",
      maxParticipants: 500,
      currentParticipants: 423,
      organizer: "Shiblu",
      category: "professional",
      status: "upcoming",
      rsvpStatus: "yes",
    },
  ];

  const myEvents = [
    {
      id: "1",
      title: "Annual Alumni Meetup 2024",
      date: "2024-02-15",
      status: "confirmed",
      role: "attendee",
    },
    {
      id: "2",
      title: "Career Fair 2024",
      date: "2024-03-05",
      status: "confirmed",
      role: "attendee",
    },
    {
      id: "3",
      title: "Student Mentorship Program",
      date: "2024-01-10",
      status: "completed",
      role: "organizer",
    },
  ];

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
      case "yes":
        return "success";
      case "no":
        return "destructive";
      case "maybe":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleRSVP = (eventId: string, response: "yes" | "no" | "maybe") => {
    toast({
      title: "RSVP Updated",
      description: `Your response has been recorded: ${response.toUpperCase()}`,
    });
  };

  const handleCreateEvent = () => {
    toast({
      title: "Event Created Successfully!",
      description: "Your event has been submitted for approval.",
    });
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

          <div className="grid gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-medium transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">{event.title}</h3>
                        <Badge variant={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                        {event.rsvpStatus && (
                          <Badge variant={getRSVPColor(event.rsvpStatus)}>
                            RSVP: {event.rsvpStatus.toUpperCase()}
                          </Badge>
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
                          <span>By {event.organizer}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {event.currentParticipants}/{event.maxParticipants}
                        </span>
                      </div>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              (event.currentParticipants /
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
                    <Button
                      variant="hero"
                      size="sm"
                      onClick={() => handleRSVP(event.id, "yes")}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Yes, I'll Attend
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRSVP(event.id, "maybe")}
                    >
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Maybe
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRSVP(event.id, "no")}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Can't Attend
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Events Tab */}
        <TabsContent value="my-events" className="space-y-6">
          <h2 className="text-xl font-semibold">My Events</h2>

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
                          {new Date(event.date).toLocaleDateString()}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              event.status === "completed"
                                ? "secondary"
                                : "success"
                            }
                          >
                            {event.status}
                          </Badge>
                          <Badge variant="outline">{event.role}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {event.role === "organizer" && (
                        <Button variant="university" size="sm">
                          Manage Event
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                  <Input id="event-title" placeholder="Enter event title" />
                </div>
                <div>
                  <Label htmlFor="event-category">Category</Label>
                  <select
                    id="event-category"
                    className="w-full p-2 border border-input rounded-md"
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
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="event-date">Date</Label>
                  <Input id="event-date" type="date" />
                </div>
                <div>
                  <Label htmlFor="event-time">Time</Label>
                  <Input id="event-time" type="time" />
                </div>
                <div>
                  <Label htmlFor="max-participants">Max Participants</Label>
                  <Input
                    id="max-participants"
                    type="number"
                    placeholder="100"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="event-location">Location</Label>
                <Input id="event-location" placeholder="Event location" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="registration-deadline">
                    Registration Deadline
                  </Label>
                  <Input id="registration-deadline" type="date" />
                </div>
                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="contact@event.com"
                  />
                </div>
              </div>

              <Button
                onClick={handleCreateEvent}
                className="w-full"
                variant="hero"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </CardContent>
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
