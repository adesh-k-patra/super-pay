import { memo, useMemo, useCallback } from "react";
import { LoanApplication } from "@shared/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Car, 
  Building, 
  CreditCard, 
  FileText,
  Clock,
  CheckCircle,
  AlertCircle 
} from "lucide-react";

interface LoanCardProps {
  loan: LoanApplication;
  onPayEmi?: () => void;
  onViewDetails?: () => void;
  className?: string;
}

const loanIcons = {
  personal: Home,
  vehicle: Car,
  home: Building,
};

const statusConfig = {
  active: {
    variant: "green" as const,
    bgClass: "glassmorphic-green",
    textClass: "text-green-600",
    icon: CheckCircle,
    label: "Active",
    description: "Loan is active"
  },
  pending: {
    variant: "yellow" as const,
    bgClass: "glassmorphic-yellow",
    textClass: "text-yellow-700",
    icon: Clock,
    label: "Pending",
    description: "Under review"
  },
  approved: {
    variant: "blue" as const,
    bgClass: "glassmorphic-blue",
    textClass: "text-blue-600",
    icon: CheckCircle,
    label: "Approved",
    description: "Application approved"
  },
  rejected: {
    variant: "red" as const,
    bgClass: "glassmorphic-red",
    textClass: "text-red-600",
    icon: AlertCircle,
    label: "Rejected",
    description: "Application rejected"
  },
  completed: {
    variant: "purple" as const,
    bgClass: "glassmorphic-purple",
    textClass: "text-purple-600",
    icon: CheckCircle,
    label: "Completed",
    description: "Loan completed"
  },
};

