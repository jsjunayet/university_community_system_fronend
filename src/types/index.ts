export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "alumni" | "admin" | "superAdmin";
  avatar?: string;
  image?: string; // Added for profile image compatibility
  department?: string;
  graduationYear?: number;
  bloodType?: string;
  phone?: string;
  verified: boolean;
}

export interface BloodDonation {
  id: string;
  donorId: string;
  bloodType: string;
  donationDate: Date;
  location: string;
  status: "pending" | "approved" | "completed" | "rejected";
  emergencyRequest?: boolean;
  requesterMessage?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  organizer: string;
  category: "academic" | "social" | "sports" | "cultural" | "professional";
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  participants: string[];
  rsvps: { userId: string; status: "yes" | "no" | "maybe" }[];
}

export interface Tour {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number; // in hours
  maxParticipants: number;
  currentParticipants: number;
  guide: string;
  route: string[];
  meetingPoint: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  participants: {
    userId: string;
    confirmationStatus: "confirmed" | "pending" | "cancelled";
  }[];
}

export interface JobApplication {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string[];
  postedBy: string;
  postedDate: Date;
  applicationDeadline: Date;
  status: "open" | "closed";
  applications: {
    id: string;
    applicantId: string;
    appliedDate: Date;
    status: "pending" | "reviewing" | "shortlisted" | "rejected" | "hired";
    resume?: string;
    coverLetter?: string;
  }[];
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string; // if null, it's a public message
  content: string;
  timestamp: Date;
  type: "direct" | "announcement" | "comment";
  parentId?: string; // for replies
  likes: string[]; // user IDs who liked
  status: "sent" | "delivered" | "read";
}

export interface Notification {
  id: string;
  userId: string;
  type:
    | "blood_request"
    | "event_reminder"
    | "tour_confirmation"
    | "job_application"
    | "message";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}
