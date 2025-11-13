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
import { ArrowLeft, CheckCircle, Globe } from "lucide-react";

const addAccountSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  country: z.string().min(1, "Country is required"),
  provider: z.string().min(1, "Provider is required"),
  subscriberNumber: z.string().min(8, "Subscriber number must be at least 8 characters"),
  plan: z.string().min(1, "Plan is required"),
  planAmount: z.string().min(1, "Plan amount is required"),
});

type AddAccountForm = z.infer<typeof addAccountSchema>;

const countries = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
];

const ottProvidersByCountry: Record<string, Array<{ name: string; logo: string; plans: Array<{ name: string; amount: string }> }>> = {
  IN: [
    { 
      name: "Netflix", 
      logo: "🎬",
      plans: [
        { name: "Mobile Plan", amount: "₹149" },
        { name: "Basic Plan", amount: "₹199" },
        { name: "Standard Plan", amount: "₹499" },
        { name: "Premium Plan", amount: "₹649" },
      ]
    },
    { 
      name: "Amazon Prime", 
      logo: "📦",
      plans: [
        { name: "Monthly Plan", amount: "₹299" },
        { name: "Annual Plan", amount: "₹1,499" },
      ]
    },
    { 
      name: "Disney+ Hotstar", 
      logo: "⭐",
      plans: [
        { name: "Mobile Plan", amount: "₹149" },
        { name: "Super Plan", amount: "₹499" },
        { name: "Premium Plan", amount: "₹1,499" },
      ]
    },
    { 
      name: "SonyLIV", 
      logo: "📺",
      plans: [
        { name: "Monthly Plan", amount: "₹299" },
        { name: "6 Months Plan", amount: "₹699" },
        { name: "Annual Plan", amount: "₹999" },
      ]
    },
    { 
      name: "ZEE5", 
      logo: "🎭",
      plans: [
        { name: "Monthly Plan", amount: "₹99" },
        { name: "Annual Plan", amount: "₹699" },
      ]
    },
    { 
      name: "YouTube Premium", 
      logo: "▶️",
      plans: [
        { name: "Individual Plan", amount: "₹129" },
        { name: "Family Plan", amount: "₹189" },
      ]
    },
  ],
  US: [
    { 
      name: "Netflix", 
      logo: "🎬",
      plans: [
        { name: "Standard with Ads", amount: "$6.99" },
        { name: "Standard Plan", amount: "$15.49" },
        { name: "Premium Plan", amount: "$19.99" },
      ]
    },
    { 
      name: "Amazon Prime", 
      logo: "📦",
      plans: [
        { name: "Monthly Plan", amount: "$14.99" },
        { name: "Annual Plan", amount: "$139" },
      ]
    },
    { 
      name: "Disney+", 
      logo: "⭐",
      plans: [
        { name: "Monthly Plan", amount: "$7.99" },
        { name: "Annual Plan", amount: "$79.99" },
      ]
    },
    { 
      name: "Hulu", 
      logo: "🟢",
      plans: [
        { name: "Basic Plan", amount: "$7.99" },
        { name: "No Ads Plan", amount: "$17.99" },
      ]
    },
    { 
      name: "HBO Max", 
      logo: "🎪",
      plans: [
        { name: "With Ads", amount: "$9.99" },
        { name: "Ad-Free", amount: "$15.99" },
      ]
    },
  ],
  GB: [
    { 
      name: "Netflix", 
      logo: "🎬",
      plans: [
        { name: "Basic with Ads", amount: "£4.99" },
        { name: "Basic Plan", amount: "£6.99" },
        { name: "Standard Plan", amount: "£10.99" },
        { name: "Premium Plan", amount: "£15.99" },
      ]
    },
    { 
      name: "Amazon Prime", 
      logo: "📦",
      plans: [
        { name: "Monthly Plan", amount: "£8.99" },
        { name: "Annual Plan", amount: "£95" },
      ]
    },
    { 
      name: "Disney+", 
      logo: "⭐",
      plans: [
        { name: "Monthly Plan", amount: "£7.99" },
        { name: "Annual Plan", amount: "£79.90" },
      ]
    },
    { 
      name: "NOW TV", 
      logo: "📡",
      plans: [
        { name: "Entertainment", amount: "£9.99" },
        { name: "Cinema", amount: "£11.99" },
      ]
    },
  ],
  AE: [
    { 
      name: "Netflix", 
      logo: "🎬",
      plans: [
        { name: "Basic Plan", amount: "AED 29" },
        { name: "Standard Plan", amount: "AED 39" },
        { name: "Premium Plan", amount: "AED 56" },
      ]
    },
    { 
      name: "Amazon Prime", 
      logo: "📦",
      plans: [
        { name: "Monthly Plan", amount: "AED 16" },
        { name: "Annual Plan", amount: "AED 175" },
      ]
    },
    { 
      name: "Disney+", 
      logo: "⭐",
      plans: [
        { name: "Monthly Plan", amount: "AED 29.99" },
        { name: "Annual Plan", amount: "AED 299.99" },
      ]
    },
    { 
      name: "OSN+", 
      logo: "🎥",
      plans: [
        { name: "Basic Plan", amount: "AED 31" },
        { name: "Premium Plan", amount: "AED 50" },
      ]
    },
  ],
  SG: [
    { 
      name: "Netflix", 
      logo: "🎬",
      plans: [
        { name: "Mobile Plan", amount: "S$9.99" },
        { name: "Basic Plan", amount: "S$11.98" },
        { name: "Standard Plan", amount: "S$16.98" },
        { name: "Premium Plan", amount: "S$21.98" },
      ]
    },
    { 
      name: "Amazon Prime", 
      logo: "📦",
      plans: [
        { name: "Monthly Plan", amount: "S$9.99" },
        { name: "Annual Plan", amount: "S$99" },
      ]
    },
    { 
      name: "Disney+", 
      logo: "⭐",
      plans: [
        { name: "Monthly Plan", amount: "S$11.98" },
        { name: "Annual Plan", amount: "S$119.98" },
      ]
    },
  ],
  AU: [
    { 
      name: "Netflix", 
      logo: "🎬",
      plans: [
        { name: "Basic with Ads", amount: "A$6.99" },
        { name: "Basic Plan", amount: "A$10.99" },
        { name: "Standard Plan", amount: "A$16.99" },
        { name: "Premium Plan", amount: "A$22.99" },
      ]
    },
    { 
      name: "Amazon Prime", 
      logo: "📦",
      plans: [
        { name: "Monthly Plan", amount: "A$9.99" },
        { name: "Annual Plan", amount: "A$79" },
      ]
    },
    { 
      name: "Disney+", 
      logo: "⭐",
      plans: [
        { name: "Monthly Plan", amount: "A$13.99" },
        { name: "Annual Plan", amount: "A$139.99" },
      ]
    },
    { 
      name: "Stan", 
      logo: "🎞️",
      plans: [
        { name: "Basic Plan", amount: "A$12" },
        { name: "Standard Plan", amount: "A$16" },
        { name: "Premium Plan", amount: "A$21" },
      ]
    },
  ],
};

