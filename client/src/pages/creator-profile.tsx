import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Creator, CreatorSession, CreatorReview, Booking } from "@shared/schema";
import { 
  ArrowLeft,
  Star,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle,
  Award,
  Globe,
  MessageCircle,
  Video,
  DollarSign,
  Users,
  BookOpen,
  Shield,
  Linkedin,
  Twitter,
  ExternalLink,
  ChevronRight,
  MapPin,
  Languages
} from "lucide-react";

interface CreatorProfileData extends Creator {
  sessions: CreatorSession[];
  reviews: CreatorReview[];
  availability: any[];
}

export default function CreatorProfile() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/creators/:id");
  const { toast } = useToast();
  
  const [selectedSession, setSelectedSession] = useState<CreatorSession | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [bookingNotes, setBookingNotes] = useState<string>("");
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  const creatorId = params?.id;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch creator profile with sessions, reviews, and availability
  const { data: creator, isLoading, error } = useQuery<CreatorProfileData>({
    queryKey: [`/api/creators/${creatorId}`],
    enabled: isAuthenticated && !!creatorId,
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      return apiRequest("POST", "/api/bookings", bookingData);
    },
    onSuccess: () => {
      toast({
        title: "Booking Confirmed",
        description: "Your session has been booked successfully!",
      });
      setShowBookingDialog(false);
      setSelectedSession(null);
      setSelectedDate(undefined);
      setSelectedTime("");
      setBookingNotes("");
      // Refresh creator data and redirect to creators
      queryClient.invalidateQueries({ queryKey: [`/api/creators/${creatorId}`] });
      navigate("/creators");
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book session. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  if (!match || !creatorId) {
    navigate("/creators");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="px-4 py-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-white mb-2">
              Creator not found
            </h3>
            <p className="text-white/60 mb-4">
              The creator you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/creators")} data-testid="button-back-to-creators">
              Back to Creators
            </Button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  const handleBookSession = (session: CreatorSession) => {
    setSelectedSession(session);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedSession || !selectedDate || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for your session.",
        variant: "destructive",
      });
      return;
    }

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledAt = new Date(selectedDate);
    scheduledAt.setHours(hours, minutes, 0, 0);

    const bookingData = {
      creatorId: creator.id,
      sessionId: selectedSession.id,
      scheduledAt: scheduledAt.toISOString(),
      notes: bookingNotes.trim() || undefined,
    };

    createBookingMutation.mutate(bookingData);
  };

  // Generate available time slots (9 AM - 6 PM)
  const timeSlots = Array.from({ length: 18 }, (_, i) => {
    const hour = Math.floor(9 + i / 2);
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, "0")}:${minute}`;
  });

  const averageRating = parseFloat(creator.averageRating || "0");
  const expertise = Array.isArray(creator.expertise) ? creator.expertise as string[] : [];
  const credentials = Array.isArray(creator.credentials) ? creator.credentials as string[] : [];
  const languages = Array.isArray(creator.languages) ? creator.languages as string[] : [];
  const socialLinks = creator.socialLinks as any || {};

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black/95 backdrop-blur-xl border-b border-white/10 fixed top-0 left-0 right-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/creators")}
              className="p-2"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-white">
              Creator Profile
            </h1>
          </div>
        </div>
      </div>

      {/* Creator Profile Content */}
      <div className="px-4 py-6">
        {/* Creator Header */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-6 mb-6 backdrop-blur-xl rounded-none">
          <div className="flex gap-4 mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={creator.profileImageUrl || undefined} />
              <AvatarFallback className="bg-white/5 dark:bg-red-900 text-red-600 dark:text-white/80 text-2xl font-bold">
                {creator.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {creator.displayName}
                </h1>
                {creator.isVerified === 1 && (
                  <CheckCircle className="h-6 w-6 text-white/80" />
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-white/80" />
                  <span className="font-semibold text-white">
                    {averageRating.toFixed(1)}
                  </span>
                  <span className="text-white/60">
                    ({creator.reviews?.length || 0} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Video className="h-5 w-5 text-white/60" />
                  <span className="text-white/60">
                    {creator.totalSessions || 0} sessions
                  </span>
                </div>
              </div>

              {creator.bio && typeof creator.bio === 'string' && (
                <p className="text-white/80 mb-4">
                  {creator.bio}
                </p>
              )}

              {/* Expertise Tags */}
              {expertise.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {expertise.map((exp, index) => (
                    <Badge 
                      key={index} 
                      className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-white/80 border-red-200 dark:border-red-800"
                    >
                      {exp}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Quick Info */}
              <div className="flex gap-4 text-sm text-white/60">
                {languages.length > 0 && (
                  <div className="flex items-center gap-1">
                    <Languages className="h-4 w-4" />
                    <span>{languages.slice(0, 2).join(", ")}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{creator.timezone || "Asia/Kolkata"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {(socialLinks.linkedin || socialLinks.twitter) && (
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {socialLinks.linkedin && (
                <Button variant="outline" size="sm" asChild>
                  <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4 mr-1" />
                    LinkedIn
                  </a>
                </Button>
              )}
              {socialLinks.twitter && (
                <Button variant="outline" size="sm" asChild>
                  <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4 mr-1" />
                    Twitter
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="sessions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-none p-1">
            <TabsTrigger value="sessions" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none">Sessions</TabsTrigger>
            <TabsTrigger value="credentials" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none">Credentials</TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-white data-[state=active]:text-black text-white/80 font-medium text-xs rounded-none">Reviews</TabsTrigger>
          </TabsList>

          {/* Sessions Tab */}
          <TabsContent value="sessions" className="space-y-4">
            {creator.sessions && creator.sessions.length > 0 ? (
              creator.sessions.map((session) => (
                <Card key={session.id} className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">
                          {session.title}
                        </h3>
                        {session.description && (
                          <p className="text-sm text-white/60 mb-2">
                            {session.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{session.duration} minutes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>₹{parseFloat(session.price).toLocaleString()}</span>
                          </div>
                          <Badge variant="secondary">{session.sessionType}</Badge>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleBookSession(session)}
                        className="bg-white/10 hover:bg-red-700 text-white"
                        data-testid={`button-book-${session.id}`}
                      >
                        Book Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-white/80 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No sessions available
                </h3>
                <p className="text-white/60">
                  This creator hasn't set up any sessions yet.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="space-y-4">
            {credentials.length > 0 ? (
              <div className="space-y-3">
                {credentials.map((credential, index) => (
                  <Card key={index} className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Award className="h-5 w-5 text-white/80" />
                        <span className="text-white">{credential}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-white/80 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No credentials listed
                </h3>
                <p className="text-white/60">
                  This creator hasn't added any credentials yet.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            {creator.reviews && creator.reviews.length > 0 ? (
              creator.reviews.map((review) => (
                <Card key={review.id} className="border border-gray-200 dark:border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-white/60">
                          U
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? "text-white/80 fill-current" 
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-white/60">
                            {new Date(review.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                        {review.review && (
                          <p className="text-white/80">
                            {review.review}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-white/80 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">
                  No reviews yet
                </h3>
                <p className="text-white/60">
                  Be the first to leave a review for this creator!
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book Session</DialogTitle>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <h4 className="font-medium text-white mb-1">
                  {selectedSession.title}
                </h4>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span>{selectedSession.duration} minutes</span>
                  <span>₹{parseFloat(selectedSession.price).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Select Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border border-gray-200 dark:border-gray-700 mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Select Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Choose a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Notes (Optional)</Label>
                <Textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Any specific questions or topics you'd like to discuss?"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowBookingDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleConfirmBooking}
                  disabled={createBookingMutation.isPending}
                  className="flex-1 bg-white/10 hover:bg-red-700 text-white"
                  data-testid="button-confirm-booking"
                >
                  {createBookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNavigation />
    </div>
  );
}