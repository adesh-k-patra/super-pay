import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Tv, CheckCircle } from "lucide-react";

const addAccountSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  subscriberId: z.string().min(8, "Subscriber ID must be at least 8 digits"),
  operator: z.string().min(1, "Operator is required"),
  packageName: z.string().optional(),
});

type AddAccountForm = z.infer<typeof addAccountSchema>;

const operators = [
  "Tata Play",
  "Airtel Digital TV",
  "Dish TV",
  "Sun Direct",
  "Videocon d2h",
  "Other"
];

export default function AddDTHAccount() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Check if we're in edit mode by reading query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const isEditMode = searchParams.get('edit') === 'true';
  const accountId = searchParams.get('id');

  const form = useForm<AddAccountForm>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      accountName: "",
      subscriberId: "",
      operator: "",
      packageName: "",
    },
  });

  // Pre-fill form when in edit mode
  useEffect(() => {
    if (isEditMode) {
      const name = searchParams.get('name');
      const subscriberId = searchParams.get('subscriberId');
      const operator = searchParams.get('operator');
      const packageName = searchParams.get('packageName');

      if (name) form.setValue('accountName', name);
      if (subscriberId) form.setValue('subscriberId', subscriberId);
      if (operator) form.setValue('operator', operator);
      if (packageName) form.setValue('packageName', packageName);
    }
  }, [isEditMode]);

  const onSubmit = async (data: AddAccountForm) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      toast({
        title: isEditMode ? "Account Updated Successfully" : "Account Added Successfully",
        description: `${data.accountName} DTH account has been ${isEditMode ? 'updated' : 'added'}`,
      });
      navigate(isEditMode && accountId ? `/dth-recharge/account/${accountId}` : "/dth-recharge");
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <div className="w-10"></div>
            <h1 className="text-base font-bold tracking-wider">{isEditMode ? 'ACCOUNT UPDATED' : 'ACCOUNT ADDED'}</h1>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="border border-white/20 bg-white/5 p-12">
              <div className="w-20 h-20 border border-white/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-white/80" />
              </div>
              <h2 className="text-2xl font-light mb-2 text-white">Success!</h2>
              <p className="text-white/60 mb-6">
                Your DTH account has been {isEditMode ? 'updated' : 'added'} successfully
              </p>
              <p className="text-sm text-white/40">
                Redirecting to {isEditMode ? 'account details' : 'DTH recharge'}...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dth-recharge")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">{isEditMode ? 'EDIT ACCOUNT' : 'ADD ACCOUNT'}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">DTH Recharge</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 pb-32 px-4 w-full max-w-screen-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
            <Tv className="h-6 w-6 text-white/60" />
          </div>
          <div>
            <h2 className="text-lg font-light tracking-wide text-white">DTH Account Details</h2>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Enter your DTH information</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Account Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Home DTH, Parents DTH"
                        className="bg-white/5 border-white/10 text-white rounded-none h-12"
                        data-testid="input-account-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">DTH Operator</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-operator">
                          <SelectValue placeholder="Select operator" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-white/20">
                        {operators.map((operator) => (
                          <SelectItem key={operator} value={operator} className="text-white">
                            {operator}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subscriberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Subscriber ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter subscriber ID"
                        className="bg-white/5 border-white/10 text-white rounded-none h-12"
                        data-testid="input-subscriber-id"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="packageName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Package Name (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="e.g., Sports Pack, Family Entertainment"
                        className="bg-white/5 border-white/10 text-white rounded-none h-12"
                        data-testid="input-package-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </form>
        </Form>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="w-full bg-white text-black hover:bg-white/90 h-14 font-light text-base tracking-wide rounded-none"
          data-testid="button-create"
        >
          {isSubmitting ? (isEditMode ? "Updating Account..." : "Creating Account...") : (isEditMode ? "Update Account" : "Create Account")}
        </Button>
      </div>
    </div>
  );
}
