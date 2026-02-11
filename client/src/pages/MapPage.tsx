import { Navigation } from "@/components/Navigation";
import { useReports, useZones } from "@/hooks/use-reports";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

// Leaflet icons setup
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const riskColors = {
  low: "#16a34a",    // green-600
  medium: "#eab308", // yellow-500
  high: "#dc2626",   // red-600
};

export default function MapPage() {
  const { data: reports, isLoading: loadingReports } = useReports();
  const { data: zones, isLoading: loadingZones } = useZones();

  if (loadingReports || loadingZones) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navigation />

      <div className="flex-1 relative">
        <MapContainer
          center={[10.8505, 76.2711]}
          zoom={13}
          className="absolute inset-0 z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Zones as Circles */}
          {zones?.map((zone) => (
            <Circle
              key={`zone-${zone.id}`}
              center={[zone.latitude, zone.longitude]}
              radius={zone.radius}
              pathOptions={{
                color: riskColors[zone.riskLevel as keyof typeof riskColors] || riskColors.low,
                fillColor: riskColors[zone.riskLevel as keyof typeof riskColors] || riskColors.low,
                fillOpacity: 0.2,
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{zone.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    Risk Level: {zone.riskLevel.toUpperCase()}
                  </Badge>
                </div>
              </Popup>
            </Circle>
          ))}

          {/* Render Reports as Markers */}
          {reports?.map((report) => (
            <Marker
              key={`report-${report.id}`}
              position={[report.latitude, report.longitude]}
            >
              <Popup className="custom-popup">
                <div className="w-64 p-1">
                  <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden bg-slate-100">
                    {report.imagePath ? (
                      <img src={report.imagePath} alt="Evidence" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        <AlertTriangle className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                    <Badge className="absolute top-2 right-2 shadow-sm">
                      {report.category}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800">Status: {report.status}</p>
                    <p className="text-sm text-slate-600">
                      {report.description || "No description."}
                    </p>
                    <p className="text-xs text-muted-foreground pt-2 border-t mt-2">
                      Reported: {format(new Date(report.createdAt || new Date()), "MMM d, h:mm a")}
                    </p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend Overlay */}
        <div className="absolute bottom-8 left-4 md:left-8 z-[400] bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-border/50 max-w-xs">
          <h4 className="font-bold text-sm mb-3 text-slate-800">Map Legend</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></span>
              <span>Individual Report</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500/50 border border-green-600"></span>
              <span>Low Risk Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500/50 border border-yellow-600"></span>
              <span>Medium Risk Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/50 border border-red-600"></span>
              <span>High Risk Zone</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
