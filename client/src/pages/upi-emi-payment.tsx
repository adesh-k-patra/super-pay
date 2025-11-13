import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowLeft, CreditCard, Building, Calendar, IndianRupee, Loader2, Eye, EyeOff } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { emiPaymentUpiSchema, type EmiPaymentUpi, type LoanApplication, type UpiAccount } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function UpiEmiPayment() {
  const [, navigate] = useLocation();
  const params = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hideAmounts, setHideAmounts] = useState(false);
  
  const loanId = params.loanId;

  // Fetch active loans for selection if no specific loan is provided
  const { data: loans = [], isLoading: isLoadingLoans } = useQuery<LoanApplication[]>({
    queryKey: ['/api/loans'],
    select: (data: LoanApplication[]) => data.filter((loan) => loan.status === 'active') || []
  });

  // Get user's UPI accounts
  const { data: upiAccounts = [], isLoading: isLoadingAccounts } = useQuery<UpiAccount[]>({
    queryKey: ['/api/upi/accounts']
  });

  const primaryAccount = upiAccounts.find((account) => account.isPrimary === 1);
  const targetLoan: LoanApplication | undefined = loanId 
    ? loans.find((loan) => loan.id === loanId)
    : loans.length === 1 ? loans[0] : undefined;
  const isLoadingSpecificLoan = isLoadingLoans;

  const form = useForm<EmiPaymentUpi>({
    resolver: zodResolver(emiPaymentUpiSchema),
    defaultValues: {
      loanId: loanId || '',
      amount: 0,
      upiId: ''
    }
  });

  // Reset form when target loan and primary account load
  useEffect(() => {
    if (targetLoan && primaryAccount) {
      form.reset({
        loanId: targetLoan.id,
        amount: parseFloat(targetLoan.emi || '0'),
        upiId: primaryAccount.upiId
      });
    }
  }, [targetLoan, primaryAccount, form]);

  const emiPaymentMutation = useMutation({
    mutationFn: (data: EmiPaymentUpi) => apiRequest('/api/upi/emi-payment', 'POST', data),
    onSuccess: (_, variables) => {
      const loan = loans.find(l => l.id === variables.loanId);
      const transactionId = `TXN${Date.now()}`;
      const queryParams = new URLSearchParams({
        transactionId,
        amount: variables.amount.toString(),
        loanId: variables.loanId,
        lenderName: (loan as any)?.lender || 'Bank',
        loanType: loan?.loanType || 'Loan',
        emiNumber: '1',
        dueDate: new Date().toISOString(),
        upiId: variables.upiId,
        paymentMethod: 'UPI'
      });
      
      toast({
        title: "EMI Payment Successful",
        description: "Your EMI has been paid successfully via UPI."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/loans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/upi/transactions'] });
      navigate(`/emi-payment-success?${queryParams.toString()}`);
    },
    onError: () => {
      toast({
        title: "Payment Failed",
        description: "Unable to process your EMI payment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: EmiPaymentUpi) => {
    emiPaymentMutation.mutate({
      ...data,
      upiId: primaryAccount?.upiId || data.upiId
    });
  };

  // If specific loan provided, show payment form directly
  if (loanId && targetLoan) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/my-emis")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">PAY EMI</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">UPI Payment</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHideAmounts(!hideAmounts)}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-toggle-amounts"
            >
              {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
          {/* Loan Details Card */}
          <div className="relative border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6" data-testid="loan-details">
            <div className="space-y-6">
              {/* Loan Header */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Building className="h-6 w-6 text-white/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-light text-white tracking-wide">HDFC Bank</h3>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">{targetLoan?.loanType} Loan</p>
                  <p className="text-[10px] text-white/40 tracking-wide mt-1">#{targetLoan?.applicationNumber}</p>
                </div>
              </div>

              {/* Amount Display */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-white/50 uppercase tracking-widest font-light mb-2">EMI Amount</p>
                <p className="text-4xl font-light text-white tracking-tight">
                  {hideAmounts ? "₹••••••" : `₹${parseFloat(targetLoan?.emi || '0').toLocaleString()}`}
                </p>
              </div>

              {/* UPI Account Info */}
              {primaryAccount && (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest font-light mb-2">Paying From</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 border border-white/20 flex items-center justify-center">
                      <IndianRupee className="h-4 w-4 text-white/60" />
                    </div>
                    <div>
                      <p className="text-sm font-light text-white tracking-wide">{primaryAccount.upiId}</p>
                      <p className="text-[10px] text-white/50 tracking-wide">{primaryAccount.bankName}</p>
                    </div>
                  </div>
                </div>
              )}

              {!primaryAccount && !isLoadingAccounts && (
                <div className="border-t border-white/10 pt-4">
                  <div className="border border-white/20 bg-white/5 p-4">
                    <p className="text-[10px] text-white/60 text-center uppercase tracking-widest">
                      No UPI account linked. Please add a UPI account first.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Button */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="loanId"
                render={({ field }) => (
                  <input type="hidden" {...field} value={loanId} />
                )}
              />
              
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <input type="hidden" {...field} value={parseFloat(targetLoan?.emi || '0')} />
                )}
              />

              <Button 
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90 h-12 rounded-none text-[10px] uppercase tracking-widest font-light"
                disabled={emiPaymentMutation.isPending || isLoadingAccounts || isLoadingSpecificLoan || !primaryAccount || !targetLoan}
                data-testid="button-pay-emi-now"
              >
                {emiPaymentMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CreditCard className="h-4 w-4 mr-2" />
                )}
                {isLoadingSpecificLoan || isLoadingAccounts ? 'Loading...' : `Pay ${hideAmounts ? '••••••' : `₹${parseFloat(targetLoan?.emi || '0').toLocaleString()}`} via UPI`}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/my-emis")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">PAY EMI</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Select loan</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideAmounts(!hideAmounts)}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-toggle-amounts"
          >
            {hideAmounts ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* Instructions */}
        <div className="text-center">
          <p className="text-sm font-light text-white/60 tracking-wide">Choose the loan EMI you want to pay</p>
        </div>

        {/* Loan List */}
        <div className="space-y-3">
          {loans.map((loan: any) => {
            const dueDate = loan.nextEmiDate ? new Date(loan.nextEmiDate).toLocaleDateString() : 'No due date';
            const isOverdue = loan.nextEmiDate && new Date(loan.nextEmiDate) < new Date();
            
            return (
              <div
                key={loan.id}
                className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-4 hover:border-white/20 transition-all cursor-pointer"
                onClick={() => navigate(`/upi-emi-payment/${loan.id}`)}
                data-testid={`loan-card-${loan.id}`}
              >
                <div className="space-y-4">
                  {/* Loan Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="w-9 h-9 border border-white/20 flex items-center justify-center flex-shrink-0">
                        <Building className="h-4 w-4 text-white/60" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-light text-white text-sm tracking-wide">HDFC Bank</h4>
                        <p className="text-[10px] text-white/50 capitalize tracking-widest">{loan.loanType} Loan</p>
                        <p className="text-[10px] text-white/40 tracking-wide">#{loan.applicationNumber}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl font-light text-white tracking-tight">
                        {hideAmounts ? '••••••' : `₹${parseFloat(loan.emi || '0').toLocaleString()}`}
                      </p>
                    </div>
                  </div>

                  {/* Due Date & Status */}
                  <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-white/50" />
                      <span className="text-[10px] text-white/50 tracking-wide">Due: {dueDate}</span>
                    </div>
                    <Badge 
                      className={cn(
                        "bg-white/10 text-white border-white/20 rounded-none text-[10px] uppercase tracking-widest",
                        isOverdue && "border-white/30"
                      )}
                    >
                      {isOverdue ? "Overdue" : "Upcoming"}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {loans.length === 0 && !isLoadingLoans && (
          <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-12 text-center">
            <div className="w-16 h-16 border border-white/20 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-8 w-8 text-white/60" />
            </div>
            <h3 className="text-lg font-light text-white mb-2 tracking-wide">No Active Loans</h3>
            <p className="text-[10px] text-white/50 mb-6 uppercase tracking-widest">
              You don't have any active loans to pay EMI for
            </p>
          </div>
        )}

        {isLoadingLoans && (
          <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-12 flex flex-col items-center rounded-none">
            <Loader2 className="h-12 w-12 animate-spin text-white mb-4" />
            <p className="text-sm font-light text-white tracking-wide">Loading loans...</p>
          </div>
        )}
      </div>
    </div>
  );
}
