import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, trendValue }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-1 md:pb-2 space-y-0">
        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-bold">{value}</div>
        {(description || trendValue) && (
          <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 flex items-center">
            {trendValue && (
              <span
                className={`mr-1 font-medium ${trend === 'up' ? 'text-green-500' :
                    trend === 'down' ? 'text-red-500' :
                      'text-yellow-500'
                  }`}
              >
                {trendValue}
              </span>
            )}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
