import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { 
  ArrowLeft, Train, MapPin, AlertCircle, Loader2, Wifi, 
  Zap, Accessibility, ParkingCircle, WashingMachine
} from "lucide-react";

interface MetroStation {
  id: string;
  stationName: string;
  stationCode: string;
  city: string;
  metroLine: string;
  facilities: string[];
}

export default function MetroDetail() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const { toast } = useToast();

  const { data: stationData, isLoading, error } = useQuery({
    queryKey: ['/api/metro/stations', id],
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading station",
        description: "Failed to fetch station details. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const station = (stationData as any)?.station as MetroStation | undefined;

  const getFacilityIcon = (facility: string) => {
    const icons: Record<string, any> = {
      'Parking': ParkingCircle,
      'Elevator': Accessibility,
      'Washroom': WashingMachine,
      'WiFi': Wifi,
    };
    const Icon = icons[facility] || Zap;
    return <Icon className="h-4 w-4" />;
  };

  const getLineColor = (line: string) => {
    const colors: Record<string, string> = {
      'Red': 'bg-white/10 text-white/80 border-white/20',
      'Blue': 'bg-white/10 text-white/80 border-white/20',
      'Yellow': 'bg-white/10 text-white/80 border-white/20',
      'Green': 'bg-white/10 text-white/80 border-white/20',
      'Orange': 'bg-white/10 text-white/80 border-white/20',
      'Purple': 'bg-white/10 text-white/80 border-white/20',
    };
    return colors[line] || 'bg-white/20 text-white border-white/50';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 flex items-center justify-center">
        <Card className="bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm rounded-none">
          <CardContent className="p-12 flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-white/80 mb-4" />
            <p className="text-lg font-medium text-white">Loading station details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen bg-black text-white pb-20 flex items-center justify-center">
        <Card className="bg-white/5 border border-white/10 shadow-2xl backdrop-blur-sm rounded-none">
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-white/80 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Station Not Found</h2>
            <p className="text-white/60 mb-6">The station you're looking for doesn't exist.</p>
            <Button 
              onClick={() => navigate("/metro-list")} 
              className="bg-white text-black hover:bg-white/90 rounded-none"
              data-testid="button-back-list"
            >
              Back to Stations
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between py-6 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBack}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-wider">STATION DETAILS</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-2 border-white flex items-center justify-center">
            <Train className="h-8 w-8 text-white stroke-2" />
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-wider">
              {station.stationName}
            </h2>
            <p className="text-white/60 font-medium tracking-widest text-xs uppercase">
              Station Code: {station.stationCode}
            </p>
          </div>
        </div>

        {/* Station Info Card */}
        <Card className="bg-white/5 border border-white/10 rounded-none">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-none">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-white/80" />
                  <span className="text-xs text-white/60">City</span>
                </div>
                <p className="text-lg font-semibold text-white">{station.city}</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-none">
                <div className="flex items-center gap-2 mb-2">
                  <Train className="h-4 w-4 text-white/80" />
                  <span className="text-xs text-white/60">Metro Line</span>
                </div>
                <Badge className={`${getLineColor(station.metroLine)} border text-sm rounded-none`}>
                  {station.metroLine} Line
                </Badge>
              </div>
            </div>

            {/* Facilities */}
            {station.facilities && station.facilities.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wide">
                  Station Facilities
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {station.facilities.map((facility, idx) => (
                    <div
                      key={idx}
                      className="bg-white/5 border border-white/10 p-3 rounded-none flex items-center gap-2"
                    >
                      <div className="text-white/80">
                        {getFacilityIcon(facility)}
                      </div>
                      <span className="text-sm text-white">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <Button
              className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-none font-semibold"
              onClick={() => navigate("/metro-booking")}
              data-testid="button-book-ticket"
            >
              <Train className="h-5 w-5 mr-2" />
              Book Ticket from This Station
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
