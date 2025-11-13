import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, Save, Bell, BellOff, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CashParkAccount } from "@shared/schema";

export default function CashParkSettings() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const { data: accountData, isLoading } = useQuery<{ account: CashParkAccount | null }>({
    queryKey: ["/api/cash-park/account"],
  });

  const account = accountData?.account;

  const [sweepThreshold, setSweepThreshold] = useState("10000");
  const [fdIncrement, setFdIncrement] = useState("1000");
  const [autoSweepEnabled, setAutoSweepEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    if (account) {
      setSweepThreshold(account.sweepThreshold || "10000");
      setFdIncrement(account.fdIncrementAmount || "1000");
      setAutoSweepEnabled(account.autoSweepEnabled === 1);
      setNotificationsEnabled(account.notificationsEnabled === 1);
    }
  }, [account]);

  const handleSave = async () => {
    if (!account) {
      toast({
        title: "Account Not Found",
        description: "Please activate Cash Park first",
        variant: "destructive",
      });
      return;
    }

    const threshold = parseFloat(sweepThreshold);
    const increment = parseFloat(fdIncrement);

    if (isNaN(threshold) || threshold < 10000) {
      toast({
        title: "Invalid Threshold",
        description: "Minimum threshold is ₹10,000",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(increment) || increment < 100) {
      toast({
        title: "Invalid Increment",
        description: "Minimum increment is ₹100",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const response = await apiRequest("POST", "/api/cash-park/settings", {
        sweepThreshold: threshold,
        fdIncrementAmount: increment,
        autoSweepEnabled: autoSweepEnabled ? 1 : 0,
        notificationsEnabled: notificationsEnabled ? 1 : 0,
      });

      const result = await response.json();

      if (!result.success) {
        toast({
          title: "Update Failed",
          description: result.message || "Failed to update settings",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Settings updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cash-park/account"] });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl font-light tracking-wider">Loading...</div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl font-light tracking-wider">Please activate Cash Park first</p>
          <Button
            onClick={() => navigate("/cash-park")}
            className="bg-white text-black hover:bg-white/90 rounded-none"
            data-testid="button-activate-first"
          >
            Go to Cash Park
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/cash-park")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">CASH PARK SETTINGS</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Configuration</p>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 max-w-3xl mx-auto">
        <div className="border border-white/20 bg-white/5 backdrop-blur-xl p-8 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <Target className="h-6 w-6 text-white" />
              <h2 className="text-xl font-light tracking-wider uppercase">SWEEP CONFIGURATION</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="threshold" className="text-white/60 text-xs uppercase tracking-widest font-light">
                  Sweep Threshold (₹)
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  min="10000"
                  value={sweepThreshold}
                  onChange={(e) => setSweepThreshold(e.target.value)}
                  className="bg-transparent border-b-2 border-white/20 rounded-none text-white placeholder:text-white/40 focus:border-white text-xl font-light"
                  data-testid="input-threshold"
                />
                <p className="text-xs text-white/50 font-light">
                  Funds above this amount will be automatically swept to FDs. Minimum ₹10,000.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="increment" className="text-white/60 text-xs uppercase tracking-widest font-light">
                  FD Increment Amount (₹)
                </Label>
                <Input
                  id="increment"
                  type="number"
                  min="100"
                  value={fdIncrement}
                  onChange={(e) => setFdIncrement(e.target.value)}
                  className="bg-transparent border-b-2 border-white/20 rounded-none text-white placeholder:text-white/40 focus:border-white text-xl font-light"
                  data-testid="input-increment"
                />
                <p className="text-xs text-white/50 font-light">
                  Each FD unit will be created in this amount. Smaller increments provide better liquidity management.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-4 border-t border-white/10">
            <div className="flex items-center gap-3 pb-4 border-b border-white/10">
              <Zap className="h-6 w-6 text-white" />
              <h2 className="text-xl font-light tracking-wider uppercase">AUTO-SWEEP OPTIONS</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 border border-white/10 bg-white/5">
                <div className="flex-1">
                  <div className="font-light tracking-wider uppercase text-sm">Auto-Sweep Enabled</div>
                  <p className="text-xs text-white/60 font-light mt-1">
                    Automatically move funds to and from FDs based on threshold
                  </p>
                </div>
                <Switch
                  checked={autoSweepEnabled}
                  onCheckedChange={setAutoSweepEnabled}
                  className="data-[state=checked]:bg-white"
                  data-testid="switch-auto-sweep"
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-white/10 bg-white/5">
                <div className="flex-1 flex items-center gap-3">
                  {notificationsEnabled ? (
                    <Bell className="h-5 w-5 text-white/60" />
                  ) : (
                    <BellOff className="h-5 w-5 text-white/60" />
                  )}
                  <div>
                    <div className="font-light tracking-wider uppercase text-sm">Notifications</div>
                    <p className="text-xs text-white/60 font-light mt-1">
                      Get notified about sweep transactions and FD creation
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  className="data-[state=checked]:bg-white"
                  data-testid="switch-notifications"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider flex items-center justify-center gap-2"
              data-testid="button-save-settings"
            >
              <Save className="h-5 w-5" />
              {saving ? "SAVING..." : "SAVE SETTINGS"}
            </Button>
          </div>
        </div>

        <div className="border border-white/30 bg-white/5 p-6 space-y-3">
          <h3 className="font-light uppercase tracking-wider text-sm">CURRENT STATUS</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-white/60">Total Parked: </span>
              <span className="text-white font-light" data-testid="text-total-parked">
                ₹{parseFloat(account.totalParkedAmount || "0").toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-white/60">Interest Earned: </span>
              <span className="text-white font-light" data-testid="text-total-interest">
                ₹{parseFloat(account.totalInterestEarned || "0").toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-white/60">Active FDs: </span>
              <span className="text-white font-light" data-testid="text-active-fds">
                {account.activeFdCount || 0}
              </span>
            </div>
            <div>
              <span className="text-white/60">Interest Rate: </span>
              <span className="text-white font-light" data-testid="text-current-rate">
                {account.currentInterestRate}% p.a.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
