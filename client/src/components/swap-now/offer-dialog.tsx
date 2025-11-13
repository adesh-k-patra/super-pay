import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { IndianRupee } from "lucide-react";

interface OfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  listingPrice: string;
  listingTitle: string;
  onOfferSent?: () => void;
}

export function OfferDialog({ 
  open, 
  onOpenChange, 
  listingId, 
  listingPrice,
  listingTitle,
  onOfferSent 
}: OfferDialogProps) {
  const { toast } = useToast();
  const [offerAmount, setOfferAmount] = useState("");
  const [offerNote, setOfferNote] = useState("");

  const sendOfferMutation = useMutation({
    mutationFn: async (data: { offerAmount: number; note: string }) => {
      return await apiRequest("POST", `/api/swap-now/offers`, {
        listingId,
        offerAmount: data.offerAmount,
        note: data.note,
      });
    },
    onSuccess: () => {
      toast({
        title: "Offer Sent",
        description: "Your offer has been sent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/swap-now/conversations'] });
      setOfferAmount("");
      setOfferNote("");
      onOpenChange(false);
      if (onOfferSent) {
        onOfferSent();
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send offer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitOffer = () => {
    if (!offerAmount || parseFloat(offerAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid offer amount",
        variant: "destructive",
      });
      return;
    }

    sendOfferMutation.mutate({
      offerAmount: parseFloat(offerAmount),
      note: offerNote,
    });
  };

  const listingPriceNum = parseFloat(listingPrice);
  const offerAmountNum = offerAmount ? parseFloat(offerAmount) : 0;
  const discount = offerAmountNum > 0 ? ((listingPriceNum - offerAmountNum) / listingPriceNum * 100).toFixed(1) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black border border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Make an Offer</DialogTitle>
          <DialogDescription className="text-xs text-white/60">
            Negotiate Price for {listingTitle.substring(0, 40)}...
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Price Display */}
          <div className="bg-white/5 border border-white/10 p-3">
            <div className="text-xs text-white/60 mb-1">Listed Price</div>
            <div className="text-xl font-bold">
              ₹{listingPriceNum.toLocaleString('en-IN')}
            </div>
          </div>

          {/* Offer Amount Input */}
          <div className="space-y-2">
            <label className="text-xs text-white/80 uppercase tracking-wider font-semibold">
              Your Offer Amount
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60">
                <IndianRupee className="h-4 w-4" />
              </div>
              <Input
                type="number"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                placeholder="Enter your offer"
                className="bg-white/10 border-white/20 text-white pl-10 rounded-none text-base h-12"
                data-testid="input-offer-amount"
              />
            </div>
            {offerAmountNum > 0 && offerAmountNum < listingPriceNum && (
              <div className="text-xs text-green-400">
                {discount}% below asking price
              </div>
            )}
            {offerAmountNum >= listingPriceNum && (
              <div className="text-xs text-orange-400">
                Your offer is at or above the listing price
              </div>
            )}
          </div>

          {/* Optional Note */}
          <div className="space-y-2">
            <label className="text-xs text-white/80 uppercase tracking-wider font-semibold">
              Message (Optional)
            </label>
            <Textarea
              value={offerNote}
              onChange={(e) => setOfferNote(e.target.value)}
              placeholder="Add a note to explain your offer..."
              className="bg-white/10 border-white/20 text-white rounded-none text-sm min-h-[80px]"
              data-testid="input-offer-note"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => onOpenChange(false)}
            variant="ghost"
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-none h-11"
            data-testid="button-cancel-offer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmitOffer}
            disabled={sendOfferMutation.isPending || !offerAmount}
            className="flex-1 bg-white text-black hover:bg-white/90 rounded-none h-11 font-semibold"
            data-testid="button-send-offer"
          >
            {sendOfferMutation.isPending ? "Sending..." : "Send Offer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