export default function AddOTTAccount() {
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
      country: "",
      provider: "",
      subscriberNumber: "",
      plan: "",
      planAmount: "",
    },
  });

  const selectedCountry = form.watch("country");
  const selectedProvider = form.watch("provider");
  const selectedPlan = form.watch("plan");

  const availableProviders = selectedCountry ? ottProvidersByCountry[selectedCountry] || [] : [];
  const selectedProviderData = availableProviders.find(p => p.name === selectedProvider);
  const availablePlans = selectedProviderData?.plans || [];

  useEffect(() => {
    if (isEditMode) {
      const name = searchParams.get('name');
      const country = searchParams.get('country');
      const provider = searchParams.get('provider');
      const subscriberNumber = searchParams.get('subscriberNumber');
      const plan = searchParams.get('plan');
      const planAmount = searchParams.get('planAmount');

      if (name) form.setValue('accountName', name);
      if (country) form.setValue('country', country);
      if (provider) form.setValue('provider', provider);
      if (subscriberNumber) form.setValue('subscriberNumber', subscriberNumber);
      if (plan) form.setValue('plan', plan);
      if (planAmount) form.setValue('planAmount', planAmount);
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
        description: `${data.accountName} OTT subscription has been ${isEditMode ? 'updated' : 'added'}`,
      });
      navigate(isEditMode && accountId ? `/ott-subscription/account/${accountId}` : "/ott-subscription");
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
                Your OTT subscription account has been {isEditMode ? 'updated' : 'added'} successfully
              </p>
              <p className="text-sm text-white/40">
                Redirecting to {isEditMode ? 'account details' : 'OTT subscriptions'}...
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
            onClick={() => navigate("/ott-subscription")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">{isEditMode ? 'EDIT ACCOUNT' : 'ADD ACCOUNT'}</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">OTT Subscription</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 pb-32 px-4 w-full max-w-screen-lg mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 border border-white/20 flex items-center justify-center">
            <Globe className="h-6 w-6 text-white/60" />
          </div>
          <div>
            <h2 className="text-lg font-light tracking-wide text-white">OTT Subscription Details</h2>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Enter your subscription information</p>
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
                      placeholder="e.g., Netflix Premium, Family Plan"
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
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Country</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("provider", "");
                      form.setValue("plan", "");
                      form.setValue("planAmount", "");
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-country">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-white/20">
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code} className="text-white">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{country.flag}</span>
                            <span>{country.name}</span>
                          </div>
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
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">OTT Provider</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("plan", "");
                      form.setValue("planAmount", "");
                    }} 
                    defaultValue={field.value}
                    disabled={!selectedCountry}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-white/20">
                      {availableProviders.map((provider) => (
                        <SelectItem key={provider.name} value={provider.name} className="text-white">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{provider.logo}</span>
                            <span>{provider.name}</span>
                          </div>
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
              name="plan"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Plan</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      const selectedPlanData = availablePlans.find(p => p.name === value);
                      if (selectedPlanData) {
                        form.setValue("planAmount", selectedPlanData.amount);
                      }
                    }} 
                    defaultValue={field.value}
                    disabled={!selectedProvider}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-plan">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-black border-white/20">
                      {availablePlans.map((plan) => (
                        <SelectItem key={plan.name} value={plan.name} className="text-white">
                          <div className="flex items-center justify-between gap-4 w-full">
                            <span>{plan.name}</span>
                            <span className="text-white/60">{plan.amount}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedPlan && (
              <div className="border border-white/20 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Plan Amount</p>
                  <p className="text-2xl font-light text-white" data-testid="text-plan-amount">
                    {form.getValues("planAmount")}
                  </p>
                </div>
              </div>
            )}

            <FormField
              control={form.control}
              name="subscriberNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] text-white/60 uppercase tracking-widest">Subscriber/Account Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter subscriber or account number"
                      className="bg-white/5 border-white/10 text-white rounded-none h-12"
                      data-testid="input-subscriber-number"
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
