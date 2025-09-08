import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  variant?: "primary" | "secondary" | "accent";
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  features,
  variant = "primary",
}: FeatureCardProps) => {
  const gradientClass = {
    primary: "bg-gradient-primary",
    secondary: "bg-gradient-secondary",
    accent: "bg-gradient-accent",
  }[variant];

  return (
    <Card className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border/50">
      <CardHeader className="pb-4">
        <div
          className={`w-12 h-12 ${gradientClass} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-xl font-semibold text-foreground">
          {title}
        </CardTitle>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-2 text-sm text-foreground"
            >
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              {feature}
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
