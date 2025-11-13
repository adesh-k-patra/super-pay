import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle,
  Calendar,
  Target,
  Award,
  Zap,
  Clock,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface TimelineEvent {
  id: string;
  date: string;
  month: string;
  year: string;
  type: "credit_score" | "loan" | "payment" | "milestone";
  title: string;
  description: string;
  impact: "positive" | "negative" | "neutral";
  value?: number;
  change?: number;
  details: {
    reason: string;
    category: string;
    actionTaken?: string;
    result?: string;
  };
}

interface TimelineRoadmapProps {
  events: TimelineEvent[];
  currentScore: number;
}

export function TimelineRoadmap({ events, currentScore }: TimelineRoadmapProps) {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  // Group events by year and month
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.year]) acc[event.year] = {};
    if (!acc[event.year][event.month]) acc[event.year][event.month] = [];
    acc[event.year][event.month].push(event);
    return acc;
  }, {} as Record<string, Record<string, TimelineEvent[]>>);

  const years = Object.keys(groupedEvents).sort((a, b) => b.localeCompare(a));
  const currentYearData = groupedEvents[selectedYear] || {};
  const months = Object.keys(currentYearData).sort((a, b) => {
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthOrder.indexOf(b) - monthOrder.indexOf(a);
  });

  const getEventIcon = (event: TimelineEvent) => {
    switch (event.type) {
      case "credit_score":
        return event.impact === "positive" ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />;
      case "loan":
        return <DollarSign className="h-5 w-5" />;
      case "payment":
        return event.impact === "positive" ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />;
      case "milestone":
        return <Award className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getEventColor = (event: TimelineEvent) => {
    if (event.type === "credit_score") {
      return event.impact === "positive" ? "bg-green-500" : "bg-red-500";
    }
    if (event.type === "loan") return "bg-blue-500";
    if (event.type === "payment") {
      return event.impact === "positive" ? "bg-green-500" : "bg-red-500";
    }
    return "bg-purple-500";
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  return (
    <div className="w-full" data-testid="timeline-roadmap">
      {/* Year Selector */}
      <div className="flex justify-center mb-8">
        <div className="flex gap-2 p-2 bg-gray-100 rounded-lg">
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedYear(year)}
              className={selectedYear === year ? "bg-red-500 text-white" : ""}
              data-testid={`year-tab-${year}`}
            >
              {year}
            </Button>
          ))}
        </div>
      </div>

      {/* Current Score Display */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{currentScore}</div>
            <div className="text-sm text-gray-600">Current Score</div>
          </div>
          <div className="w-px h-12 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">+30</div>
            <div className="text-sm text-gray-600">This Year</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Navigation */}
        <div className="lg:col-span-1">
          <h4 className="font-bold text-gray-800 mb-4">{selectedYear} Timeline</h4>
          <div className="space-y-2">
            {months.map((month) => {
              const monthEvents = currentYearData[month];
              const hasImportantEvents = monthEvents.some(e => e.type === "credit_score" || e.type === "milestone");
              
              return (
                <div
                  key={month}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    hasImportantEvents 
                      ? "bg-red-50 border-red-200 hover:bg-red-100" 
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  data-testid={`month-tab-${month}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{month} {selectedYear}</span>
                    <div className="flex items-center gap-1">
                      {monthEvents.slice(0, 3).map((event, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full ${getEventColor(event)}`}
                        ></div>
                      ))}
                      {monthEvents.length > 3 && (
                        <span className="text-xs text-gray-500 ml-1">+{monthEvents.length - 3}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Roadmap */}
        <div className="lg:col-span-2">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-amber-500 to-orange-600"></div>

            {/* Timeline Events */}
            <div className="space-y-8">
              {months.map((month) => {
                const monthEvents = currentYearData[month];
                
                return (
                  <div key={month} className="relative">
                    {/* Month Marker */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-white border-4 border-orange-500 rounded-full flex items-center justify-center shadow-lg z-10">
                        <Calendar className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <h5 className="font-bold text-lg text-gray-800">{month} {selectedYear}</h5>
                        <p className="text-sm text-gray-600">{monthEvents.length} events</p>
                      </div>
                    </div>

                    {/* Month Events */}
                    <div className="ml-20 space-y-4">
                      {monthEvents.map((event) => (
                        <div
                          key={event.id}
                          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                          onClick={() => setSelectedEvent(event)}
                          data-testid={`event-${event.id}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-lg text-white ${getEventColor(event)}`}>
                              {getEventIcon(event)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h6 className="font-semibold text-gray-800">{event.title}</h6>
                                {event.change && (
                                  <div className="flex items-center gap-1">
                                    {getChangeIndicator(event.change)}
                                    <span className={`text-sm font-medium ${
                                      event.change > 0 ? "text-green-600" : "text-red-600"
                                    }`}>
                                      {event.change > 0 ? "+" : ""}{event.change}
                                    </span>
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                              
                              <div className="flex items-center justify-between">
                                <Badge 
                                  className={
                                    event.impact === "positive" ? "bg-green-100 text-green-800" :
                                    event.impact === "negative" ? "bg-red-100 text-red-800" :
                                    "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {event.details.category}
                                </Badge>
                                
                                <span className="text-xs text-gray-500">
                                  {new Date(event.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-testid="event-detail-modal"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-lg text-white ${getEventColor(selectedEvent)}`}>
                {getEventIcon(selectedEvent)}
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">{selectedEvent.title}</h3>
                <p className="text-sm text-gray-600">{new Date(selectedEvent.date).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Details</h4>
                <p className="text-sm text-gray-600">{selectedEvent.description}</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Reason</h4>
                <p className="text-sm text-gray-600">{selectedEvent.details.reason}</p>
              </div>
              
              {selectedEvent.details.actionTaken && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Action Taken</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.details.actionTaken}</p>
                </div>
              )}
              
              {selectedEvent.details.result && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Result</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.details.result}</p>
                </div>
              )}
              
              {selectedEvent.change && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Score Impact</span>
                    <div className="flex items-center gap-1">
                      {getChangeIndicator(selectedEvent.change)}
                      <span className={`font-bold ${
                        selectedEvent.change > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {selectedEvent.change > 0 ? "+" : ""}{selectedEvent.change} points
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => setSelectedEvent(null)}
              className="w-full mt-6"
              data-testid="button-close-event-detail"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}