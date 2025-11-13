import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useUrlTab } from "@/hooks/use-url-tab";
import { PiggyBank, ArrowLeft, Info, Plus, TrendingUp, DollarSign, Wallet, ChevronRight, Shield, History, Coins, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { CashParkAccount, CashParkJar } from "@shared/schema";

export default function CashPark() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [showActivationDialog, setShowActivationDialog] = useState(false);
  const [showCreateJarDialog, setShowCreateJarDialog] = useState(false);
  const [jarName, setJarName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [activating, setActivating] = useState(false);
  const [creating, setCreating] = useState(false);
  const [upiPin, setUpiPin] = useState<string[]>(Array(6).fill(""));
  const [selectedTab, setSelectedTab] = useUrlTab("jars");

  const { data: accountData, isLoading: accountLoading } = useQuery<{ account: CashParkAccount | null }>({
    queryKey: ["/api/cash-park/account"],
  });

  const { data: jarsData } = useQuery<{ jars: CashParkJar[] }>({
    queryKey: ["/api/cash-park/jars"],
    enabled: !!accountData?.account,
  });

  const account = accountData?.account;
  const jars = jarsData?.jars || [];

  const totalBalance = jars.reduce((sum, jar) => sum + parseFloat(jar.currentBalance || "0"), 0);
  const totalInterestEarned = parseFloat(account?.totalInterestEarned || "0");

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...upiPin];
      newPin[index] = value;
      setUpiPin(newPin);

      if (value && index < 5) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !upiPin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleActivate = async () => {
    const pinString = upiPin.join("");
    
    if (pinString.length !== 6 || !/^\d+$/.test(pinString)) {
      toast({
        title: "Invalid PIN",
        description: "Please enter a valid 6-digit UPI PIN",
        variant: "destructive",
      });
      return;
    }

    setActivating(true);
    try {
      const response = await apiRequest("POST", "/api/cash-park/activate", { 
        initialJarName: "My Savings",
        upiPin: pinString
      });
      const result = await response.json();

      if (!result.success) {
        toast({
          title: "Activation Failed",
          description: result.message || "Failed to activate Cash Park",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Cash Park activated successfully!",
      });
      
      await queryClient.invalidateQueries({ queryKey: ["/api/cash-park/account"] });
      await queryClient.invalidateQueries({ queryKey: ["/api/cash-park/jars"] });
      
      const dummyJars = [
        { name: "Emergency Fund", goalAmount: 100000, currentBalance: 50000 },
        { name: "Vacation", goalAmount: 50000, currentBalance: 35000 },
        { name: "Wedding", goalAmount: 200000, currentBalance: 80000 }
      ];
      
      for (const dummyJar of dummyJars) {
        await apiRequest("POST", "/api/cash-park/jars/create", dummyJar);
      }
      
      await queryClient.invalidateQueries({ queryKey: ["/api/cash-park/jars"] });
      
      setShowActivationDialog(false);
      setUpiPin(Array(6).fill(""));
      
      navigate("/cash-park");
    } catch (error: any) {
      toast({
        title: "Activation Failed",
        description: error.message || "Failed to activate Cash Park",
        variant: "destructive",
      });
    } finally {
      setActivating(false);
    }
  };

  const handleCreateJar = async () => {
    if (!jarName.trim()) {
      toast({
        title: "Invalid Name",
        description: "Please enter a jar name",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const response = await apiRequest("POST", "/api/cash-park/jars/create", { 
        name: jarName.trim(),
        goalAmount: goalAmount ? parseFloat(goalAmount) : undefined,
      });
      const result = await response.json();

      if (!result.success) {
        toast({
          title: "Creation Failed",
          description: result.message || "Failed to create jar",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: `Jar "${jarName}" created successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cash-park/jars"] });
      setShowCreateJarDialog(false);
      setJarName("");
      setGoalAmount("");
      
      if (result.jar?.id) {
        navigate(`/cash-park/jar/${result.jar.id}`);
      }
    } catch (error: any) {
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create jar",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  if (accountLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p className="text-white/60 font-light text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-black text-white pb-32">
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between py-4 px-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/home")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-base font-bold tracking-wider">CASH PARK</h1>
              <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Auto-Sweep Savings</p>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
          {/* Welcome Icon */}
          <div className="text-center py-6">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <PiggyBank className="h-10 w-10 text-white" strokeWidth={1} />
              </div>
            </div>
            <h2 className="text-2xl font-light tracking-wide text-white mb-2">
              Cash Park
            </h2>
            <p className="text-white/50 text-sm font-light">
              High-yield auto-sweep savings
            </p>
          </div>

          {/* Key Features Grid */}
          <div className="bg-white/5 border border-white/10 p-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Interest Rate</p>
                </div>
                <p className="text-lg font-light text-white">7.25%</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Savings Jars</p>
                </div>
                <p className="text-lg font-light text-white">Multiple</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-white/40" />
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Liquidity</p>
                </div>
                <p className="text-lg font-light text-white">100%</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-white/60 font-light">Key Benefits</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <p className="text-white font-light text-sm">Earn 7.25% annual interest</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <p className="text-white font-light text-sm">100% liquidity - withdraw anytime</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <p className="text-white font-light text-sm">No lock-in or penalties</p>
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <p className="text-white font-light text-sm">Organize with multiple jars</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog open={showActivationDialog} onOpenChange={setShowActivationDialog}>
          <DialogContent className="bg-black border-white/20 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-light tracking-wider text-center">SET YOUR CASH PARK PIN</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              <div className="text-center space-y-2">
                <p className="text-xs text-white/60 font-light uppercase tracking-widest flex items-center justify-center gap-2">
                  <Shield className="h-3 w-3" />
                  Enter 6-Digit UPI PIN
                </p>
                <p className="text-white/40 text-xs font-light">
                  This PIN will be used to secure your Cash Park
                </p>
              </div>
              
              <div className="flex justify-center gap-3">
                {upiPin.map((digit, index) => (
                  <Input
                    key={index}
                    id={`pin-${index}`}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-light bg-white/10 border-white/20 rounded-none focus:border-white"
                    data-testid={`pin-input-${index}`}
                  />
                ))}
              </div>

              <Button
                onClick={handleActivate}
                disabled={activating}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 text-base font-light tracking-wider"
                data-testid="button-confirm-activate"
              >
                {activating ? "ACTIVATING..." : "ACTIVATE NOW"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-4 z-40">
          <Button 
            onClick={() => setShowActivationDialog(true)}
            className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 text-base font-light tracking-wider"
            data-testid="button-activate"
          >
            ACTIVATE NOW
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-40">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">CASH PARK</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Your Savings</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate("/cash-park/info")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-info"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-8 w-full max-w-screen-lg mx-auto">
        {/* Total Savings - Prominent */}
        <div className="bg-white/5 border border-white/10 p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Total Savings</p>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-green-400" />
              <span className="text-xs text-green-400">7.25% p.a.</span>
            </div>
          </div>
          <p className="text-3xl font-light text-white" data-testid="text-total-balance">
            ₹{totalBalance.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="h-4 w-4 text-white/40" />
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Jars</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3">
              <p className="text-lg font-light text-white">{jars.length}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-white/40" />
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Interest</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3">
              <p className="text-lg font-light text-white">
                ₹{totalInterestEarned.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-white/40" />
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">Status</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-3">
              <p className="text-lg font-light text-white">Active</p>
            </div>
          </div>
        </div>

        {/* Jars Section */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-widest text-white/60 font-light">My Jars</h3>
            <Button
              onClick={() => setShowCreateJarDialog(true)}
              className="bg-white text-black hover:bg-white/90 rounded-none h-9 text-xs tracking-wider"
              data-testid="button-create-jar"
            >
              <Plus className="h-4 w-4 mr-1" />
              NEW JAR
            </Button>
          </div>

          {jars.length === 0 ? (
            <div className="border border-white/10 p-12 text-center bg-white/5">
              <PiggyBank className="h-12 w-12 text-white/30 mx-auto mb-4" strokeWidth={1} />
              <p className="text-white/50 mb-1">No jars yet</p>
              <p className="text-sm text-white/40">Create your first savings jar</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {jars.map((jar) => {
                const balance = parseFloat(jar.currentBalance || "0");
                const goal = parseFloat(jar.goalAmount || "0");
                const progress = goal > 0 ? (balance / goal) * 100 : 0;

                return (
                  <button
                    key={jar.id}
                    onClick={() => navigate(`/cash-park/jar/${jar.id}`)}
                    className="group relative bg-gradient-to-br from-white/5 to-black border border-white/10 hover:border-white/25 transition-all duration-300 hover:scale-[1.02] text-left overflow-hidden"
                    data-testid={`jar-${jar.id}`}
                  >
                    <div className="p-4">
                      {/* Header with Name and Progress */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xs font-semibold text-white/90 tracking-widest uppercase mb-1">
                            {jar.name}
                          </h3>
                          {goal > 0 && (
                            <div className="text-[10px] text-white/50 uppercase tracking-wider">
                              {Math.round(progress)}% Complete
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Glass Jar Visualization */}
                      <div className="relative my-4">
                        {/* Jar Container with Glass Effect */}
                        <div className="relative h-36 rounded-sm overflow-hidden">
                          {/* Inner Container - Glass jar */}
                          <div className="absolute inset-0 border-2 border-white/20 rounded-sm bg-gradient-to-br from-white/5 to-transparent">
                            {/* Progress Tick Marks */}
                            <div className="absolute inset-y-0 right-0 w-px flex flex-col justify-between py-2">
                              <div className="h-px w-2 bg-white/20" />
                              <div className="h-px w-2 bg-white/20" />
                              <div className="h-px w-2 bg-white/20" />
                              <div className="h-px w-2 bg-white/20" />
                            </div>

                            {/* Liquid Fill */}
                            <div className="absolute inset-0 overflow-hidden">
                              <div 
                                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/30 via-white/25 to-white/15 transition-all duration-500 ease-out"
                                style={{ height: `${Math.min(progress, 100)}%` }}
                              >
                                {/* Liquid Surface Highlight */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/40" />
                              </div>
                            </div>

                            {/* Top Lid/Cap */}
                            <div className="absolute -top-px left-0 right-0 h-2 bg-gradient-to-b from-white/30 to-transparent" />
                            
                            {/* Base Shadow */}
                            <div className="absolute -bottom-px left-0 right-0 h-1 bg-gradient-to-t from-black/40 to-transparent" />
                          </div>
                        </div>
                      </div>

                      {/* Stats Below Jar */}
                      <div className="space-y-2">
                        {/* Saved Amount - Primary */}
                        <div>
                          <div className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Saved</div>
                          <div className="text-2xl font-light text-white tracking-tight">
                            ₹{balance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                        
                        {/* Goal Amount - Secondary */}
                        {goal > 0 && (
                          <div className="flex items-center justify-between pt-1 border-t border-white/10">
                            <span className="text-[9px] text-white/40 uppercase tracking-widest">Target</span>
                            <span className="text-sm font-light text-white/60">
                              ₹{goal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 p-4">
        <div className="grid grid-cols-2 gap-3 max-w-screen-lg mx-auto">
          <Button
            onClick={() => navigate("/cash-park/transactions")}
            className="bg-white text-black hover:bg-white/90 h-12 font-light tracking-wide rounded-none"
            data-testid="button-transactions"
          >
            <History className="h-4 w-4 mr-1" />
            Transactions
          </Button>
          <Button
            onClick={() => navigate("/cash-park/settings")}
            className="bg-black text-white border border-white/20 hover:bg-white/5 h-12 font-light tracking-wide rounded-none"
            data-testid="button-settings"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Create Jar Dialog */}
      <Dialog open={showCreateJarDialog} onOpenChange={setShowCreateJarDialog}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wider">CREATE NEW JAR</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Jar Name</Label>
              <Input
                value={jarName}
                onChange={(e) => setJarName(e.target.value)}
                placeholder="e.g., Emergency Fund"
                className="bg-white/10 border-white/20 text-white rounded-none"
                data-testid="input-jar-name"
              />
            </div>
            <div>
              <Label className="text-white/60 text-xs uppercase tracking-widest mb-2 block">Goal Amount (Optional)</Label>
              <Input
                type="number"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                placeholder="e.g., 50000"
                className="bg-white/10 border-white/20 text-white rounded-none"
                data-testid="input-goal-amount"
              />
            </div>
            <Button
              onClick={handleCreateJar}
              disabled={creating || !jarName.trim()}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none h-12 font-light tracking-wider"
              data-testid="button-confirm-create"
            >
              {creating ? "CREATING..." : "CREATE JAR"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
