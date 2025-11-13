import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, Building2, CheckCircle } from "lucide-react";

const addAccountSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  accountNumber: z.string().min(8, "Account number must be at least 8 digits").max(18, "Account number must not exceed 18 digits"),
  confirmAccountNumber: z.string().min(8, "Please confirm your account number"),
  accountType: z.enum(["savings", "current", "salary"], {
    required_error: "Please select an account type",
  }),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format"),
  branch: z.string().min(1, "Branch name is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
  message: "Account numbers don't match",
  path: ["confirmAccountNumber"],
});

type AddAccountForm = z.infer<typeof addAccountSchema>;

const popularBanks = [
  "State Bank of India (SBI)",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank (PNB)",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank of India",
  "IndusInd Bank",
  "Yes Bank",
  "IDFC First Bank",
  "RBL Bank",
  "Federal Bank",
  "South Indian Bank",
  "Other"
];

export default function AddAccount() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<AddAccountForm>({
    resolver: zodResolver(addAccountSchema),
    defaultValues: {
      bankName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      accountType: undefined,
      ifscCode: "",
      branch: "",
      accountHolderName: "",
    },
  });

  const onSubmit = async (data: AddAccountForm) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Show success message and redirect after delay
    setTimeout(() => {
      toast({
        title: "Account Added Successfully",
        description: `${data.bankName} account linked to your profile`,
      });
      navigate("/my-bank-accounts");
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
          <div className="flex items-center justify-between py-6 px-4">
            <div className="w-10"></div>
            <h1 className="text-lg font-semibold tracking-wider">ACCOUNT ADDED</h1>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="pt-32 px-4">
          <div className="max-w-md mx-auto">
            <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-none">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10 text-white/80" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-white">Success!</h2>
                <p className="text-white/60 mb-6">
                  Your bank account has been added successfully
                </p>
                <p className="text-sm text-white/40">
                  Redirecting to your accounts...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20 overflow-x-hidden">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between py-6 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/my-bank-accounts")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold tracking-wider">ADD BANK ACCOUNT</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-24 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Info Card */}
          <Card className="bg-white/5 border border-white/20 rounded-none mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-white/10 rounded-full p-3">
                  <Building2 className="h-6 w-6 text-white/80" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-2">
                    Link Your Bank Account
                  </h3>
                  <p className="text-sm text-white/60">
                    Connect your bank account to enable seamless payments, transfers, and financial tracking.
                    Your information is encrypted and secure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Card */}
          <Card className="bg-white/5 border border-white/10 rounded-none">
            <CardHeader>
              <CardTitle className="text-xl text-white">Account Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Account Holder Name */}
                  <FormField
                    control={form.control}
                    name="accountHolderName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Account Holder Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter full name as per bank records"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                            data-testid="input-account-holder"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-white/80" />
                      </FormItem>
                    )}
                  />

                  {/* Bank Name */}
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Bank Name</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-bank">
                              <SelectValue placeholder="Select your bank" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black border-white/20">
                            {popularBanks.map((bank) => (
                              <SelectItem key={bank} value={bank} className="text-white focus:bg-white/10">
                                {bank}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-white/80" />
                      </FormItem>
                    )}
                  />

                  {/* Account Type */}
                  <FormField
                    control={form.control}
                    name="accountType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Account Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-white" data-testid="select-account-type">
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-black border-white/20">
                            <SelectItem value="savings" className="text-white focus:bg-white/10">Savings Account</SelectItem>
                            <SelectItem value="current" className="text-white focus:bg-white/10">Current Account</SelectItem>
                            <SelectItem value="salary" className="text-white focus:bg-white/10">Salary Account</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-white/80" />
                      </FormItem>
                    )}
                  />

                  {/* Account Number */}
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Account Number</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter account number"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                            data-testid="input-account-number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-white/80" />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Account Number */}
                  <FormField
                    control={form.control}
                    name="confirmAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Confirm Account Number</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Re-enter account number"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                            data-testid="input-confirm-account"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-white/80" />
                      </FormItem>
                    )}
                  />

                  {/* IFSC Code */}
                  <FormField
                    control={form.control}
                    name="ifscCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">IFSC Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., HDFC0001234"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40 uppercase"
                            data-testid="input-ifsc"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage className="text-white/80" />
                      </FormItem>
                    )}
                  />

                  {/* Branch */}
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Branch Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter branch name"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
                            data-testid="input-branch"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-white/80" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-white text-black hover:bg-white/90 h-12 text-base font-semibold"
                      data-testid="button-submit"
                    >
                      {isSubmitting ? "Adding Account..." : "Add Account"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/40">
              🔒 Your bank details are encrypted and stored securely. We never share your information with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
