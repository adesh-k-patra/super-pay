import { useEffect } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Receipt, User, IndianRupee, Clock, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upiCollectRequestSchema, type UpiCollectRequest, type UpiAccount } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function UpiCollect() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user's UPI accounts
  const { data: upiAccounts, isLoading: isLoadingAccounts } = useQuery<UpiAccount[]>({
    queryKey: ['/api/upi/accounts'],
    select: (data: UpiAccount[]) => data || []
  });

  const primaryAccount = upiAccounts?.find((account) => account.isPrimary === 1);

  const form = useForm<UpiCollectRequest>({
    resolver: zodResolver(upiCollectRequestSchema),
    defaultValues: {
      payerUpiId: "",
      amount: 0,
      description: "",
      expiryMinutes: 15
    }
  });

  // Reset form when primary account loads
  useEffect(() => {
    if (primaryAccount?.upiId) {
      form.reset({
        payerUpiId: "",
        amount: 0,
        description: "",
        expiryMinutes: 15
      });
    }
  }, [primaryAccount?.upiId, form]);

  const collectMutation = useMutation({
    mutationFn: (data: UpiCollectRequest) => apiRequest('/api/upi/collect', 'POST', data),
    onSuccess: () => {
      toast({
        title: "Collection Request Sent",
        description: "Your payment request has been sent successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/upi/transactions'] });
      navigate('/upi-history');
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Unable to send your payment request. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: UpiCollectRequest) => {
    collectMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 lg:pb-4">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goBack()}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base uppercase tracking-widest font-light">REQUEST MONEY</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Collect payment via UPI</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        {/* UPI Collect Form */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6 backdrop-blur-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="payerUpiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium tracking-wider">FROM UPI ID</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                        <Input
                          {...field}
                          placeholder="example@paytm"
                          className="pl-10 bg-black border border-white/10 text-white placeholder:text-white/40 focus:border-white/60 focus:ring-0 h-12 rounded-none"
                          data-testid="input-payer-upi"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-white/80" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium tracking-wider">AMOUNT</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
                        <Input
                          {...field}
                          type="number"
                          placeholder="0"
                          className="pl-10 bg-black border border-white/10 text-white placeholder:text-white/40 focus:border-white/60 focus:ring-0 h-12 rounded-none"
                          data-testid="input-amount"
                          disabled={isLoadingAccounts}
                          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-white/80" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium tracking-wider">PURPOSE (REQUIRED)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Payment for..."
                        className="bg-black border border-white/10 text-white placeholder:text-white/40 focus:border-white/60 focus:ring-0 h-12 rounded-none"
                        data-testid="input-description"
                      />
                    </FormControl>
                    <FormMessage className="text-white/80" />
                  </FormItem>
                )}
              />

              {/* Expiry Info */}
              <div className="border border-white/10 p-4 bg-white/5">
                <div className="flex items-center gap-3 text-white/60">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm tracking-wide">Request expires in 15 minutes</span>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-white text-black hover:bg-white/90 font-semibold tracking-wide h-12 rounded-none"
                disabled={collectMutation.isPending || isLoadingAccounts || !primaryAccount}
                data-testid="button-send-request"
              >
                {collectMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    SENDING REQUEST...
                  </>
                ) : (
                  <>
                    <Receipt className="h-4 w-4 mr-2" />
                    {isLoadingAccounts ? 'LOADING...' : `SEND REQUEST FOR ₹${form.watch('amount') || 0}`}
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* Account Info */}
        {primaryAccount && (
          <div className="border border-white/10 p-4 text-center bg-white/5 backdrop-blur-sm">
            <p className="text-sm text-white/60">
              <span className="text-white font-medium">COLLECTING TO:</span><br />
              {primaryAccount.upiId} ({primaryAccount.bankName})
            </p>
          </div>
        )}
        
        {!primaryAccount && !isLoadingAccounts && (
          <div className="border border-white/20 p-4 text-center bg-white/5">
            <p className="text-sm text-white/80">
              NO UPI ACCOUNT LINKED. PLEASE ADD A UPI ACCOUNT FIRST.
            </p>
          </div>
        )}

        {/* Quick Amounts */}
        <div className="bg-white/5 border border-white/10 p-6 backdrop-blur-xl">
          <h3 className="font-semibold text-white mb-4 tracking-wider">QUICK AMOUNTS</h3>
          <div className="grid grid-cols-3 gap-3">
            {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => form.setValue('amount', amount)}
                className="border border-white/10 text-white/80 hover:text-white hover:bg-white/10 text-sm font-medium h-10 rounded-none"
                data-testid={`button-quick-amount-${amount}`}
              >
                ₹{amount.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}