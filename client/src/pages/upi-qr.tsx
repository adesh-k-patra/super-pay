import { useState } from "react";
import { useLocation } from "wouter";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Download, Share2, Copy, CheckCircle } from "lucide-react";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";

export default function UpiQr() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Mock user UPI ID - in a real app, this would come from user profile/auth context
  const userUpiId = "user@hexapay";
  const userName = "HexaPay User";

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(userUpiId);
    setCopied(true);
    toast({
      title: "UPI ID Copied",
      description: "Your UPI ID has been copied to clipboard."
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const svg = document.getElementById("upi-qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = "hexapay-upi-qr.png";
      downloadLink.href = pngFile;
      downloadLink.click();

      toast({
        title: "QR Code Downloaded",
        description: "Your UPI QR code has been saved."
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My UPI QR Code",
          text: `Pay me via UPI: ${userUpiId}`,
        });
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "Unable to share. Your UPI ID has been copied instead.",
          variant: "destructive"
        });
        handleCopyUpiId();
      }
    } else {
      handleCopyUpiId();
    }
  };

  // Generate UPI payment URL for QR code
  const upiUrl = `upi://pay?pa=${userUpiId}&pn=${encodeURIComponent(userName)}&cu=INR`;

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
            data-testid="button-back-upi-qr"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base uppercase tracking-widest font-light">My QR Code</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest">Receive payments</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/upi-scanner")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-camera-scan"
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="pt-20 px-4 space-y-6 w-full max-w-screen-lg mx-auto">
        <div className="border border-white/20 p-6 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-light text-white mb-2 uppercase tracking-wider">Scan & Pay Me</h2>
            <p className="text-xs text-white/60 font-light uppercase tracking-widest">Share this QR code to receive payments</p>
          </div>

          {/* QR Code Display */}
          <div className="bg-white p-6 mx-auto w-fit mb-6">
            <div id="upi-qr-code">
              <QRCode
                value={upiUrl}
                size={256}
                level="H"
                bgColor="#ffffff"
                fgColor="#000000"
              />
            </div>
          </div>

          {/* UPI ID Display */}
          <div className="bg-black/40 border border-white/10 p-4 mb-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-white/60 text-xs font-light uppercase tracking-widest mb-1">UPI ID</p>
                <p className="text-white text-base font-light tracking-wide" data-testid="text-upi-id">{userUpiId}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyUpiId}
                className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                data-testid="button-copy-upi-id"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-white" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleDownloadQr}
              className="h-12 bg-white/10 text-white border border-white/20 hover:bg-white/20 rounded-none font-light tracking-wider"
              data-testid="button-download-qr"
            >
              <Download className="h-4 w-4 mr-2" />
              DOWNLOAD
            </Button>
            <Button
              onClick={handleShare}
              className="h-12 bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
              data-testid="button-share-qr"
            >
              <Share2 className="h-4 w-4 mr-2" />
              SHARE
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
            <p className="text-xs text-white/80 font-light">
              <span className="text-white">How to use:</span>
            </p>
            <ul className="text-xs text-white/60 font-light mt-2 space-y-1 list-disc list-inside">
              <li>Ask the payer to scan this QR code with any UPI app</li>
              <li>They can enter the amount and complete the payment</li>
              <li>You'll receive instant payment notification</li>
            </ul>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
