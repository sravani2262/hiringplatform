import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "glass" | "highlight";
}

export function EnhancedCard({ children, className, variant = "default" }: EnhancedCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-300",
        variant === "glass" && "glass-card",
        variant === "highlight" && [
          "border-primary/20",
          "bg-gradient-to-br from-primary/5 via-background to-background",
          "dark:from-primary/10 dark:via-background dark:to-background",
        ],
        "hover:shadow-lg hover:shadow-primary/5",
        "hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </Card>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatsCard({ title, value, description, icon, trend, className }: StatsCardProps) {
  return (
    <EnhancedCard variant="glass" className={cn("stats-card-glow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center space-x-2 mt-4">
            <span
              className={cn(
                "text-xs font-medium",
                trend.value > 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </EnhancedCard>
  );
}