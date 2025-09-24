import { Card, CardContent } from "@/components/ui/card";

const StatsSection = () => {
  const stats = [
    {
      number: "10+",
      label: "Active Users",
      description: "Students, alumni, and staff",
    },
    {
      number: "15+",
      label: "Blood Donations",
      description: "Lives saved through our platform",
    },
    {
      number: "12+",
      label: "Events Organized",
      description: "Community gatherings and activities",
    },
    {
      number: "95%",
      label: "Satisfaction Rate",
      description: "Users love our platform",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Making a Real Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how our platform is transforming university communities
            worldwide
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="text-center hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <CardContent className="p-6">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-foreground mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
