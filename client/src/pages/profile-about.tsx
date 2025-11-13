import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { LoanApplication, LoanDocument } from "@shared/schema";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Shield,
  Download,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  User,
  MapPin,
  CreditCard,
  FileText,
  AlertCircle,
  Eye,
  Trash2,
  Upload,
  Home,
  TrendingUp,
  Edit3
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type LoanWithDocuments = LoanApplication & { 
  documents?: LoanDocument[] 
};

export default function ProfileAbout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [showAllDocuments, setShowAllDocuments] = useState(false);

  // Fetch user's loans to get documents
  const { data: loansData, isLoading: isLoadingLoans, error: loansError } = useQuery<LoanWithDocuments[]>({
    queryKey: ["/api/loans"],
  });
  
  const loans: LoanWithDocuments[] = loansData ?? [];
  const displayedLoans = showAllDocuments ? loans : loans.slice(0, 5);

  const kycData = {
    status: "verified",
    level: "Full KYC",
    verifiedDate: "15 Jan 2024",
    expiryDate: "15 Jan 2027",
    documents: {
      aadhar: { status: "verified", last4: "4521", verified: true },
      pan: { status: "verified", number: "ABCDE1234F", masked: "ABCDE****F", verified: true },
    },
    vpa: user?.email + "@paytm" || "user@paytm",
    linkedBanks: ["HDFC Bank", "ICICI Bank"],
    joinDate: "10 Dec 2023",
    lastActive: "Today, 10:30 AM",
    bio: "Trusted member of the InCred community",
    secondaryPhone: "+91 98765 43211"
  };

  const calculateAge = (dob: string | null | undefined): number | null => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const userAge = calculateAge(user?.dateOfBirth);

  const handleDownloadKYC = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById('kyc-details');
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: '#000000',
        scale: 2,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`KYC_${user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewDocument = (documentUrl: string, documentName: string) => {
    // Open document in new tab
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    }
  };

  const handleDownloadDocument = (documentUrl: string, documentName: string) => {
    // Download document programmatically
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.download = documentName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleRequestUpgrade = () => {
    navigate("/kyc-application");
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="text-center">
            <h1 className="text-base font-bold tracking-wider">ABOUT</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-widest font-light">Identity & KYC details</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/edit-profile")}
            className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
            data-testid="button-edit"
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="pt-20 pb-6 p-4 space-y-6 w-full max-w-screen-lg mx-auto" id="kyc-details">
        {/* KYC Application CTA */}
        <div className="border border-white/20 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 border border-white/20 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-light text-white tracking-wider mb-1">Complete Your KYC</h3>
              <p className="text-sm text-white/60 font-light mb-4">
                Unlock full access to all features by completing your KYC verification process
              </p>
              <Button
                onClick={() => navigate("/kyc-application")}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
                data-testid="button-kyc-application"
              >
                <FileText className="h-4 w-4 mr-2" />
                Start KYC Application
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl p-6">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-20 w-20 border-2 border-white/20">
                <AvatarFallback className="bg-gradient-to-br from-white/10 to-white/5 text-white text-2xl">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  {kycData.status === "verified" && (
                    <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                {kycData.bio && (
                  <p className="text-sm text-white/80 mb-2">{kycData.bio}</p>
                )}
                <p className="text-sm text-white/60 mb-1">Member since {kycData.joinDate}</p>
                <p className="text-xs text-white/40">Last active: {kycData.lastActive}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <Shield className="h-4 w-4 text-white/60 mx-auto mb-1" />
                <p className="text-xs text-white/60">KYC Status</p>
                <p className="text-sm font-semibold text-white">Full KYC</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <CreditCard className="h-4 w-4 text-white/60 mx-auto mb-1" />
                <p className="text-xs text-white/60">Documents</p>
                <p className="text-sm font-semibold text-white">2 Verified</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center">
                <CheckCircle className="h-4 w-4 text-white/60 mx-auto mb-1" />
                <p className="text-xs text-white/60">Validity</p>
                <p className="text-sm font-semibold text-white">3 Years</p>
              </div>
            </div>
        </div>

        {/* KYC Status */}
        <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-white/60" />
                <h3 className="font-semibold">KYC Status</h3>
              </div>
              <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                {kycData.level}
              </Badge>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Verified on</span>
                <span className="text-white font-medium">{kycData.verifiedDate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Valid until</span>
                <span className="text-white font-medium">{kycData.expiryDate}</span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={handleDownloadKYC}
                disabled={isDownloading}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 disabled:opacity-50"
                data-testid="button-download-kyc"
              >
                <Download className="h-3 w-3 mr-2" />
                {isDownloading ? "Generating..." : "Download PDF"}
              </Button>
              <Button
                size="sm"
                onClick={handleRequestUpgrade}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                data-testid="button-upgrade-kyc"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Re-verify
              </Button>
            </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/5 border border-white/10 p-4">
            <h3 className="font-semibold mb-4">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-sm font-medium">Primary Phone</p>
                    <p className="text-xs text-white/60">{user?.phone}</p>
                  </div>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              {kycData.secondaryPhone && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-white/60" />
                    <div>
                      <p className="text-sm font-medium">Secondary Phone</p>
                      <p className="text-xs text-white/60">{kycData.secondaryPhone}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/10 text-white/60 border-0 text-xs">
                    Secondary
                  </Badge>
                </div>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-xs text-white/60">{user?.email}</p>
                  </div>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-sm font-medium">UPI VPA</p>
                    <p className="text-xs text-white/60">{kycData.vpa}</p>
                  </div>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">
                  Primary
                </Badge>
              </div>
            </div>
        </div>

        {/* Government IDs */}
        <div className="bg-white/5 border border-white/10 p-4">
            <h3 className="font-semibold mb-4">Government IDs</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-sm font-medium">Aadhar Card</p>
                    <p className="text-xs text-white/60">**** **** {kycData.documents.aadhar.last4}</p>
                  </div>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-white/60" />
                  <div>
                    <p className="text-sm font-medium">PAN Card</p>
                    <p className="text-xs text-white/60">{kycData.documents.pan.masked}</p>
                  </div>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
            </div>
        </div>

        {/* Personal Details */}
        <div className="bg-white/5 border border-white/10 p-4">
            <h3 className="font-semibold mb-4">Personal Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-white/60">Date of Birth</span>
                <span className="text-sm text-white font-medium">
                  {user?.dateOfBirth || "Not set"}
                  {userAge && <span className="text-white/60"> ({userAge} years)</span>}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/60">Gender</span>
                <span className="text-sm text-white font-medium">{user?.gender || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/60">Marital Status</span>
                <span className="text-sm text-white font-medium">{user?.maritalStatus || "Not set"}</span>
              </div>
            </div>
        </div>

        {/* Credit Score & Financial Health */}
        {user?.creditScore && (
          <div className="bg-white/5 border border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-white/60" />
                  <h3 className="font-semibold">Credit Score</h3>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 rounded-none">
                  Excellent
                </Badge>
              </div>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-white mb-1">
                  {user.creditScore}
                </div>
                <p className="text-sm text-white/60">Out of 900</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Last Updated</span>
                  <span className="text-white font-medium">This Month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Score Impact</span>
                  <span className="text-white font-medium">+15 points</span>
                </div>
              </div>
          </div>
        )}

        {/* Address & Residence */}
        <div className="bg-white/5 border border-white/10 p-4">
            <h3 className="font-semibold mb-4">Address & Residence</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-white/60">Pincode</span>
                <span className="text-sm text-white font-medium">{user?.pincode || "Not set"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/60">Residence Type</span>
                <span className="text-sm text-white font-medium">{user?.residenceType || "Not set"}</span>
              </div>
            </div>
        </div>

        {/* Documents Vault */}
        <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-white/60" />
                <h3 className="font-semibold">Documents Vault</h3>
              </div>
              {!isLoadingLoans && (
                <Badge className="bg-white/10 text-white/80 border-0 text-xs">
                  {loans.reduce((count, loan) => count + (loan.documents?.length || 0), 0)} Files
                </Badge>
              )}
            </div>
            
            {isLoadingLoans ? (
              <div className="text-center py-8">
                <RefreshCw className="h-12 w-12 text-white/20 mx-auto mb-3 animate-spin" />
                <p className="text-sm text-white/60">Loading documents...</p>
              </div>
            ) : loansError ? (
              <div className="text-center py-8">
                <XCircle className="h-12 w-12 text-white/60 mx-auto mb-3" />
                <p className="text-sm text-white/60 mb-1">Failed to load documents</p>
                <p className="text-xs text-white/40">Please try again later</p>
              </div>
            ) : loans.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/60 mb-1">No documents yet</p>
                <p className="text-xs text-white/40">Your uploaded documents will appear here</p>
              </div>
            ) : (
              <div className="space-y-3">
                {displayedLoans.map((loan) => (
                  <div key={loan.id} className="space-y-2">
                    <p className="text-xs text-white/60 font-medium">{loan.loanType} Loan - {loan.applicationNumber}</p>
                    {loan.documents && loan.documents.length > 0 ? (
                      loan.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-none bg-white/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="h-5 w-5 text-white/60" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{doc.documentType}</p>
                              <p className="text-xs text-white/60">{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.isVerified === 1 && (
                              <Badge className="bg-white/10 text-white border-white/20 rounded-none text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDocument(doc.documentUrl, doc.documentName)}
                              className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                              data-testid={`button-view-doc-${idx}`}
                              title="View document"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDownloadDocument(doc.documentUrl, doc.documentName)}
                              className="h-8 w-8 p-0 text-white/60 hover:text-white hover:bg-white/10"
                              data-testid={`button-download-doc-${idx}`}
                              title="Download document"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-white/40 pl-3">No documents uploaded</p>
                    )}
                  </div>
                ))}
                {loans.length > 5 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllDocuments(!showAllDocuments)}
                    className="w-full text-white/60 hover:text-white hover:bg-white/10"
                    data-testid="button-view-all-docs"
                  >
                    {showAllDocuments ? 'Show Less' : `View All ${loans.length} Loans`}
                  </Button>
                )}
              </div>
            )}
        </div>

        {/* Linked Banks */}
        <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Linked Bank Accounts</h3>
              <Badge className="bg-white/10 text-white/80 border-0 text-xs">
                {kycData.linkedBanks.length} Banks
              </Badge>
            </div>
            <div className="space-y-2">
              {kycData.linkedBanks.map((bank, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-white/60" />
                    </div>
                    <span className="text-sm font-medium">{bank}</span>
                  </div>
                  <CheckCircle className="h-4 w-4 text-white/60" />
                </div>
              ))}
            </div>
        </div>

        {/* Info Notice */}
        <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-white/60 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white font-medium mb-1">Identity Security</p>
                <p className="text-xs text-white/60">
                  Your identity helps us secure payments — complete KYC to enable deliveries & higher limits.
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}
