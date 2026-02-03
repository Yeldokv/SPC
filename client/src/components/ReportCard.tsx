import { Report } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { MapPin, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface ReportCardProps {
  report: Report;
  onUpdateStatus?: (id: number, status: Report["status"]) => void;
  showActions?: boolean;
}

const statusColors = {
  pending: "bg-amber-100 text-amber-700 hover:bg-amber-100",
  verified: "bg-blue-100 text-blue-700 hover:bg-blue-100",
  closed: "bg-slate-100 text-slate-700 hover:bg-slate-100",
};

const categoryLabels = {
  single: "Single Stray",
  group: "Pack/Group",
  aggressive: "Aggressive Behavior",
  injured: "Injured Animal",
};

export function ReportCard({ report, onUpdateStatus, showActions = false }: ReportCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 border-border/60">
      <div className="relative h-48 w-full bg-slate-100">
        {report.imagePath ? (
          <img 
            src={report.imagePath} 
            alt="Report" 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/50">
            <AlertCircle className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className={`${statusColors[report.status as keyof typeof statusColors]} border-0 shadow-sm`}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2 pt-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-display font-semibold text-lg text-slate-900">
              {categoryLabels[report.category as keyof typeof categoryLabels] || report.category}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {format(new Date(report.createdAt || new Date()), "MMM d, yyyy • h:mm a")}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
          {report.description || "No description provided."}
        </p>
        <div className="flex items-center text-xs text-muted-foreground bg-muted/50 p-2 rounded-lg">
          <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary" />
          Lat: {report.latitude.toFixed(4)}, Lng: {report.longitude.toFixed(4)}
        </div>
      </CardContent>

      {showActions && report.status !== 'closed' && (
        <CardFooter className="pt-0 flex gap-2">
          {report.status === 'pending' && (
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700" 
              size="sm"
              onClick={() => onUpdateStatus?.(report.id, 'verified')}
            >
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              Verify
            </Button>
          )}
          <Button 
            className="flex-1" 
            variant="outline" 
            size="sm"
            onClick={() => onUpdateStatus?.(report.id, 'closed')}
          >
            Close Case
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
