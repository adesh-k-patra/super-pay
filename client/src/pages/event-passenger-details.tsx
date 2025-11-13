import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const attendeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits")
});

type AttendeeForm = z.infer<typeof attendeeSchema>;

export default function EventPassengerDetails() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);
  const eventId = searchParams.get('eventId') || '';
  const date = searchParams.get('date') || '';
  const seatsParam = searchParams.get('seats') || '[]';
  const ticketsParam = searchParams.get('tickets') || '[]';
  
  const selectedSeats = JSON.parse(decodeURIComponent(seatsParam));
  const totalSeats = selectedSeats.length;
  
  const [currentTab, setCurrentTab] = useState("0");
  const [attendeesData, setAttendeesData] = useState<Record<number, AttendeeForm>>({});

  const form = useForm<AttendeeForm>({
    resolver: zodResolver(attendeeSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: ""
    }
  });

  const handleSaveAttendee = (index: number, data: AttendeeForm) => {
    setAttendeesData(prev => ({ ...prev, [index]: data }));
    toast({
      title: "Attendee Saved",
      description: `Details for Attendee ${index + 1} saved successfully`
    });
    
    if (index < totalSeats - 1) {
      setCurrentTab((index + 1).toString());
    }
  };

  const handleContinueToPayment = () => {
    const allFilled = Array.from({ length: totalSeats }, (_, i) => i).every(i => attendeesData[i]);
    
    if (!allFilled) {
      toast({
        title: "Incomplete Details",
        description: "Please fill details for all attendees",
        variant: "destructive"
      });
      return;
    }

    const attendees = Object.values(attendeesData);
    navigate(`/upi-payment?type=event&amount=15000&eventId=${eventId}&date=${date}&seats=${seatsParam}&attendees=${encodeURIComponent(JSON.stringify(attendees))}`);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/events/${eventId}/seats?date=${date}&tickets=${ticketsParam}`)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">ATTENDEE DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {totalSeats} Attendee{totalSeats !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Tabs for Each Attendee */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="w-full bg-white/5 border border-white/10 rounded-none overflow-x-auto flex">
            {Array.from({ length: totalSeats }, (_, i) => (
              <TabsTrigger
                key={i}
                value={i.toString()}
                className="flex-1 rounded-none data-[state=active]:bg-white data-[state=active]:text-black min-w-[100px]"
                data-testid={`tab-attendee-${i}`}
              >
                Attendee {i + 1}
              </TabsTrigger>
            ))}
          </TabsList>

          {Array.from({ length: totalSeats }, (_, index) => (
            <TabsContent key={index} value={index.toString()} className="mt-6">
              <Accordion type="single" collapsible defaultValue="personal">
                <AccordionItem value="personal" className="border-white/10">
                  <AccordionTrigger className="text-white hover:text-white/80">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Personal Information</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(data => handleSaveAttendee(index, data))}
                        className="space-y-4 pt-4"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter full name"
                                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-none"
                                  data-testid={`input-name-${index}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Enter email"
                                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-none"
                                  data-testid={`input-email-${index}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="tel"
                                  placeholder="Enter phone number"
                                  className="bg-white/5 border-white/20 text-white placeholder:text-white/40 rounded-none"
                                  data-testid={`input-phone-${index}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider"
                          data-testid={`button-save-${index}`}
                        >
                          {attendeesData[index] ? 'Update Details' : 'Save & Continue'}
                        </Button>
                      </form>
                    </Form>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>

        {/* Summary */}
        <div className="border-b border-white/10 pb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-white/60" />
            <span className="text-xs text-white/60 uppercase tracking-widest font-light">Summary</span>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-white/60">Attendees Completed</p>
              <p className="text-lg font-light">
                {Object.keys(attendeesData).length} / {totalSeats}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-lg border-t border-white/10 p-4 z-50">
        <div className="flex items-center justify-between max-w-screen-lg mx-auto">
          <div>
            <p className="text-white/60 text-sm font-light">
              {Object.keys(attendeesData).length} of {totalSeats} completed
            </p>
          </div>
          <Button
            onClick={handleContinueToPayment}
            disabled={Object.keys(attendeesData).length !== totalSeats}
            className="bg-white text-black hover:bg-white/90 h-12 px-8 rounded-none font-light tracking-wider disabled:opacity-50"
            data-testid="button-continue-payment"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </div>
  );
}
