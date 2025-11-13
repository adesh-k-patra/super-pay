import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sharewiseGroupFormSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type GroupFormData = z.infer<typeof sharewiseGroupFormSchema>;

export default function CreateGroup() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<GroupFormData>({
    resolver: zodResolver(sharewiseGroupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      groupType: "other",
      currency: "INR",
      groupColor: "#8B5CF6",
      groupPhoto: ""
    }
  });

  const createGroup = useMutation({
    mutationFn: async (data: GroupFormData) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }
      return await apiRequest("POST", "/api/sharewise/groups", {
        ...data,
        createdBy: user.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sharewise/groups"] });
      toast({
        title: "Group Created",
        description: "Your group has been created successfully"
      });
      navigate("/sharewise/groups");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create group",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: GroupFormData) => {
    createGroup.mutate(data);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/sharewise/groups")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider uppercase">Create Group</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">New expense group</p>
          </div>
          <div className="w-9" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pt-20 pb-32">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
            <div className="px-4 py-6 space-y-6">
              {/* General Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider border-b border-white/10 pb-2">General Details</h3>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Group Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Trip to Goa"
                          className="bg-white/5 border-white/10 text-white rounded-none h-12"
                          data-testid="input-create-group-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          placeholder="Weekend trip with friends"
                          className="bg-white/5 border-white/10 text-white resize-none rounded-none"
                          rows={3}
                          data-testid="input-create-group-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Settings Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider border-b border-white/10 pb-2">Settings</h3>
                <FormField
                  control={form.control}
                  name="groupType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Group Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-group-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-white/10">
                          <SelectItem value="trip">Trip</SelectItem>
                          <SelectItem value="housemates">Housemates</SelectItem>
                          <SelectItem value="couple">Couple</SelectItem>
                          <SelectItem value="event">Event</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Currency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-none h-12" data-testid="select-currency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-black border-white/10">
                          <SelectItem value="INR">INR (₹)</SelectItem>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groupColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs text-white/50 uppercase tracking-widest">Group Color</FormLabel>
                      <div className="grid grid-cols-6 gap-3">
                        {["#8B5CF6", "#10B981", "#3B82F6", "#EC4899", "#F59E0B", "#6366F1"].map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => field.onChange(color)}
                            className={`h-12 border-2 transition-all ${field.value === color ? 'border-white scale-110' : 'border-white/20'}`}
                            style={{ backgroundColor: color }}
                            data-testid={`color-${color}`}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-white/10 z-50">
        <Button
          type="submit"
          onClick={form.handleSubmit(onSubmit)}
          disabled={createGroup.isPending}
          className="w-full bg-white text-black hover:bg-white/90 rounded-none h-16 font-light text-lg uppercase tracking-[0.2em] transition-all hover:scale-[1.02]"
          data-testid="button-submit-create-group"
        >
          {createGroup.isPending ? "CREATING..." : "CREATE GROUP"}
        </Button>
      </div>
    </div>
  );
}
