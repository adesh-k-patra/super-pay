import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, QrCode, Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function UpiScanner() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const scanQrMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('qrImage', file);
      return apiRequest('/api/upi/scan', 'POST', formData);
    },
    onSuccess: (data: any) => {
      setIsProcessing(false);
      setScannedData(data.upiData);
      toast({
        title: "QR Code Scanned Successfully",
        description: "UPI payment details extracted from QR code."
      });
      navigate(`/upi-payment?upiId=${encodeURIComponent(data.upiData?.upiId || '')}&amount=${data.upiData?.amount || ''}`);
    },
    onError: () => {
      setIsProcessing(false);
      toast({
        title: "Scan Failed",
        description: "Unable to read QR code. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File Type",
        description: "Please select an image file (JPG, PNG, etc.).",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    scanQrMutation.mutate(file);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/home")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back-upi-scanner"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base uppercase tracking-widest font-light">Scan QR Code</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Scan and pay instantly</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/upi-qr")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-show-qr"
          >
            <QrCode className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 border border-white/20 rounded-2xl p-4">
                <QrCode className="h-12 w-12 text-white/80" />
              </div>
            </div>
            <h2 className="text-xl font-light text-white mb-2 uppercase tracking-wider">Scan & Pay</h2>
            <p className="text-xs text-white/60 font-light uppercase tracking-widest">Upload QR code to make instant payments</p>
          </div>

          <div className="space-y-4">
            <div className="aspect-square bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-sm">
              {(isProcessing || scanQrMutation.isPending) ? (
                <div className="text-center">
                  <Loader2 className="h-16 w-16 text-white/80 mx-auto mb-3 animate-spin" />
                  <p className="text-white/60 text-sm font-light">Processing QR code...</p>
                </div>
              ) : scannedData ? (
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-white/80 mx-auto mb-3" />
                  <p className="text-white/60 text-sm font-light">QR code scanned successfully</p>
                  <p className="text-white/40 text-xs font-light mt-1">Redirecting to payment...</p>
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60 text-sm font-light">Upload QR code image</p>
                  <p className="text-white/40 text-xs font-light mt-1">JPG, PNG supported</p>
                </div>
              )}
            </div>

            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
              data-testid="button-upload-qr"
              disabled={isProcessing || scanQrMutation.isPending}
            >
              {scanQrMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              UPLOAD QR CODE
            </Button>

            <Input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileUpload}
              className="hidden"
              data-testid="input-qr-file"
            />
          </div>

          {scannedData && (
            <div className="mt-6 bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-white/80 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-white/80 text-sm font-light">QR Code Scanned</p>
                  <p className="text-white/80/70 text-xs font-light mt-1">Payment details extracted successfully</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 bg-black/40 border border-white/10 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-white/60 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-white/60 font-light">
                  <span className="text-white/80">Supported formats:</span> JPG, PNG, WEBP images up to 5MB.
                </p>
                <p className="text-xs text-white/60 font-light mt-1">
                  Ensure QR code is clear and well-lit for best results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
