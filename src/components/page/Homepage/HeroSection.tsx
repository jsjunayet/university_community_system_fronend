import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Heart,
  MapPin,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>

      <div className="container mx-auto px-4 py-20 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-muted px-4 py-2 rounded-full text-sm text-muted-foreground mb-6">
              <Users className="w-4 h-4" />
              Connecting University Communities
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Complete
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                {" "}
                University{" "}
              </span>
              Community Platform
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect students, alumni, and administrators in one powerful
              platform. From blood donation drives to job opportunities, events
              to emergency help - everything your university community needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href={"/login"} passHref>
                <Button variant="hero" size="xl" className="min-w-48">
                  Get Started Today
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact" passHref>
                <Button variant="outline" size="xl" className="min-w-48">
                  Contact Us
                </Button>{" "}
              </Link>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 animate-fade-in">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                Blood Donation
              </h3>
              <p className="text-xs text-muted-foreground">
                Emergency & regular drives
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Events</h3>
              <p className="text-xs text-muted-foreground">
                RSVP & participation
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                Group Tours
              </h3>
              <p className="text-xs text-muted-foreground">
                Campus & city exploration
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Job Portal</h3>
              <p className="text-xs text-muted-foreground">
                Applications & tracking
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <User className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                Community Management
              </h3>
              <p className="text-xs text-muted-foreground">
                Real-time Community Management
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
