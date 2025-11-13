import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import {
  ArrowLeft,
  Train,
  MapPin,
  Search,
  Loader2
} from "lucide-react";

interface MetroStation {
  id: string;
  stationName: string;
  stationCode: string;
  city: string;
  metroLine: string;
  facilities: string[];
}

export default function MetroList() {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLine, setSelectedLine] = useState("");

  const { data: stationsData, isLoading } = useQuery({
    queryKey: ["/api/metro/stations"],
  });

  const stations = ((stationsData as any)?.stations || []) as MetroStation[];
  const cities = Array.from(new Set(stations.map((s: MetroStation) => s.city))) as string[];
  const lines = Array.from(new Set(stations.map((s: MetroStation) => s.metroLine))) as string[];

  const filteredStations = stations.filter((station: MetroStation) => {
    const matchesSearch = searchQuery === "" || 
      station.stationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.stationCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "" || station.city === selectedCity;
    const matchesLine = selectedLine === "" || station.metroLine === selectedLine;
    return matchesSearch && matchesCity && matchesLine;
  });

  const pagination = usePagination({
    data: filteredStations,
    itemsPerPage: 15,
  });

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
            <p className="text-lg font-medium text-white">Loading stations...</p>
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
            onClick={() => navigate("/metro-booking")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-wider">METRO STATIONS</h1>
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
              ALL STATIONS
            </h2>
            <p className="text-white/60 font-medium tracking-widest text-xs uppercase">
              {filteredStations.length} stations available
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search station name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-white/40 pl-12 h-12 rounded-none"
              data-testid="input-search"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger 
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-12"
                data-testid="select-city"
              >
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20 rounded-none">
                <SelectItem value="" className="text-white hover:bg-white/10 focus:bg-white/10">All Cities</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city} className="text-white hover:bg-white/10 focus:bg-white/10">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLine} onValueChange={setSelectedLine}>
              <SelectTrigger 
                className="bg-white/5 border-white/20 text-white hover:bg-white/10 rounded-none h-12"
                data-testid="select-line"
              >
                <SelectValue placeholder="All Lines" />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20 rounded-none">
                <SelectItem value="" className="text-white hover:bg-white/10 focus:bg-white/10">All Lines</SelectItem>
                {lines.map((line) => (
                  <SelectItem key={line} value={line} className="text-white hover:bg-white/10 focus:bg-white/10">
                    {line} Line
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stations List */}
        {filteredStations.length > 0 ? (
          <div className="space-y-3">
            {pagination.paginatedData.map((station: MetroStation) => (
              <div
                key={station.id}
                className="bg-white/5 border border-white/10 p-4 hover:bg-white/10 transition-all duration-200 rounded-none cursor-pointer"
                onClick={() => navigate(`/metro-detail/${station.id}`)}
                data-testid={`station-card-${station.id}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 border border-white/60 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-base mb-1">
                        {station.stationName}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="border-white/40 text-white/80 text-xs rounded-none">
                          {station.stationCode}
                        </Badge>
                        <span className="text-xs text-white/60">{station.city}</span>
                      </div>
                      <Badge className={`${getLineColor(station.metroLine)} border text-xs rounded-none`}>
                        {station.metroLine} Line
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {station.facilities && station.facilities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {station.facilities.slice(0, 4).map((facility, idx) => (
                      <span key={idx} className="text-xs bg-white/5 border border-white/20 px-2 py-1 rounded-none text-white/70">
                        {facility}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Card className="bg-white/5 border border-white/10 rounded-none">
            <CardContent className="p-12 text-center">
              <Train className="h-16 w-16 mx-auto mb-4 text-white/30" />
              <p className="text-white/60 mb-2">No stations found</p>
              <p className="text-white/40 text-sm">Try adjusting your filters</p>
            </CardContent>
          </Card>
        )}

        {filteredStations.length > 0 && (
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.goToPage}
            canGoNext={pagination.canGoNext}
            canGoPrevious={pagination.canGoPrevious}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            totalItems={pagination.totalItems}
            className="mt-6"
          />
        )}
      </div>
    </div>
  );
}
