import { Service } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dumbbell, Laptop, Apple, Users, LucideIcon } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

const iconMap: Record<string, LucideIcon> = {
  Dumbbell,
  Laptop,
  Apple,
  Users
};

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Dumbbell;

  return (
    <Card className="group transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 overflow-hidden bg-card/50 backdrop-blur-sm">
      <div className="h-48 overflow-hidden relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
      </div>
      <CardHeader className="relative z-10 -mt-10 bg-card pt-8 mx-4 rounded-t-xl mb-0 shadow-sm border-x border-t">
        <div className="absolute -top-5 sm:-top-6 left-5 sm:left-6 p-3 sm:p-4 bg-primary text-primary-foreground rounded-xl shadow-lg transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <CardTitle className="text-lg sm:text-xl pt-2">{service.title}</CardTitle>
      </CardHeader>
      <CardContent className="mx-4 pb-4 sm:pb-6 px-4 sm:px-6 border-x border-b rounded-b-xl border-t-0 text-xs sm:text-sm text-muted-foreground bg-card">
        {service.description}
      </CardContent>
    </Card>
  );
}
