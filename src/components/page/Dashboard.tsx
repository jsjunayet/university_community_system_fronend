"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { getAllDashbaordData } from "@/services/authSeverice";
import { Award, Briefcase, Calendar, Heart, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Map string names to Lucide icon components
const iconMap: Record<string, React.ElementType> = {
  Award: Award,
  Briefcase: Briefcase,
  Calendar: Calendar,
  Heart: Heart,
  MapPin: MapPin,
  Users: Users,
};

// Skeleton components for loading states
const StatCardSkeleton = () => (
  <Card className="hover:shadow-medium transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="w-12 h-12 rounded-lg" />
      </div>
    </CardContent>
  </Card>
);

const ActionCardSkeleton = () => (
  <Card className="group hover:shadow-medium transition-all">
    <CardHeader className="pb-3">
      <Skeleton className="w-12 h-12 rounded-lg mb-3" />
      <Skeleton className="h-5 w-32 mb-2" />
      <Skeleton className="h-4 w-40" />
    </CardHeader>
    <CardContent className="pt-0">
      <Skeleton className="h-9 w-full rounded-md" />
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const res = await getAllDashbaordData();
      if (res.success) {
        setDashboardData(res.data);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      toast.error("Error fetching dashboard data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getQuickActions = () => {
    switch (user?.role) {
      case "student":
        return [
          {
            title: "Donate Blood",
            description: "Register for blood donation",
            href: "/blood-donation",
            icon: "Heart",
            variant: "hero" as const,
          },
          {
            title: "Browse Events",
            description: "Find upcoming events",
            href: "/events",
            icon: "Calendar",
            variant: "university" as const,
          },
          {
            title: "Join Tours",
            description: "Explore campus tours",
            href: "/tours",
            icon: "MapPin",
            variant: "success" as const,
          },
          {
            title: "Find Jobs",
            description: "Search job opportunities",
            href: "/jobs",
            icon: "Briefcase",
            variant: "accent" as const,
          },
        ];
      case "alumni":
        return [
          {
            title: "Post Job",
            description: "Share job opportunities",
            href: "/jobs",
            icon: "Briefcase",
            variant: "hero" as const,
          },
          {
            title: "Create Event",
            description: "Organize community events",
            href: "/events",
            icon: "Calendar",
            variant: "university" as const,
          },
          {
            title: "Group tours",
            description: "Connect with current students",
            href: "/tours",
            icon: "Users",
            variant: "success" as const,
          },
          {
            title: "Emergency Blood",
            description: "Respond to urgent requests",
            href: "/blood-donation",
            icon: "Heart",
            variant: "accent" as const,
          },
        ];
      default:
        if (["admin", "superAdmin"].includes(user?.role || "")) {
          return [
            {
              title: "Manage Users",
              description: "User verification & roles",
              href: "/admin",
              icon: "Users",
              variant: "hero" as const,
            },
            {
              title: "Event Oversight",
              description: "Approve and monitor events",
              href: "/admin",
              icon: "Calendar",
              variant: "university" as const,
            },
            {
              title: "Blood System",
              description: "Manage donation system",
              href: "/admin",
              icon: "Heart",
              variant: "success" as const,
            },
            {
              title: "Group Tours",
              description: "Manage Group Tour system",
              href: "/admin",
              icon: "MapPin",
              variant: "accent" as const,
            },
          ];
        }
        return [];
    }
  };

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
        {isLoading ? (
          // Show skeleton loading while data is being fetched
          Array(4).fill(0).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))
        ) : dashboardData.length > 0 ? (
          dashboardData.map((stat, index) => {
            // Dynamically pick icon component from iconMap
            const IconComponent = iconMap[stat.icon] || Award; // default icon
            return (
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
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No dashboard data available</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            // Show skeleton loading while data is being fetched
            Array(4).fill(0).map((_, index) => (
              <ActionCardSkeleton key={index} />
            ))
          ) : quickActions.length > 0 ? (
            quickActions.map((action, index) => {
              const IconComponent = iconMap[action.icon] || Award;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-medium transition-all hover:-translate-y-1"
                >
                  <CardHeader className="pb-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <IconComponent className="w-6 h-6 text-white" />
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
              );
            })
          ) : (
            <Card className="col-span-full">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No quick actions available</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
