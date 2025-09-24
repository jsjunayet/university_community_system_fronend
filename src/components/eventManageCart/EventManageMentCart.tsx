"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  CheckCircle,
  Eye,
  Link,
  MapPin,
  User,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";

interface EventJoin {
  id: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  joinedAt?: string;
  meetLink?: string;
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
  status: "pending" | "approved" | "completed" | "cancelled" | "rejected";
  organizer: {
    id: string;
    name: string;
  };
  participants: EventJoin[];
  currentParticipants: number;
}

interface EventManagementCardProps {
  event: any;
  isOrganizer?: boolean;
  userJoinStatus?: "none" | "pending" | "accepted" | "rejected";
  onJoinEvent?: (eventId: string) => void;
  onManageParticipant?: (
    joinId: string,
    action: "approve" | "reject",
    meetLink?: string
  ) => void;
}

export const EventManagementCard = ({
  event,
  isOrganizer = false,
  userJoinStatus = "none",
  onJoinEvent,
  onManageParticipant,
}: EventManagementCardProps) => {
  const { toast } = useToast();
  const [meetLink, setMeetLink] = useState("");
  const [showMeetLinkDialog, setShowMeetLinkDialog] = useState(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<EventJoin | null>(null);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "success";
      case "PENDING":
        return "secondary";
      case "REJECTED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getJoinStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "success";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleJoinEvent = () => {
    onJoinEvent?.(event.id);
    toast({
      title: "Join Request Sent",
      description:
        "Your request to join this event has been sent to the organizer.",
    });
  };

  const handleApproveWithMeetLink = (participant: EventJoin) => {
    setSelectedParticipant(participant);
    setShowMeetLinkDialog(true);
  };

  const handleConfirmApproval = () => {
    if (selectedParticipant && meetLink.trim()) {
      onManageParticipant?.(selectedParticipant.id, "approve", meetLink.trim());
      toast({
        title: "Participant Approved",
        description:
          "The participant has been approved and will receive the meeting link.",
      });
      setMeetLink("");
      setSelectedParticipant(null);
      setShowMeetLinkDialog(false);
    }
  };

  const handleReject = (joinId: string) => {
    onManageParticipant?.(joinId, "reject");
    toast({
      title: "Participant Rejected",
      description: "The join request has been rejected.",
    });
  };

  const isEventFull = event.currentParticipants >= event.maxParticipants;
  const isRegistrationClosed =
    new Date() > new Date(event.registrationDeadline);

  return (
    <Card className="hover:shadow-medium transition-shadow">
      <CardHeader className="p-responsive sm:p-6 pb-3">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-responsive-xl sm:text-xl font-semibold truncate">
                {event.title}
              </h3>
              <Badge
                variant={getCategoryColor(event.category)}
                className="text-xs"
              >
                {event.category}
              </Badge>

              {userJoinStatus !== "none" && (
                <Badge
                  variant={getJoinStatusColor(userJoinStatus)}
                  className="text-xs"
                >
                  {userJoinStatus.toUpperCase()}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 mb-2">
              <Badge
                variant={event.status === "approved" ? "success" : "secondary"}
              >
                {event.status}
              </Badge>
              <Badge variant="outline">Organizer</Badge>
            </div>
            <p className="text-muted-foreground text-responsive sm:text-sm mb-3 line-clamp-2">
              {event.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-responsive sm:text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                <span className="truncate">
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
                <span className="truncate">By {event.organizer.name}</span>
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              <span className="text-responsive sm:text-sm">
                {event.currentParticipants || 0}/{event.maxParticipants}
              </span>
            </div>
            <div className="w-20 sm:w-24 bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    (event.currentParticipants / event.maxParticipants) * 100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
            {isEventFull && (
              <p className="text-xs text-destructive mt-1">Event Full</p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-responsive sm:p-6 pt-0 space-y-3 sm:space-y-4">
        {/* Action buttons for non-organizers */}
        {!isOrganizer && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="hero"
              size="sm"
              onClick={handleJoinEvent}
              disabled={
                userJoinStatus !== "none" || isEventFull || isRegistrationClosed
              }
              className="text-responsive sm:text-sm"
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              {userJoinStatus === "none"
                ? "Join Event"
                : `Status: ${userJoinStatus}`}
            </Button>

            {(isEventFull || isRegistrationClosed) && (
              <p className="text-xs text-muted-foreground">
                {isEventFull ? "Event is full" : "Registration closed"}
              </p>
            )}
          </div>
        )}

        {/* Organizer management section */}
        {isOrganizer && event.participants.length > 0 && (
          <div className="border-t pt-3 sm:pt-4 space-y-3">
            <h4 className="font-medium text-responsive sm:text-sm">
              Join Requests (
              {
                event.participants.filter((p: any) => p.status === "PENDING")
                  .length
              }{" "}
              pending)
            </h4>
            <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
              {event.participants.map((participant: any) => (
                <div
                  key={participant.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-muted rounded-md gap-2 sm:gap-0"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-responsive sm:text-sm truncate">
                        {participant.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {participant.user.email}
                      </p>
                    </div>
                    <Badge
                      variant={getStatusColor(participant.status)}
                      className="text-xs"
                    >
                      {participant.status}
                    </Badge>
                  </div>

                  {participant.status === "PENDING" && (
                    <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="hero"
                        onClick={() => handleApproveWithMeetLink(participant)}
                        className="flex-1 sm:flex-none text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(participant.id)}
                        className="flex-1 sm:flex-none text-xs"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {participant.status === "ACCEPTED" &&
                    participant.meetLink && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle className="text-responsive-lg sm:text-lg">
                              Participant Details
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 sm:space-y-4">
                            <div>
                              <p className="font-medium text-responsive sm:text-sm">
                                Participant Information
                              </p>
                              <p className="text-responsive sm:text-sm text-muted-foreground">
                                {participant.user.name}
                              </p>
                              <p className="text-responsive sm:text-sm text-muted-foreground">
                                {participant.user.email}
                              </p>
                            </div>
                            <div>
                              <p className="font-medium text-responsive sm:text-sm">
                                Status
                              </p>
                              <Badge variant="success" className="text-xs">
                                Approved
                              </Badge>
                            </div>
                            <div>
                              <p className="font-medium text-responsive sm:text-sm">
                                Meeting Link
                              </p>
                              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                                <Link className="w-4 h-4 text-muted-foreground" />
                                <a
                                  href={participant.meetLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-responsive sm:text-sm text-primary hover:underline truncate"
                                >
                                  {participant.meetLink}
                                </a>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meeting link dialog */}
        <Dialog open={showMeetLinkDialog} onOpenChange={setShowMeetLinkDialog}>
          <DialogContent className="max-w-sm sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-responsive-lg sm:text-lg">
                Approve Participant
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-responsive sm:text-sm text-muted-foreground">
                Approving {selectedParticipant?.user.name} for the event. Please
                provide a meeting link:
              </p>
              <div>
                <Label
                  htmlFor="meet-link"
                  className="text-responsive sm:text-sm"
                >
                  Meeting Link
                </Label>
                <Input
                  id="meet-link"
                  type="url"
                  placeholder="https://meet.google.com/xxx-xxxx-xxx"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  className="text-responsive sm:text-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleConfirmApproval}
                  disabled={!meetLink.trim()}
                  className="flex-1 text-responsive sm:text-sm"
                  variant="hero"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve & Send Link
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowMeetLinkDialog(false)}
                  className="text-responsive sm:text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
