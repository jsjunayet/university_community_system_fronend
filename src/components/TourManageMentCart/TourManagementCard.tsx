"use client";
import { useToast } from "@/hooks/use-toast";
import {
  Calendar,
  Check,
  Clock,
  DollarSign,
  Eye,
  MapPin,
  Phone,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

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

interface TourManagementCardProps {
  tour: GroupTour;
  isAuthor: boolean;
  onApprove: (joinId: string) => void;
  onReject: (joinId: string) => void;
  onJoin: (tourId: string, joinData: any) => void;
}

export const TourManagementCard = ({
  tour,
  isAuthor,
  onApprove,
  onReject,
  onJoin,
}: TourManagementCardProps) => {
  const { toast } = useToast();
  const [selectedJoin, setSelectedJoin] = useState<TourJoin | null>(null);
  const [joinFormData, setJoinFormData] = useState({
    bkashNumber: "",
    trxId: "",
    amount: parseFloat(tour.price) || 0,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "success";
      case "REJECTED":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const pendingJoins = tour.tourJoins?.filter(
    (join) => join.status === "PENDING"
  );
  const approvedJoins = tour.tourJoins?.filter(
    (join) => join.status === "ACCEPTED"
  );
  return (
    <Card className="hover:shadow-medium transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-primary" />
              {tour.title}
            </CardTitle>
            <p className="text-muted-foreground text-sm mb-3">
              {tour.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{tour.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{new Date(tour.deadline).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span>৳{tour.price}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{tour.bkashNumber}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline">{tour.difficulty}</Badge>
              <Badge
                variant={tour.status === "approved" ? "success" : "secondary"}
              >
                {tour.status}
              </Badge>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Route:</p>
              <p className="text-sm text-muted-foreground">{tour.route}</p>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Highlights:</p>
              <p className="text-sm text-muted-foreground">{tour.highlights}</p>
            </div>
          </div>

          <div className="ml-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {tour.tourJoins?.length} participants
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {true && (
        <CardContent className="pt-0">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Manage Participants</h4>
              <div className="flex gap-2">
                <Badge variant="secondary">
                  {pendingJoins?.length} pending
                </Badge>
                <Badge variant="success">
                  {approvedJoins?.length} approved
                </Badge>
              </div>
            </div>

            {tour.tourJoins?.length > 0 ? (
              <div className="space-y-3">
                {tour.tourJoins.map((join: any) => (
                  <div
                    key={join.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-sm">
                            {join.user?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {join.user?.email}
                          </p>
                        </div>
                        <Badge
                          variant={getStatusColor(join.status)}
                          className="text-xs"
                        >
                          {join.status}
                        </Badge>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>৳{join.amount}</span>
                        <span>TrxID: {join.trxId}</span>
                        <span>{join.bkashNumber}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Participant Details</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <div>
                              <p className="font-medium">{join?.user?.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {join?.user?.email}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium">Amount</p>
                                <p>৳{join.amount}</p>
                              </div>
                              <div>
                                <p className="font-medium">bKash Number</p>
                                <p>{join.bkashNumber}</p>
                              </div>
                              <div>
                                <p className="font-medium">Transaction ID</p>
                                <p>{join.trxId}</p>
                              </div>
                              <div>
                                <p className="font-medium">Status</p>
                                <Badge variant={getStatusColor(join.status)}>
                                  {join.status}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium">Applied</p>
                              <p className="text-sm">{join?.createdAt}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {join.status === "PENDING" && (
                        <>
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => onApprove(join.id)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onReject(join.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-4">
                No participants yet
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
