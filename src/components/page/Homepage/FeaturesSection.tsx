import {
  Briefcase,
  Calendar,
  Heart,
  MapPin,
  MessageCircle,
  Users,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

const FeaturesSection = () => {
  const features = [
    {
      icon: Heart,
      title: "Blood Donation System",
      description:
        "Comprehensive blood donation management with emergency requests and donor registration.",
      features: [
        "Donor registration & profile management",
        "Emergency blood requests with alerts",
        "Blood type matching & availability",
        "Donation history tracking",
        "Health screening reminders",
      ],
      variant: "primary" as const,
    },
    {
      icon: Calendar,
      title: "Event Management",
      description:
        "Complete event lifecycle management from announcements to confirmations.",
      features: [
        "Event announcements & RSVP",
        "Real-time participation tracking",
        "Automated confirmations",
        "Event calendar integration",
        "Post-event feedback collection",
      ],
      variant: "secondary" as const,
    },
    {
      icon: MapPin,
      title: "Group Tours",
      description:
        "Organize and manage campus and city tours with real-time updates.",
      features: [
        "Tour registration & capacity management",
        "Route planning & navigation",
        "Live participation status",
        "Tour guide assignments",
        "Safety check-ins & updates",
      ],
      variant: "accent" as const,
    },
    {
      icon: Briefcase,
      title: "Job Applications",
      description:
        "Streamlined job portal connecting students, alumni, and employers.",
      features: [
        "Job posting & application submission",
        "Application status tracking",
        "Resume & portfolio management",
        "Interview scheduling",
        "Employer-candidate messaging",
      ],
      variant: "primary" as const,
    },
    {
      icon: MessageCircle,
      title: "Communication Hub",
      description:
        "Rich messaging system with notifications, comments, and social features.",
      features: [
        "Push notifications & alerts",
        "Comments & likes system",
        "Status updates & announcements",
        "Direct messaging",
        "Community forums & discussions",
      ],
      variant: "secondary" as const,
    },
    {
      icon: Users,
      title: "Community Management",
      description:
        "Comprehensive user management for students, alumni, and administrators.",
      features: [
        "Multi-role user system",
        "Profile verification & badges",
        "Alumni network connections",
        "Administrative controls",
        "Community engagement metrics",
      ],
      variant: "accent" as const,
    },
  ];

  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything Your University Community Needs
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive platform designed to strengthen bonds, improve
            coordination, and enhance the overall university experience for
            everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
