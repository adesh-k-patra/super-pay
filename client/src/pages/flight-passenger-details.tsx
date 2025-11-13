import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { DatePicker } from "@/components/ui/date-picker";
import { ArrowLeft, User, Mail, Phone, CreditCard, Users, UserCircle, GraduationCap, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { passengerInfoSchema } from "@shared/schema";

// Contact info schema
const contactInfoSchema = z.object({
  email: z.string().email("Valid email is required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required"),
});

// User type schema with conditional fields
const userTypeSchema = z.object({
  userType: z.enum(["general", "student", "business"]).default("general"),
  collegeId: z.string().optional(),
  collegeName: z.string().optional(),
  businessEmail: z.string().email().optional().or(z.literal("")),
  businessIdCard: z.string().optional(),
  businessGstNo: z.string().optional(),
});

// Full booking form schema
const bookingFormSchema = z.object({
  passengers: z.array(passengerInfoSchema).min(1, "At least one passenger is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit mobile number required"),
  userTypeInfo: userTypeSchema,
  gstDetails: z.object({
    companyName: z.string().optional(),
    gstNumber: z.string().optional(),
    companyAddress: z.string().optional(),
  }).optional(),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function FlightPassengerDetails() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const params = new URLSearchParams(window.location.search);
  const flightId = params.get("flightId") || "1";
  const seats = params.get("seats")?.split(",") || [];
  const totalPrice = parseFloat(params.get("totalPrice") || "0");
  const adults = parseInt(params.get("adults") || seats.length.toString());
  const children = parseInt(params.get("children") || "0");
  const infants = parseInt(params.get("infants") || "0");
  const totalPassengers = adults + children + infants || seats.length;

  const [addGst, setAddGst] = useState(false);

  // Initialize form with default values
  const defaultPassengers = Array.from({ length: totalPassengers }, (_, index) => ({
    title: "Mr" as const,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male" as const,
    nationality: "Indian",
    idType: undefined,
    idNumber: "",
    mealPreference: "",
    specialAssistance: "",
    isInfant: index >= adults + children,
  }));

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      passengers: defaultPassengers,
      contactEmail: "",
      contactPhone: "",
      userTypeInfo: {
        userType: "general",
        collegeId: "",
        collegeName: "",
        businessEmail: "",
        businessIdCard: "",
        businessGstNo: "",
      },
      gstDetails: {
        companyName: "",
        gstNumber: "",
        companyAddress: "",
      },
    },
  });

  const onSubmit = (data: BookingFormData) => {
    // Navigate to payment page with all booking details
    const bookingData: Record<string, string> = {
      flightId,
      seats: seats.join(","),
      passengers: JSON.stringify(data.passengers),
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
      userTypeInfo: JSON.stringify(data.userTypeInfo),
      amount: totalPrice.toString(), // Fixed: changed from totalAmount to amount
    };

    if (addGst && data.gstDetails) {
      bookingData.gstDetails = JSON.stringify(data.gstDetails);
    }

    const queryParams = new URLSearchParams(bookingData);
    navigate(`/upi-payment?${queryParams.toString()}&type=flight`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPassengerLabel = (index: number) => {
    if (index < adults) return `Adult ${index + 1}`;
    if (index < adults + children) return `Child ${index - adults + 1}`;
    return `Infant ${index - adults - children + 1}`;
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/flights/seat-selection?flightId=${flightId}`)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">PASSENGER DETAILS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">
              {totalPassengers} Traveler{totalPassengers !== 1 ? 's' : ''}
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
              <h3 className="text-xs text-white/60 mb-3 uppercase tracking-widest font-light">Selected Seats</h3>
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

            {/* Passenger Forms */}
            <div className="space-y-4">
              <h2 className="text-sm font-light text-white tracking-wider uppercase flex items-center gap-2">
                <Users className="h-4 w-4" />
                Traveler Information
              </h2>

              <Accordion type="multiple" defaultValue={["passenger-0"]} className="space-y-4">
                {defaultPassengers.map((_, index) => (
                  <AccordionItem
                    key={index}
                    value={`passenger-${index}`}
                    className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline" data-testid={`accordion-passenger-${index}`}>
                      <div className="flex items-center gap-3 text-left">
                        <User className="h-5 w-5 text-white/60" />
                        <div>
                          <p className="text-base font-light text-white tracking-wider">{getPassengerLabel(index)}</p>
                          <p className="text-xs text-white/50">
                            {form.watch(`passengers.${index}.firstName`) && form.watch(`passengers.${index}.lastName`)
                              ? `${form.watch(`passengers.${index}.firstName`)} ${form.watch(`passengers.${index}.lastName`)}`
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
                          name={`passengers.${index}.title`}
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
                          name={`passengers.${index}.firstName`}
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
                          name={`passengers.${index}.lastName`}
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

                        {/* Date of Birth */}
                        <FormField
                          control={form.control}
                          name={`passengers.${index}.dateOfBirth`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">Date of Birth (Optional)</FormLabel>
                              <FormControl>
                                <DatePicker
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="Select date of birth"
                                  className="bg-transparent border-white/20 text-white"
                                  data-testid={`input-dob-${index}`}
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        {/* Gender */}
                        <FormField
                          control={form.control}
                          name={`passengers.${index}.gender`}
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

                        {/* Nationality */}
                        <FormField
                          control={form.control}
                          name={`passengers.${index}.nationality`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">Nationality</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Indian"
                                  className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                                  data-testid={`input-nationality-${index}`}
                                />
                              </FormControl>
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

            {/* User Type Selection */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 space-y-4">
              <h3 className="text-sm font-light text-white tracking-wider uppercase flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Traveler Type
              </h3>

              <FormField
                control={form.control}
                name="userTypeInfo.userType"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: "general", label: "General", icon: UserCircle },
                          { value: "student", label: "Student", icon: GraduationCap },
                          { value: "business", label: "Business", icon: Briefcase }
                        ].map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => field.onChange(type.value)}
                            className={cn(
                              "flex flex-col items-center gap-2 py-4 border transition-all font-light tracking-wider rounded-none",
                              field.value === type.value
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-white/60 border-white/20 hover:border-white/40"
                            )}
                            data-testid={`button-usertype-${type.value}`}
                          >
                            <type.icon className="h-6 w-6" />
                            <span className="text-xs">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Student Fields */}
              {form.watch("userTypeInfo.userType") === "student" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                  <FormField
                    control={form.control}
                    name="userTypeInfo.collegeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">College Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter college name"
                            className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                            data-testid="input-college-name"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userTypeInfo.collegeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">College ID</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter college ID"
                            className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                            data-testid="input-college-id"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Business Fields */}
              {form.watch("userTypeInfo.userType") === "business" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                  <FormField
                    control={form.control}
                    name="userTypeInfo.businessEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">Business Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="business@company.com"
                            className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                            data-testid="input-business-email"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userTypeInfo.businessIdCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">ID Card Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter ID card number"
                            className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                            data-testid="input-business-id"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="userTypeInfo.businessGstNo"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">GST Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="22AAAAA0000A1Z5"
                            className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                            data-testid="input-business-gst"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 space-y-4">
              <h3 className="text-sm font-light text-white tracking-wider uppercase flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          data-testid="input-contact-email"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

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
                          placeholder="9876543210"
                          maxLength={10}
                          className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                          data-testid="input-contact-phone"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              <p className="text-xs text-white/40 pt-2">
                Your booking confirmation and e-ticket will be sent to this email and phone number
              </p>
            </div>

            {/* GST Details (Optional) */}
            <div className="border border-white/20 bg-white/5 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-light text-white tracking-wider uppercase flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  GST Details (Optional)
                </h3>
                <button
                  type="button"
                  onClick={() => setAddGst(!addGst)}
                  className="text-xs text-white/60 hover:text-white transition-colors uppercase tracking-widest"
                  data-testid="button-toggle-gst"
                >
                  {addGst ? "Remove" : "Add"}
                </button>
              </div>

              {addGst && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gstDetails.companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">Company Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Your Company Ltd."
                            className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                            data-testid="input-gst-company"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gstDetails.gstNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">GST Number</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="22AAAAA0000A1Z5"
                            className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                            data-testid="input-gst-number"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gstDetails.companyAddress"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-xs text-white/60 uppercase tracking-widest font-light">Company Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Full company address"
                            className="bg-transparent border-white/20 text-white rounded-none placeholder:text-white/40"
                            data-testid="input-gst-address"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div className="border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6">
              <h3 className="text-sm font-light text-white mb-4 tracking-wider uppercase">Fare Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-white/80">
                  <span className="text-sm font-light">Base Fare ({totalPassengers} traveler{totalPassengers !== 1 ? 's' : ''})</span>
                  <span className="font-light" data-testid="text-base-fare">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-white/80">
                  <span className="text-sm font-light">Taxes & Fees</span>
                  <span className="font-light" data-testid="text-taxes">Included</span>
                </div>
                <div className="h-px bg-white/10 my-3"></div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-light text-white">Total Amount</span>
                  <span className="text-2xl font-light text-white" data-testid="text-total-amount">{formatCurrency(totalPrice)}</span>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider disabled:opacity-50"
          data-testid="button-proceed-payment"
        >
          PROCEED TO PAYMENT • {formatCurrency(totalPrice)}
        </Button>
      </div>
    </div>
  );
}
