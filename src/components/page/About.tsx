import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Calendar,
  Eye,
  GraduationCap,
  Heart,
  MapPin,
  MessageCircle,
  Star,
  Target,
  Users,
} from "lucide-react";
import Footer from "../share/Footer";
import Header from "../share/Header";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "Blood Donation Network",
      description:
        "Connecting donors with those in need through our comprehensive blood donation management system.",
    },
    {
      icon: Calendar,
      title: "Event Management",
      description:
        "Organize and participate in university events, workshops, and academic activities.",
    },
    {
      icon: MapPin,
      title: "Group Tours",
      description:
        "Explore destinations together with organized group tours and travel experiences.",
    },
    {
      icon: Briefcase,
      title: "Career Portal",
      description:
        "Access job opportunities, internships, and career development resources.",
    },
    {
      icon: MessageCircle,
      title: "Community Hub",
      description:
        "Connect with alumni, students, and faculty through our messaging platform.",
    },
    {
      icon: Users,
      title: "Alumni Network",
      description:
        "Stay connected with your university community and build lasting professional relationships.",
    },
  ];

  const stats = [
    { label: "Active Members", value: "10,000+" },
    { label: "Events Organized", value: "500+" },
    { label: "Blood Units Donated", value: "2,000+" },
    { label: "Job Placements", value: "1,200+" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About UniConnect
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Empowering university communities through technology, connection,
              and shared experiences. Building bridges between students, alumni,
              and faculty for a stronger tomorrow.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">
                    Our Mission
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To create a unified platform that strengthens university
                  communities by facilitating meaningful connections, supporting
                  social causes like blood donation, enabling professional
                  growth, and fostering lifelong relationships among students,
                  alumni, and faculty.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-soft">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">
                    Our Vision
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To be the leading digital ecosystem for university communities
                  worldwide, where every member feels connected, supported, and
                  empowered to contribute positively to society while achieving
                  their personal and professional aspirations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools and services designed to enhance university
              community engagement
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border/50"
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Impact by Numbers
            </h2>
            <p className="text-xl text-muted-foreground">
              Building stronger communities through meaningful engagement
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide our mission and shape our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Community First
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We prioritize the needs and well-being of our community members,
                fostering an environment of mutual support and collaboration.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Excellence
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We strive for excellence in everything we do, continuously
                improving our platform and services to exceed expectations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Inclusivity
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We embrace diversity and ensure our platform is accessible and
                welcoming to all members of the university community.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
