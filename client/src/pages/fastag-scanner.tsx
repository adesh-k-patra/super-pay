import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, QrCode, Upload, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function FastagScanner() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const scanQrMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('qrImage', file);
      return apiRequest('/api/fastag/scan', 'POST', formData);
    },
    onSuccess: (data: any) => {
      setIsProcessing(false);
      setScannedData(data.fastagData);
      toast({
        title: "QR Code Scanned Successfully",
        description: "FASTag details extracted from QR code."
      });
      navigate(`/fastag?fastagId=${encodeURIComponent(data.fastagData?.fastagId || '')}`);
    },
    onError: () => {
      setIsProcessing(false);
      toast({
        title: "Scan Failed",
        description: "Unable to read FASTag QR code. Please try again.",
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
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between py-6 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/fastag")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold tracking-wider uppercase">Scan FASTag QR</h1>
          </div>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="bg-white/5 border border-white/10 rounded-none p-6 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-white/10 border bg-white/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <QrCode className="h-8 w-8 bg-white/10" />
            </div>
            <h2 className="text-xl font-bold text-white">Scan FASTag QR Code</h2>
            <p className="text-white/60 text-sm mt-2">Scan to recharge or view FASTag details</p>
          </div>

          <div className="space-y-4">
            <div className="aspect-square bg-white/5 border-2 border-dashed border-white/20 rounded-lg flex items-center justify-center">
              {(isProcessing || scanQrMutation.isPending) ? (
                <div className="text-center">
                  <Loader2 className="h-16 w-16 bg-white/10 mx-auto mb-2 animate-spin" />
                  <p className="text-white/60 text-sm">Processing QR code...</p>
                </div>
              ) : scannedData ? (
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 bg-white/10 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">QR code scanned successfully</p>
                  <p className="text-white/40 text-xs mt-1">Redirecting...</p>
                </div>
              ) : (
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-white/40 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">Upload QR code image</p>
                  <p className="text-white/40 text-xs mt-1">JPG, PNG supported</p>
                </div>
              )}
            </div>

            <Button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white text-black hover:bg-white/90 rounded-none"
              data-testid="button-upload-qr"
              disabled={isProcessing || scanQrMutation.isPending}
            >
              {scanQrMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload QR Code
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
            <div className="mt-6 p-4 bg-white/10 border bg-white/10 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 bg-white/10 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="bg-white/10 text-sm font-medium">QR Code Scanned</p>
                  <p className="text-white/60 text-xs mt-1">FASTag details extracted successfully</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-white/40 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-white/60">
                  <span className="font-medium text-white/80">Supported formats:</span> JPG, PNG, WEBP images up to 5MB.
                </p>
                <p className="text-xs text-white/60 mt-1">
                  Ensure QR code is clear and well-lit for best results.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-6 space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              Where to find FASTag QR?
            </h3>
            <ul className="space-y-2 text-xs text-white/60">
              <li className="flex items-start gap-2">
                <span className="bg-white/10 mt-0.5">•</span>
                <span>On your vehicle's windshield FASTag sticker</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-white/10 mt-0.5">•</span>
                <span>In your FASTag welcome kit or documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-white/10 mt-0.5">•</span>
                <span>On recharge receipts or transaction records</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
