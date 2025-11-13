import { Button } from "@/components/ui/button";
import { ArrowLeft, Ticket } from "lucide-react";
import { useLocation } from "wouter";

interface TicketHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backPath?: string;
  ticketsPath?: string;
  ticketIcon?: React.ReactNode;
}

export function TicketHeader({ 
  title, 
  subtitle, 
  onBack, 
  backPath = "/pro-tools",
  ticketsPath = "/all-tickets",
  ticketIcon
}: TicketHeaderProps) {
  const [, navigate] = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(backPath);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center justify-between px-4 py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-base font-bold tracking-wider">{title}</h1>
          {subtitle && (
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">{subtitle}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(ticketsPath)}
          className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
          data-testid="button-tickets"
        >
          {ticketIcon || <Ticket className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}