const LoanCard = memo(function LoanCard({ loan, onPayEmi, onViewDetails, className }: LoanCardProps) {
  // Memoize computed values to prevent recalculation on every render
  const { Icon, statusInfo, StatusIcon, progressData, cardStyle } = useMemo(() => {
    const Icon = loanIcons[loan.loanType as keyof typeof loanIcons] || Home;
    const statusInfo = statusConfig[loan.status as keyof typeof statusConfig];
    const StatusIcon = statusInfo?.icon || Clock;
    
    const totalPaid = parseFloat(loan.totalPaid || "0");
    const totalAmount = parseFloat(loan.amount);
    const progressPercentage = totalAmount > 0 ? (totalPaid / totalAmount) * 100 : 0;
    
    const cardStyle = loan.status === 'active' 
      ? `linear-gradient(135deg, hsl(var(--green-500) / 0.15) 0%, hsl(var(--background) / 0.05) 100%)`
      : loan.status === 'pending'
      ? `linear-gradient(135deg, hsl(var(--yellow-500) / 0.15) 0%, hsl(var(--background) / 0.05) 100%)`
      : loan.status === 'completed'
      ? `linear-gradient(135deg, hsl(var(--purple-500) / 0.15) 0%, hsl(var(--background) / 0.05) 100%)`
      : loan.status === 'rejected'
      ? `linear-gradient(135deg, hsl(var(--red-500) / 0.15) 0%, hsl(var(--background) / 0.05) 100%)`
      : `linear-gradient(135deg, hsl(var(--blue-500) / 0.15) 0%, hsl(var(--background) / 0.05) 100%)`;
    
    return {
      Icon,
      statusInfo,
      StatusIcon,
      progressData: { totalPaid, totalAmount, progressPercentage },
      cardStyle
    };
  }, [loan.loanType, loan.status, loan.totalPaid, loan.amount]);

  // Memoize formatter function to prevent recreation
  const formatCurrency = useCallback((amount: string | number) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(num);
  }, []);

  const getLoanTypeLabel = useCallback((type: string) => {
    switch (type) {
      case 'personal': return 'Personal';
      case 'vehicle': return 'Vehicle';
      case 'home': return 'Home';
      default: return `${type.charAt(0).toUpperCase() + type.slice(1)} Loan`;
    }
  }, []);

  return (
    <div 
      className={cn(
        "rounded-none p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300",
        statusInfo ? statusInfo.bgClass : "glassmorphic",
        "backdrop-blur-xl border border-white/30",
        className
      )}
      data-testid={`loan-card-${loan.id}`}
      style={{ background: cardStyle }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-none flex items-center justify-center border-2 shadow-lg"
            style={{
              background: loan.status === 'active' 
                ? `linear-gradient(135deg, hsl(var(--green-500)) 0%, hsl(var(--green-600)) 100%)`
                : loan.status === 'pending'
                ? `linear-gradient(135deg, hsl(var(--yellow-500)) 0%, hsl(var(--red-500)) 100%)`
                : loan.status === 'completed'
                ? `linear-gradient(135deg, hsl(var(--purple-500)) 0%, hsl(var(--purple-600)) 100%)`
                : loan.status === 'rejected'
                ? `linear-gradient(135deg, hsl(var(--red-500)) 0%, hsl(var(--red-600)) 100%)`
                : `linear-gradient(135deg, hsl(var(--blue-500)) 0%, hsl(var(--blue-600)) 100%)`,
              borderColor: loan.status === 'active' ? 'hsl(var(--green-400))' : 
                          loan.status === 'pending' ? 'hsl(var(--yellow-400))' :
                          loan.status === 'completed' ? 'hsl(var(--purple-400))' :
                          loan.status === 'rejected' ? 'hsl(var(--red-400))' : 'hsl(var(--blue-400))'
            }}
          >
            <Icon className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-800 text-lg mb-1" data-testid="loan-type">
              {getLoanTypeLabel(loan.loanType)}
            </p>
            <p className="text-gray-600 text-sm font-medium" data-testid="application-number">
              Application Number: {loan.applicationNumber || `#${loan.id.slice(-6).toUpperCase()}`}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-none text-xs font-bold"
            style={{
              background: statusInfo ? 
                loan.status === 'active' ? 'hsl(var(--green-100))' :
                loan.status === 'pending' ? 'hsl(var(--yellow-100))' :
                loan.status === 'completed' ? 'hsl(var(--purple-100))' :
                loan.status === 'rejected' ? 'hsl(var(--red-100))' :
                'hsl(var(--blue-100))' : 'hsl(var(--gray-100))',
              color: statusInfo ? 
                (loan.status === 'active' ? 'hsl(var(--green-700))' :
                loan.status === 'pending' ? 'hsl(var(--yellow-700))' :
                loan.status === 'completed' ? 'hsl(var(--purple-700))' :
                loan.status === 'rejected' ? 'hsl(var(--red-700))' :
                'hsl(var(--blue-700))') : 'hsl(var(--gray-700))'
            }}
            data-testid="loan-status"
          >
            <StatusIcon className="h-3 w-3" />
            <span>{statusInfo?.label || loan.status}</span>
          </div>
          <p className="text-gray-600 text-xs mt-1">{statusInfo?.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glassmorphic-card-secondary p-4 rounded-none">
          <p className="text-gray-600 text-xs font-medium mb-1">Loan Amount</p>
          <p className="font-bold text-gray-800 text-xl" data-testid="loan-amount">
            {formatCurrency(loan.amount)}
          </p>
        </div>
        {loan.status === "active" && (
          <div className="glassmorphic-card-secondary p-4 rounded-none">
            <p className="text-gray-600 text-xs font-medium mb-1">Monthly EMI</p>
            <p className="font-bold text-gray-800 text-xl" data-testid="monthly-emi">
              {formatCurrency(loan.emi)}
            </p>
          </div>
        )}
        {loan.status === "pending" && (
          <div className="glassmorphic-card-secondary p-4 rounded-none">
            <p className="text-gray-600 text-xs font-medium mb-1">Applied On</p>
            <p className="font-bold text-gray-800 text-lg" data-testid="applied-date">
              {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              }) : '—'}
            </p>
          </div>
        )}
      </div>

      {loan.status === "active" && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glassmorphic-card-secondary p-4 rounded-none">
              <p className="text-gray-600 text-xs font-medium mb-1">Interest Rate</p>
              <p className="font-bold text-gray-800 text-lg" data-testid="interest-rate">
                {loan.interestRate}% Annual
              </p>
            </div>
            <div className="glassmorphic-card-secondary p-4 rounded-none">
              <p className="text-gray-600 text-xs font-medium mb-1">Tenure</p>
              <p className="font-bold text-gray-800 text-lg" data-testid="tenure">
                {loan.tenure} Months
              </p>
            </div>
          </div>

          <div className="glassmorphic-card-secondary p-4 rounded-none mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700 text-sm font-medium">Payment Progress</span>
              <span className="text-gray-600 text-xs font-bold">{progressData.progressPercentage.toFixed(1)}%</span>
            </div>
            <div 
              className="progress-bar rounded-none mb-3" 
              style={{ "--progress": `${progressData.progressPercentage}%` } as React.CSSProperties}
              data-testid="loan-progress"
            />
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-medium" data-testid="amount-paid">
                Paid: {formatCurrency(progressData.totalPaid)}
              </span>
              <span className="text-orange-600 font-medium" data-testid="amount-remaining">
                Outstanding: {formatCurrency(loan.outstandingAmount || "0")}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onPayEmi}
              className="flex-1 py-4 rounded-none font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, hsl(var(--green-500)) 0%, hsl(var(--green-600)) 100%)`,
                color: 'white',
                boxShadow: '0 8px 25px -8px hsl(var(--green-500) / 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, hsl(var(--green-600)) 0%, hsl(var(--green-700)) 100%)`;
                e.currentTarget.style.boxShadow = '0 12px 30px -8px hsl(var(--green-500) / 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, hsl(var(--green-500)) 0%, hsl(var(--green-600)) 100%)`;
                e.currentTarget.style.boxShadow = '0 8px 25px -8px hsl(var(--green-500) / 0.4)';
              }}
              data-testid="button-pay-emi"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Pay EMI
            </Button>
            <Button
              onClick={onViewDetails}
              className="flex-1 py-4 rounded-none font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, hsl(var(--blue-500)) 0%, hsl(var(--blue-600)) 100%)`,
                color: 'white',
                boxShadow: '0 8px 25px -8px hsl(var(--blue-500) / 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, hsl(var(--blue-600)) 0%, hsl(var(--blue-700)) 100%)`;
                e.currentTarget.style.boxShadow = '0 12px 30px -8px hsl(var(--blue-500) / 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, hsl(var(--blue-500)) 0%, hsl(var(--blue-600)) 100%)`;
                e.currentTarget.style.boxShadow = '0 8px 25px -8px hsl(var(--blue-500) / 0.4)';
              }}
              data-testid="button-view-details"
            >
              <FileText className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </>
      )}

      {loan.status === "pending" && (
        <>
          <div className="glassmorphic-card-secondary p-4 rounded-none mb-4" style={{
            background: `linear-gradient(135deg, hsl(var(--yellow-50)) 0%, hsl(var(--red-50)) 100%)`,
            border: `1px solid hsl(var(--yellow-200))`
          }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-none flex items-center justify-center" style={{
                background: `hsl(var(--yellow-100))`,
                border: `1px solid hsl(var(--yellow-200))`
              }}>
                <Clock className="h-4 w-4 text-yellow-600" />
              </div>
              <p className="text-yellow-800 text-sm font-bold">
                Document verification in progress
              </p>
            </div>
            <p className="text-yellow-700 text-xs font-medium">
              Expected completion: 2-3 business days
            </p>
          </div>

          <Button
            className="w-full py-4 rounded-none font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, hsl(var(--blue-500)) 0%, hsl(var(--blue-600)) 100%)`,
              color: 'white',
              boxShadow: '0 8px 25px -8px hsl(var(--blue-500) / 0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, hsl(var(--blue-600)) 0%, hsl(var(--blue-700)) 100%)`;
              e.currentTarget.style.boxShadow = '0 12px 30px -8px hsl(var(--blue-500) / 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, hsl(var(--blue-500)) 0%, hsl(var(--blue-600)) 100%)`;
              e.currentTarget.style.boxShadow = '0 8px 25px -8px hsl(var(--blue-500) / 0.4)';
            }}
            data-testid="button-upload-documents"
          >
            <FileText className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
        </>
      )}

      {(loan.status === "rejected" || loan.status === "completed") && (
        <div className="glassmorphic-card-secondary p-4 rounded-none" style={{
          background: loan.status === "rejected" 
            ? `linear-gradient(135deg, hsl(var(--red-50)) 0%, hsl(var(--red-100)) 100%)`
            : `linear-gradient(135deg, hsl(var(--purple-50)) 0%, hsl(var(--purple-100)) 100%)`,
          border: loan.status === "rejected"
            ? `1px solid hsl(var(--red-200))`
            : `1px solid hsl(var(--purple-200))`
        }}>
          <div className="flex items-center gap-3">
            <StatusIcon className={`h-5 w-5 ${loan.status === "rejected" ? "text-red-600" : "text-purple-600"}`} />
            <div>
              <p className={`font-bold text-sm ${loan.status === "rejected" ? "text-red-800" : "text-purple-800"}`}>
                {statusInfo?.label}
              </p>
              <p className={`text-xs ${loan.status === "rejected" ? "text-red-700" : "text-purple-700"}`}>
                {statusInfo?.description}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
});

export { LoanCard };
