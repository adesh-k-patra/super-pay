import { ArrowLeft, Check, Users, Shield, Zap, Calendar, Clock, AlertTriangle, Video, MapPin, FileText, Star, CreditCard, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function ConsultantInfo() {
  const [, navigate] = useLocation();

  const features = [
    { 
      icon: Users, 
      title: "VERIFIED PROFESSIONALS", 
      desc: "Book trusted experts across healthcare, legal, home services, fitness, and more. All professionals are verified.",
      highlight: "100% verified"
    },
    { 
      icon: Calendar, 
      title: "FLEXIBLE SCHEDULING", 
      desc: "Choose your preferred date and time. View real-time availability and book instantly.",
      highlight: "Instant booking"
    },
    { 
      icon: Video, 
      title: "VIRTUAL & IN-PERSON", 
      desc: "Meet consultants online via video call or book in-person sessions at their location.",
      highlight: "Both options"
    },
    { 
      icon: FileText, 
      title: "SESSION NOTES", 
      desc: "Get detailed notes, recommendations, and follow-up instructions after every consultation.",
      highlight: "Full documentation"
    },
    { 
      icon: Star, 
      title: "RATINGS & REVIEWS", 
      desc: "Read verified reviews from real clients. Rate and review your experience to help others.",
      highlight: "Transparent feedback"
    },
    { 
      icon: CreditCard, 
      title: "SECURE PAYMENTS", 
      desc: "Pay safely through our platform. Get instant booking confirmation and digital receipts.",
      highlight: "Protected payments"
    },
  ];

  const steps = [
    { step: "1", title: "Browse Experts", desc: "Find professionals by category and specialty" },
    { step: "2", title: "Select Service", desc: "Choose virtual or in-person consultation" },
    { step: "3", title: "Pick Time Slot", desc: "Book your preferred date and time" },
    { step: "4", title: "Get Confirmed", desc: "Receive booking details and join your session!" }
  ];

  const terms = [
    { label: "Booking Fee", desc: "Transparent pricing shown before booking", value: "No hidden fees" },
    { label: "Cancellation", desc: "Cancel up to 24 hours before appointment", value: "Free cancellation" },
    { label: "Session Duration", desc: "Standard consultation time per booking", value: "30-60 minutes" },
    { label: "Rescheduling", desc: "Change appointment time subject to availability", value: "Anytime" },
    { label: "Payment Methods", desc: "UPI, cards, net banking, and wallets accepted", value: "All methods" },
    { label: "Privacy", desc: "Your personal and session data is encrypted", value: "Bank-grade" },
  ];

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/consultant/explore")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">BOOKSURE</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Information & Features</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 max-w-4xl mx-auto">
        <div className="border border-white/20 p-5 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
          <div className="text-center space-y-3">
            <h2 className="text-xl font-medium tracking-wider uppercase" data-testid="text-page-title">
              BOOKSURE
            </h2>
            <p className="text-base text-white/70 max-w-2xl mx-auto font-light" data-testid="text-subtitle">
              Book Verified Experts. Anytime. Anywhere.
            </p>
            <p className="text-sm text-white/60 leading-relaxed font-light max-w-3xl mx-auto">
              <span className="font-medium text-white">BOOKSURE</span> connects you with verified professionals across healthcare, legal services, home repairs, fitness, and more. Book consultations online or in-person with trusted experts in minutes.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Key Features
          </label>
          <div className="space-y-0">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="w-full p-4 border-b border-white/10 hover:border-white/30 transition-all"
                  data-testid={`feature-${idx}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-white/10 border border-white/20 rounded-none p-2.5 flex-shrink-0">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <h4 className="text-sm font-medium uppercase tracking-wider text-white">{feature.title}</h4>
                        <Badge className="rounded-none border bg-white/10 text-white/60 border-white/20 font-light text-[10px] px-2 py-0.5">
                          {feature.highlight}
                        </Badge>
                      </div>
                      <p className="text-white/60 text-xs font-light leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Get Started in 4 Simple Steps
          </label>
          <p className="text-white/50 text-[11px] font-light">Book your first consultation in under 3 minutes</p>
          <div className="grid grid-cols-2 gap-3">
            {steps.map((item, idx) => (
              <div key={idx} className="border border-white/10 p-3" data-testid={`step-${item.step}`}>
                <div className="space-y-2">
                  <div className="w-8 h-8 border border-white/30 bg-white/5 flex items-center justify-center text-sm font-light">
                    {item.step}
                  </div>
                  <h4 className="text-xs font-medium uppercase tracking-wider text-white">{item.title}</h4>
                  <p className="text-white/60 text-[11px] font-light leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Terms & Conditions
          </label>
          <div className="space-y-0">
            {terms.map((term, idx) => (
              <div
                key={idx}
                className="w-full p-3 border-b border-white/10 hover:border-white/30 transition-all"
                data-testid={`term-${idx}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium tracking-wider text-xs text-white">{term.label}</h4>
                  <Badge className="rounded-none border bg-white/20 text-white border-white/30 font-light text-[10px] px-2 py-0.5">
                    {term.value}
                  </Badge>
                </div>
                <p className="text-[11px] text-white/50 font-light leading-relaxed">{term.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-white/60 text-xs uppercase tracking-widest font-light flex items-center gap-2">
            <Check className="h-4 w-4" />
            Why Choose BOOKSURE
          </label>
          <div className="border border-white/20 p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: "Verified Experts", desc: "All professionals are background-checked" },
                { title: "Save Time", desc: "No phone calls or waiting for appointments" },
                { title: "Stay Safe", desc: "Video consultations from home comfort" },
                { title: "Transparent Pricing", desc: "Clear fees with no hidden charges" },
                { title: "Quality Assured", desc: "Only highly-rated professionals on platform" },
                { title: "24/7 Support", desc: "Get help anytime with our support team" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-white mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h5 className="font-medium uppercase tracking-wider text-xs text-white">{item.title}</h5>
                    <p className="text-white/60 text-[11px] font-light mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border border-white/20 p-4 bg-white/5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="bg-white/10 border border-white/20 rounded-none p-2 flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-medium text-white tracking-wider uppercase">Important Notice</h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                BOOKSURE is a platform connecting users with independent verified professionals. While we verify credentials, users are responsible for their own decisions. In case of medical emergencies, please contact emergency services immediately. Session recordings and data are handled per our privacy policy.
              </p>
              <p className="text-[11px] text-white/50 font-light">
                For queries, contact support at <span className="text-white">support@instapay.com</span> or call <span className="text-white">1800-XXX-XXXX</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4">
        <Button
          onClick={() => navigate("/consultant/explore")}
          className="w-full max-w-4xl mx-auto bg-white hover:bg-white/90 text-black rounded-none h-12 text-sm font-light tracking-wider"
          data-testid="button-get-started"
        >
          START BOOKING
        </Button>
      </div>
    </div>
  );
}
