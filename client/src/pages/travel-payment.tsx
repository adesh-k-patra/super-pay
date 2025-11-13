import { useState } from "react";
import { useLocation } from "wouter";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, CreditCard, Smartphone, Wallet, CheckCircle } from "lucide-react";

export default function TravelPayment() {
  const { goBack } = useNavigationHistory();
  const [, navigate] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/travel-confirmation");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-black border-b border-white/10 p-6">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => goBack()}
            className="border-white/20 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1} />
          </Button>
          <div>
            <h1 className="text-3xl font-light tracking-wider" data-testid="page-title">
              PAYMENT
            </h1>
            <p className="text-white/60 text-xs uppercase tracking-widest font-light">Complete your travel booking payment</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 backdrop-blur-xl rounded-none p-6 mb-6">
              <h2 className="text-white text-lg font-light tracking-wider mb-4">CHOOSE PAYMENT METHOD</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                {/* UPI Payment */}
                <div className="flex items-center space-x-3 p-4 border border-white/20 rounded-none">
                  <RadioGroupItem value="upi" id="upi" />
                  <div className="flex items-center space-x-3 flex-1">
                    <Smartphone className="h-6 w-6 text-white/80" strokeWidth={1} />
                    <div>
                      <Label htmlFor="upi" className="text-white font-light cursor-pointer">
                        UPI Payment
                      </Label>
                      <p className="text-sm text-white/60">Pay using your UPI ID</p>
                    </div>
                  </div>
                </div>

                {/* Credit/Debit Card */}
                <div className="flex items-center space-x-3 p-4 border border-white/20 rounded-none">
                  <RadioGroupItem value="card" id="card" />
                  <div className="flex items-center space-x-3 flex-1">
                    <CreditCard className="h-6 w-6 text-white/80" strokeWidth={1} />
                    <div>
                      <Label htmlFor="card" className="text-white font-light cursor-pointer">
                        Credit/Debit Card
                      </Label>
                      <p className="text-sm text-white/60">Visa, Mastercard, RuPay</p>
                    </div>
                  </div>
                </div>

                {/* Wallet */}
                <div className="flex items-center space-x-3 p-4 border border-white/20 rounded-none">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <div className="flex items-center space-x-3 flex-1">
                    <Wallet className="h-6 w-6 text-white/80" strokeWidth={1} />
                    <div>
                      <Label htmlFor="wallet" className="text-white font-light cursor-pointer">
                        Digital Wallet
                      </Label>
                      <p className="text-sm text-white/60">Paytm, PhonePe, Google Pay</p>
                    </div>
                  </div>
                </div>
              </RadioGroup>

              {/* UPI ID Input */}
              {paymentMethod === "upi" && (
                <div className="mt-6 space-y-2">
                  <Label className="text-white/80 text-xs uppercase tracking-wider">Enter UPI ID</Label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="bg-black border-white/20 text-white rounded-none"
                    data-testid="input-upi-id"
                  />
                </div>
              )}

              {/* Payment Button */}
              <Button
                onClick={handlePayment}
                disabled={isProcessing || (paymentMethod === "upi" && !upiId)}
                className="w-full mt-6 bg-white/10 hover:bg-white/15 text-white rounded-none h-12 text-lg"
                data-testid="button-pay-now"
              >
                {isProcessing ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2 animate-spin" strokeWidth={1} />
                    Processing Payment...
                  </>
                ) : (
                  `Pay ₹4,500`
                )}
              </Button>
            </div>
          </div>

          {/* Booking Summary */}
          <div>
            <div className="bg-white/5 border border-white/10 rounded-none p-6 sticky top-6">
              <h2 className="text-white text-lg font-light tracking-wider mb-4">BOOKING SUMMARY</h2>
              <div className="space-y-4">
                {/* Journey Details */}
                <div className="space-y-2">
                  <p className="text-sm text-white/60 uppercase tracking-wider">Journey</p>
                  <p className="text-white font-light">Mumbai → Delhi</p>
                  <p className="text-sm text-white/60">06:00 - 08:30 • 2h 30m</p>
                </div>

                <Separator className="bg-white/20" />

                {/* Passenger */}
                <div className="space-y-2">
                  <p className="text-sm text-white/60 uppercase tracking-wider">Passenger</p>
                  <p className="text-white">1 Adult</p>
                </div>

                <Separator className="bg-white/20" />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-white">
                    <span>Base fare</span>
                    <span>₹3,800</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Taxes & fees</span>
                    <span>₹700</span>
                  </div>
                  <Separator className="bg-white/20" />
                  <div className="flex justify-between text-xl font-light text-white">
                    <span>Total</span>
                    <span>₹4,500</span>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="mt-6 p-3 bg-white/5 border border-blue-400/20 rounded-none">
                  <p className="text-xs text-white/80">
                    🔒 Your payment is secured with 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
