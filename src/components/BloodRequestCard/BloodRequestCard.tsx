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
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Droplet,
  Eye,
  MapPin,
  Phone,
  User,
  XCircle,
} from "lucide-react";

interface BloodRequest {
  id: string;
  bloodType: string;
  location: string;
  date: string;
  notes?: string;
  contactPhone: string;
  status: "pending" | "approved" | "completed" | "rejected";
  requester: {
    id: string;
    name: string;
    email: string;
    contactPhone: string;
  };
  donations: Array<{
    id: string;
    donorId: string;
    donor: {
      name: string;
      email: string;
    };
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    donatedAt?: string;
  }>;
  urgency: "low" | "medium" | "high" | "critical";
  unitsNeeded: number;
}

interface BloodRequestCardProps {
  request: BloodRequest;
  bloodGroup?: string;
  isOwnRequest?: boolean;
  onRespond?: (requestId: string, action: any) => void;
}

export const BloodRequestCard = ({
  request,
  bloodGroup,
  isOwnRequest = false,
  onRespond,
}: BloodRequestCardProps) => {
  // const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const { user } = useAuth();
  console.log(request);
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

  const handleJoinRequest = () => {
    onRespond?.(request.id, "join");
  };

  const handleManageDonation = (
    donationId: string,
    action: "ACCEPTED" | "REJECTED"
  ) => {
    onRespond?.(donationId, action);
  };
  const bloodGroupMatches = bloodGroup == request.bloodType;
  const alreadyJoined = request.donations?.some(
    (d) => d.donorId === user?.id && d.status === "PENDING" // or ACCEPTED
  );
  return (
    <Card
      className={`border-l-4 ${
        request.urgency === "critical"
          ? "border-l-destructive"
          : "border-l-primary"
      }`}
    >
      <CardHeader className="p-responsive sm:p-6 pb-3">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-primary rounded-lg flex items-center justify-center shrink-0">
              <Droplet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-responsive-lg sm:text-lg">
                  {request.bloodType} Blood Needed
                </h3>
              </div>
              <p className="text-responsive sm:text-sm text-muted-foreground truncate">
                Requested by {request.requester.name}
              </p>
            </div>
          </div>
          <div className="text-center sm:text-right shrink-0">
            <p className="text-xl sm:text-2xl font-bold text-destructive">
              {request.unitsNeeded}
            </p>
            <p className="text-xs text-muted-foreground">units needed</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-responsive sm:p-6 pt-0 space-y-3 sm:space-y-4">
        {request.notes && (
          <p className="text-responsive sm:text-sm text-muted-foreground bg-muted p-2 sm:p-3 rounded-md">
            {request.notes}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-responsive sm:text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
            <span className="truncate">{request.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
            <span>{new Date(request.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
            <span className="truncate">{request.requester.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground shrink-0" />
            <span className="truncate">
              {request.contactPhone || "Not provided"}
            </span>
          </div>
        </div>

        {/* Action buttons for non-own requests */}
        {!isOwnRequest && (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="hero"
              size="sm"
              onClick={handleJoinRequest}
              disabled={!bloodGroupMatches || alreadyJoined}
              className="text-responsive sm:text-sm text-white"
            >
              <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Respond to Request
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-responsive sm:text-sm"
            >
              <a
                href={`https://wa.me/${request.contactPhone}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Contact Requester
              </a>
            </Button>

            {user?.bloodGroup !== request?.bloodType && (
              <p className="text-xs text-muted-foreground mt-1">
                Your blood type ({user?.bloodGroup}) doesn't match (
                {request?.bloodType})
              </p>
            )}

            {user?.bloodGroup === request?.bloodType && (
              <p className="text-xs text-green-600 mt-1">
                ✅ Your blood type matches the request!
              </p>
            )}
          </div>
        )}

        {/* Management section for own requests */}
        {isOwnRequest && request.donations?.length > 0 && (
          <div className="border-t pt-3 sm:pt-4 space-y-3">
            <h4 className="font-medium text-responsive sm:text-sm">
              Donation Responses ({request.donations.length})
            </h4>
            <div className="space-y-2">
              {request.donations.map((donation) => (
                <div
                  key={donation.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:p-3 bg-muted rounded-md gap-2 sm:gap-0"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-responsive sm:text-sm truncate">
                        {donation.donor.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {donation.donor.email}
                      </p>
                    </div>
                    <Badge
                      variant={getStatusColor(donation.status)}
                      className="text-xs"
                    >
                      {donation.status}
                    </Badge>
                  </div>

                  {donation.status === "PENDING" && (
                    <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="hero"
                        onClick={() =>
                          handleManageDonation(donation.id, "ACCEPTED")
                        }
                        className="flex-1 sm:flex-none text-xs"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleManageDonation(donation.id, "REJECTED")
                        }
                        className="flex-1 sm:flex-none text-xs"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {donation.status === "ACCEPTED" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-responsive-lg sm:text-lg">
                            Donation Details
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <p className="font-medium text-responsive sm:text-sm">
                              Donor Information
                            </p>
                            <p className="text-responsive sm:text-sm text-muted-foreground">
                              {donation.donor.name}
                            </p>
                            <p className="text-responsive sm:text-sm text-muted-foreground">
                              {donation.donor.email}
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
                          {donation.donatedAt && (
                            <div>
                              <p className="font-medium text-responsive sm:text-sm">
                                Donation Date
                              </p>
                              <p className="text-responsive sm:text-sm text-muted-foreground">
                                {new Date(
                                  donation.donatedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div className="bg-muted p-3 rounded-md">
                            <p className="font-medium text-responsive sm:text-sm mb-2">
                              Meeting Information
                            </p>
                            <p className="text-responsive sm:text-sm text-muted-foreground">
                              Location: {request.location}
                            </p>
                            <p className="text-responsive sm:text-sm text-muted-foreground">
                              Date:{" "}
                              {new Date(request.date).toLocaleDateString()}
                            </p>
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
      </CardContent>
    </Card>
  );
};
