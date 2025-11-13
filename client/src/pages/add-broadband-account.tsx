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
import { ArrowLeft, Wifi, CheckCircle } from "lucide-react";

const addAccountSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(8, "Account number must be at least 8 digits"),
  provider: z.string().min(1, "Provider is required"),
});

type AddAccountForm = z.infer<typeof addAccountSchema>;

const providers = [
  "Airtel Xstream Fiber",
  "Jio Fiber",
  "ACT Fibernet",
  "BSNL Fiber",
  "Hathway Broadband",
  "Tata Play Fiber",
  "Spectra",
  "Other"
];

export default function AddBroadbandAccount() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const isEditMode = searchParams.get('edit') === 'true';
  const accountId = searchParams.get('id');

  const form = useForm<AddAccountForm>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      accountName: "",
      accountNumber: "",
      provider: "",
    },
  });

  useEffect(() => {
    if (isEditMode) {
      const name = searchParams.get('name');
      const accountNumber = searchParams.get('accountNumber');
      const provider = searchParams.get('provider');

      if (name) form.setValue('accountName', name);
      if (accountNumber) form.setValue('accountNumber', accountNumber);
      if (provider) form.setValue('provider', provider);
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
        description: `${data.accountName} broadband account has been ${isEditMode ? 'updated' : 'added'}`,
      });
      navigate(isEditMode && accountId ? `/broadband-bill/account/${accountId}` : "/broadband-bill");
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
                Your broadband account has been {isEditMode ? 'updated' : 'added'} successfully
              </p>
              <p className="text-sm text-white/40">
                Redirecting to {isEditMode ? 'account details' : 'broadband bills'}...
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
            onClick={() => navigate("/broadband-bill")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">{isEditMode ? 'EDIT ACCOUNT' : 'ADD ACCOUNT'}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Broadband Bill</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 pb-32 px-4 w-full max-w-screen-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
            <Wifi className="h-6 w-6 text-white/60" />
          </div>
          <div>
            <h2 className="text-lg font-light tracking-wide text-white">Broadband Account Details</h2>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Enter your account information</p>
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
                        placeholder="e.g., Home, Office"
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
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Broadband Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-black border-white/20">
                        {providers.map((provider) => (
                          <SelectItem key={provider} value={provider} className="text-white">
                            {provider}
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
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Account Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter account number"
                        className="bg-white/5 border-white/10 text-white rounded-none h-12"
                        data-testid="input-account-number"
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
