import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowLeft, User, Mail, Phone, ChevronRight, Users, Ticket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Attendee info schema
const attendeeInfoSchema = z.object({
  title: z.enum(["Mr", "Ms", "Mrs", "Dr"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  age: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  idType: z.string().optional(),
  idNumber: z.string().optional(),
});

// Contact info schema
const contactInfoSchema = z.object({
  email: z.string().email("Valid email is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required"),
});

// Full booking form schema
const bookingFormSchema = z.object({
  attendees: z.array(attendeeInfoSchema).min(1, "At least one attendee is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required"),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function MoviePassengerDetails() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("movieId") || "";
  const showtimeId = params.get("showtimeId") || "";
  const theaterId = params.get("theaterId") || "";
  const seats = params.get("seats")?.split(",") || [];
  const seatDetailsParam = params.get("seatDetails") || "[]";
  const seatDetails = JSON.parse(decodeURIComponent(seatDetailsParam));
  const totalSeats = parseInt(params.get("totalSeats") || seats.length.toString());
  const totalAmount = parseFloat(params.get("totalAmount") || "0");

  // Initialize form with default values
  const defaultAttendees = Array.from({ length: totalSeats }, () => ({
    title: "Mr" as const,
    firstName: "",
    lastName: "",
    age: "",
    gender: "male" as const,
    idType: "",
    idNumber: "",
  }));

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      attendees: defaultAttendees,
      contactEmail: "",
      contactPhone: "",
    },
  });

  const onSubmit = (data: BookingFormData) => {
    // Navigate to payment page with all booking details
    const bookingData: Record<string, string> = {
      movieId,
      showtimeId,
      theaterId,
      seats: seats.join(","),
      seatDetails: encodeURIComponent(JSON.stringify(seatDetails)),
      attendees: JSON.stringify(data.attendees),
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      amount: totalAmount.toString(),
    };

    const queryParams = new URLSearchParams(bookingData);
    navigate(`/upi-payment?${queryParams.toString()}&type=movie`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getAttendeeLabel = (index: number) => {
    return `Attendee ${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/movies/${movieId}/seats?showtimeId=${showtimeId}&theaterId=${theaterId}`)}
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Seat Summary */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <h3 className="text-xs text-white/60 mb-3 uppercase tracking-widest font-light flex items-center gap-2">
                <Ticket className="h-3 w-3" />
                Selected Seats
              </h3>
              <div className="flex flex-wrap gap-2">
                {seats.map(seat => (
                  <div
                    key={seat}
                    className="px-3 py-2 bg-white text-black text-sm font-light tracking-wider"
                    data-testid={`text-seat-${seat}`}
                  >
                    {seat}
                  </div>
                ))}
              </div>
            </div>

            {/* Attendee Forms */}
            <div className="space-y-4">
              <h2 className="text-sm font-light text-white tracking-wider uppercase flex items-center gap-2">
                <Users className="h-4 w-4" />
                Attendee Information
              </h2>

              <Accordion type="multiple" defaultValue={["attendee-0"]} className="space-y-4">
                {defaultAttendees.map((_, index) => (
                  <AccordionItem
                    key={index}
                    value={`attendee-${index}`}
                    className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline" data-testid={`accordion-attendee-${index}`}>
                      <div className="flex items-center gap-3 text-left">
                        <User className="h-5 w-5 text-white/60" />
                        <div>
                          <p className="text-base font-light text-white tracking-wider">{getAttendeeLabel(index)}</p>
                          <p className="text-xs text-white/50">
                            {form.watch(`attendees.${index}.firstName`) && form.watch(`attendees.${index}.lastName`)
                              ? `${form.watch(`attendees.${index}.firstName`)} ${form.watch(`attendees.${index}.lastName`)}`
                              : "Tap to add details"}
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        {/* Title */}
                        <FormField
                          control={form.control}
                          name={`attendees.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">Title</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger 
                                    className="bg-transparent border-white/20 text-white rounded-none"
                                    data-testid={`select-title-${index}`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Mr">Mr</SelectItem>
                                  <SelectItem value="Ms">Ms</SelectItem>
                                  <SelectItem value="Mrs">Mrs</SelectItem>
                                  <SelectItem value="Dr">Dr</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        {/* First Name */}
                        <FormField
                          control={form.control}
                          name={`attendees.${index}.firstName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">First Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="As per ID"
                                  className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                                  data-testid={`input-firstname-${index}`}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        {/* Last Name */}
                        <FormField
                          control={form.control}
                          name={`attendees.${index}.lastName`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="As per ID"
                                  className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                                  data-testid={`input-lastname-${index}`}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        {/* Age */}
                        <FormField
                          control={form.control}
                          name={`attendees.${index}.age`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">Age (Optional)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="Enter age"
                                  className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                                  data-testid={`input-age-${index}`}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        {/* Gender */}
                        <FormField
                          control={form.control}
                          name={`attendees.${index}.gender`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">Gender (Optional)</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger 
                                    className="bg-transparent border-white/20 text-white rounded-none"
                                    data-testid={`select-gender-${index}`}
                                  >
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contact Information */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 space-y-4">
              <h3 className="text-sm font-light text-white tracking-wider uppercase flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="your@email.com"
                          className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">Mobile Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="10-digit mobile"
                          className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                          data-testid="input-phone"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Total Summary */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-white/60">Total Tickets</p>
                <p className="text-base font-light text-white">{totalSeats}</p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <p className="text-base text-white/60">Total Amount</p>
                <p className="text-2xl font-light text-white">{formatCurrency(totalAmount)}</p>
              </div>
            </div>

            {/* Fixed Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent backdrop-blur-lg border-t border-white/10 p-4 z-50">
              <div className="max-w-screen-lg mx-auto">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-white/60">{totalSeats} Ticket{totalSeats !== 1 ? 's' : ''}</p>
                    <p className="text-sm text-white font-light">{formatCurrency(totalAmount)}</p>
                  </div>
                  <Button
                    type="submit"
                    className="bg-white text-black hover:bg-white/90 h-12 px-8 rounded-none"
                    data-testid="button-proceed-payment"
                  >
                    Proceed to Payment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
