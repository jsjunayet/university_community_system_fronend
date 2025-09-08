"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import {
  Award,
  Briefcase,
  Calendar,
  Heart,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  const { user } = useAuth();

  const getDashboardStats = () => {
    switch (user?.role) {
      case "student":
        return [
          {
            title: "Blood Donations",
            value: "3",
            icon: Heart,
            trend: "+1 this month",
          },
          {
            title: "Events Attended",
            value: "12",
            icon: Calendar,
            trend: "+2 this week",
          },
          {
            title: "Tours Joined",
            value: "5",
            icon: MapPin,
            trend: "+1 this month",
          },
          {
            title: "Job Applications",
            value: "8",
            icon: Briefcase,
            trend: "2 pending",
          },
        ];
      case "alumni":
        return [
          {
            title: "Jobs Posted",
            value: "4",
            icon: Briefcase,
            trend: "+1 this month",
          },
          {
            title: "Events Organized",
            value: "6",
            icon: Calendar,
            trend: "+1 this week",
          },
          {
            title: "Mentorship Sessions",
            value: "15",
            icon: Users,
            trend: "+3 this month",
          },
          {
            title: "Blood Donations",
            value: "8",
            icon: Heart,
            trend: "Regular donor",
          },
        ];
      default:
        if (["admin", "superAdmin"].includes(user?.role || "")) {
          return [
            {
              title: "Total Users",
              value: "2,847",
              icon: Users,
              trend: "+124 this month",
            },
            {
              title: "Active Events",
              value: "18",
              icon: Calendar,
              trend: "+3 this week",
            },
            {
              title: "Blood Requests",
              value: "23",
              icon: Heart,
              trend: "5 urgent",
            },
            {
              title: "Pending Applications",
              value: "45",
              icon: Briefcase,
              trend: "Review needed",
            },
          ];
        }
        return [];
    }
  };

  const getQuickActions = () => {
    switch (user?.role) {
      case "student":
        return [
          {
            title: "Donate Blood",
            description: "Register for blood donation",
            href: "/blood-donation",
            icon: Heart,
            variant: "hero" as const,
          },
          {
            title: "Browse Events",
            description: "Find upcoming events",
            href: "/events",
            icon: Calendar,
            variant: "university" as const,
          },
          {
            title: "Join Tours",
            description: "Explore campus tours",
            href: "/tours",
            icon: MapPin,
            variant: "success" as const,
          },
          {
            title: "Find Jobs",
            description: "Search job opportunities",
            href: "/jobs",
            icon: Briefcase,
            variant: "accent" as const,
          },
        ];
      case "alumni":
        return [
          {
            title: "Post Job",
            description: "Share job opportunities",
            href: "/jobs/create",
            icon: Briefcase,
            variant: "hero" as const,
          },
          {
            title: "Create Event",
            description: "Organize community events",
            href: "/events/create",
            icon: Calendar,
            variant: "university" as const,
          },
          {
            title: "Mentor Students",
            description: "Connect with current students",
            href: "/mentorship",
            icon: Users,
            variant: "success" as const,
          },
          {
            title: "Emergency Help",
            description: "Respond to urgent requests",
            href: "/blood-donation",
            icon: Heart,
            variant: "accent" as const,
          },
        ];
      default:
        if (["admin", "superAdmin"].includes(user?.role || "")) {
          return [
            {
              title: "Manage Users",
              description: "User verification & roles",
              href: "/admin/users",
              icon: Users,
              variant: "hero" as const,
            },
            {
              title: "Event Oversight",
              description: "Approve and monitor events",
              href: "/admin/events",
              icon: Calendar,
              variant: "university" as const,
            },
            {
              title: "Blood System",
              description: "Manage donation system",
              href: "/admin/blood",
              icon: Heart,
              variant: "success" as const,
            },
            {
              title: "System Reports",
              description: "Analytics and insights",
              href: "/admin/reports",
              icon: TrendingUp,
              variant: "accent" as const,
            },
          ];
        }
        return [];
    }
  };

  const stats = getDashboardStats();
  const quickActions = getQuickActions();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-hero text-white p-8 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-white/80 text-lg">
              {user?.role === "student" &&
                "Ready to make a difference in your university community?"}
              {user?.role === "alumni" &&
                "Thanks for staying connected and giving back!"}
              {["admin", "superAdmin"].includes(user?.role || "") &&
                "Here's your system overview and pending tasks."}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
              <Award className="w-12 h-12" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-medium transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.trend}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card
              key={index}
              className="group hover:shadow-medium transition-all hover:-translate-y-1"
            >
              <CardHeader className="pb-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <Link href={action.href}>
                  <Button variant={action.variant} className="w-full">
                    Get Started
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity & Notifications */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Blood donation scheduled</p>
                <p className="text-xs text-muted-foreground">
                  Tomorrow at 2:00 PM
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-university-green rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Event RSVP confirmed</p>
                <p className="text-xs text-muted-foreground">
                  Annual Alumni Meetup
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-university-orange rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">New message received</p>
                <p className="text-xs text-muted-foreground">
                  From Career Services
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Important Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm font-medium text-destructive">
                Urgent Blood Request
              </p>
              <p className="text-xs text-destructive/80">
                O- blood type needed at City Hospital
              </p>
            </div>
            <div className="p-3 bg-university-orange/10 border border-university-orange/20 rounded-lg">
              <p className="text-sm font-medium text-university-orange">
                Event Reminder
              </p>
              <p className="text-xs text-university-orange/80">
                Career Fair starts in 2 hours
              </p>
            </div>
            <div className="p-3 bg-university-green/10 border border-university-green/20 rounded-lg">
              <p className="text-sm font-medium text-university-green">
                Application Update
              </p>
              <p className="text-xs text-university-green/80">
                Your job application was reviewed
              </p>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default Dashboard;
