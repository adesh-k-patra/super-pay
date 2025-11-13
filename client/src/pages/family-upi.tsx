import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { FamilyUpiAccount, FamilyUpiMember } from "@shared/schema";
import { 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  ArrowLeft, 
  UserPlus, 
  Shield,
  Eye,
  CreditCard,
  ChevronRight,
  X,
  Check,
  QrCode,
  Scan,
  Info
} from "lucide-react";
import QRCode from "react-qr-code";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FamilyUpi() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<FamilyUpiAccount | null>(null);
  const [selectedMember, setSelectedMember] = useState<FamilyUpiMember | null>(null);
  const [deleteMemberDialogOpen, setDeleteMemberDialogOpen] = useState(false);
  const [scanQrDialogOpen, setScanQrDialogOpen] = useState(false);
  const [receiveQrDialogOpen, setReceiveQrDialogOpen] = useState(false);
  const [selectedAccountForQr, setSelectedAccountForQr] = useState<FamilyUpiAccount | null>(null);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);

  const [newMemberData, setNewMemberData] = useState({
    memberName: "",
    memberPhone: "",
    relationship: "other",
    role: "member",
    spendingLimit: "",
    canApprove: 0,
    canView: 1
  });


  // Fetch family UPI accounts
  const { data: familyAccounts = [], isLoading } = useQuery<FamilyUpiAccount[]>({
    queryKey: ['/api/family-upi/accounts'],
    enabled: isAuthenticated,
  });

  // Fetch members for selected account
  const { data: accountMembers = [] } = useQuery<FamilyUpiMember[]>({
    queryKey: ['/api/family-upi/members', selectedAccount?.id],
    queryFn: async () => {
      if (!selectedAccount?.id) return [];
      const response = await fetch(`/api/family-upi/members/${selectedAccount.id}`);
      if (!response.ok) throw new Error('Failed to fetch members');
      return response.json();
    },
    enabled: !!selectedAccount?.id,
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/family-upi/accounts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/family-upi/accounts'] });
      setDeleteDialogOpen(false);
      setSelectedAccount(null);
      toast({
        title: "Deleted",
        description: "Family UPI account deleted successfully",
      });
    }
  });

  // Create member mutation
  const createMemberMutation = useMutation({
    mutationFn: async (data: typeof newMemberData & { familyAccountId: string }) => {
      return await apiRequest('POST', '/api/family-upi/members', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/family-upi/members', selectedAccount?.id] });
      setMemberDialogOpen(false);
      setNewMemberData({
        memberName: "",
        memberPhone: "",
        relationship: "other",
        role: "member",
        spendingLimit: "",
        canApprove: 0,
        canView: 1
      });
      toast({
        title: "Member Added",
        description: "Family member added successfully",
      });
    }
  });

  // Delete member mutation
  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/family-upi/members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/family-upi/members', selectedAccount?.id] });
      setDeleteMemberDialogOpen(false);
      setSelectedMember(null);
      toast({
        title: "Removed",
        description: "Member removed successfully",
      });
    }
  });

  const canCreateNewAccount = familyAccounts.length < 3;

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-none animate-spin mx-auto mb-4"></div>
          <p className="text-white/60 font-light tracking-wider">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-white/10">
        <div className="flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="text-white hover:bg-white/10 p-2 h-10 w-10 rounded-none"
              data-testid="button-back"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold tracking-wider">Family UPI</h1>
              <p className="text-xs text-white/50 font-light tracking-wider">Shared Account Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/family-upi/info")}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
              data-testid="button-family-upi-info"
            >
              <Info className="h-5 w-5" />
            </Button>
            <Badge className="bg-white/10 text-white border-white/20 rounded-none font-light">
              {familyAccounts.length}/3 Accounts
            </Badge>
          </div>
        </div>
      </div>

      <div className="pt-24 px-4 space-y-6">
        {/* Accounts List */}
        {familyAccounts.length === 0 ? (
          <div className="border border-white/10 rounded-none p-12 text-center bg-white/5">
            <Users className="h-16 w-16 text-white/30 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-lg font-medium text-white mb-2">No Family Accounts</h3>
            <p className="text-white/50 mb-6 text-sm font-light">Create your first family UPI account to get started</p>
            <Button
              onClick={() => navigate("/family-upi/create")}
              className="bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
              data-testid="button-create-first-account"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-white/60 font-light">Your Family Accounts</h2>
            {familyAccounts.map((account) => (
              <div
                key={account.id}
                className="border border-white/20 bg-black/60 backdrop-blur-xl overflow-hidden"
                data-testid={`card-family-account-${account.id}`}
              >
                {/* Card Header - Clickable */}
                <div 
                  className="p-6 cursor-pointer hover:bg-white/5 transition-all"
                  onClick={() => navigate(`/family-upi/detail/${account.id}`)}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white tracking-wide mb-2" data-testid={`text-account-name-${account.id}`}>
                        {account.familyName}
                      </h3>
                      <p className="text-xs text-white/50 font-light tracking-wider" data-testid={`text-upi-id-${account.id}`}>
                        {account.upiId}
                      </p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAccountForQr(account);
                        setReceiveQrDialogOpen(true);
                      }}
                      className="bg-white/10 hover:bg-white/20 border border-white/30 text-white p-4 rounded-none"
                      data-testid={`button-receive-qr-${account.id}`}
                    >
                      <QrCode className="h-8 w-8" />
                    </Button>
                  </div>

                  {/* Account Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/80 border border-white/10 p-4">
                      <p className="text-xs text-white/40 mb-1 font-light uppercase tracking-widest">Bank</p>
                      <p className="text-sm text-white font-light">{account.bankName}</p>
                    </div>
                    <div className="bg-black/80 border border-white/10 p-4">
                      <p className="text-xs text-white/40 mb-1 font-light uppercase tracking-widest">Account</p>
                      <p className="text-sm text-white font-light">****{account.accountNumber?.slice(-4) || account.accountNumber}</p>
                    </div>
                    <div className="bg-black/80 border border-white/10 p-4">
                      <p className="text-xs text-white/40 mb-1 font-light uppercase tracking-widest">Daily Limit</p>
                      <p className="text-sm text-white font-light">{formatCurrency(account.dailyLimit || "0")}</p>
                    </div>
                    <div className="bg-black/80 border border-white/10 p-4">
                      <p className="text-xs text-white/40 mb-1 font-light uppercase tracking-widest">Monthly Limit</p>
                      <p className="text-sm text-white font-light">{formatCurrency(account.monthlyLimit || "0")}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar - Non-clickable */}
                <div className="border-t border-white/10 px-6 py-4 bg-black/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-white/60" strokeWidth={1} />
                    <span className="text-sm text-white/80 font-light">
                      {account.memberCount} {account.memberCount === 1 ? 'Member' : 'Members'}
                    </span>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAccountForQr(account);
                      setScanQrDialogOpen(true);
                    }}
                    className="bg-white text-black hover:bg-white/90 h-12 px-6 rounded-none font-light tracking-wider"
                    data-testid={`button-scan-qr-${account.id}`}
                  >
                    <Scan className="h-5 w-5 mr-2" />
                    SCAN
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Max Accounts Info */}
        {!canCreateNewAccount && (
          <div className="border border-white/20 p-4 bg-white/5">
            <p className="text-xs text-white/60 text-center font-light">
              You have reached the maximum limit of 3 family UPI accounts
            </p>
          </div>
        )}
      </div>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-black border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-semibold">Delete Family UPI Account?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 font-light">
              This will permanently delete this family UPI account and all associated members. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10 rounded-none font-light">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedAccount && deleteAccountMutation.mutate(selectedAccount.id)}
              className="bg-white text-black hover:bg-white/90 rounded-none font-light"
              data-testid="button-confirm-delete"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Member Dialog */}
      <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-semibold tracking-wide">Add Family Member</DialogTitle>
            <DialogDescription className="text-white/60 text-sm font-light">
              Add a member to {selectedAccount?.familyName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs text-white/60 mb-2 block font-light uppercase tracking-wider">Member Name</label>
              <Input
                value={newMemberData.memberName}
                onChange={(e) => setNewMemberData({ ...newMemberData, memberName: e.target.value })}
                placeholder="e.g., John Doe"
                className="bg-white/5 border-white/20 text-white rounded-none font-light"
                data-testid="input-member-name"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-2 block font-light uppercase tracking-wider">Phone Number (Optional)</label>
              <Input
                value={newMemberData.memberPhone}
                onChange={(e) => setNewMemberData({ ...newMemberData, memberPhone: e.target.value })}
                placeholder="9876543210"
                className="bg-white/5 border-white/20 text-white rounded-none font-light"
                data-testid="input-member-phone"
              />
            </div>
            <div>
              <label className="text-xs text-white/60 mb-2 block font-light uppercase tracking-wider">Relationship</label>
              <select
                value={newMemberData.relationship}
                onChange={(e) => setNewMemberData({ ...newMemberData, relationship: e.target.value })}
                className="w-full bg-white/5 border border-white/20 text-white rounded-none p-3 font-light"
                data-testid="select-relationship"
              >
                <option value="spouse">Spouse</option>
                <option value="parent">Parent</option>
                <option value="child">Child</option>
                <option value="sibling">Sibling</option>
                <option value="guardian">Guardian</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/60 mb-2 block font-light uppercase tracking-wider">Role</label>
              <select
                value={newMemberData.role}
                onChange={(e) => setNewMemberData({ ...newMemberData, role: e.target.value })}
                className="w-full bg-white/5 border border-white/20 text-white rounded-none p-3 font-light"
                data-testid="select-role"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/60 mb-2 block font-light uppercase tracking-wider">Spending Limit (Optional)</label>
              <Input
                value={newMemberData.spendingLimit}
                onChange={(e) => setNewMemberData({ ...newMemberData, spendingLimit: e.target.value })}
                placeholder="50000"
                type="number"
                className="bg-white/5 border-white/20 text-white rounded-none font-light"
                data-testid="input-spending-limit"
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-white font-light">
                <input
                  type="checkbox"
                  checked={newMemberData.canApprove === 1}
                  onChange={(e) => setNewMemberData({ ...newMemberData, canApprove: e.target.checked ? 1 : 0 })}
                  className="bg-white/5 border-white/20 rounded-none"
                  data-testid="checkbox-can-approve"
                />
                Can Approve
              </label>
              <label className="flex items-center gap-2 text-sm text-white font-light">
                <input
                  type="checkbox"
                  checked={newMemberData.canView === 1}
                  onChange={(e) => setNewMemberData({ ...newMemberData, canView: e.target.checked ? 1 : 0 })}
                  className="bg-white/5 border-white/20 rounded-none"
                  data-testid="checkbox-can-view"
                />
                Can View
              </label>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setMemberDialogOpen(false);
                  setNewMemberData({
                    memberName: "",
                    memberPhone: "",
                    relationship: "other",
                    role: "member",
                    spendingLimit: "",
                    canApprove: 0,
                    canView: 1
                  });
                }}
                className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none font-light"
                data-testid="button-cancel-add-member"
              >
                Cancel
              </Button>
              <Button
                onClick={() => selectedAccount && createMemberMutation.mutate({ 
                  ...newMemberData, 
                  familyAccountId: selectedAccount.id 
                })}
                disabled={createMemberMutation.isPending || !newMemberData.memberName}
                className="flex-1 bg-white text-black hover:bg-white/90 rounded-none font-light"
                data-testid="button-confirm-add-member"
              >
                {createMemberMutation.isPending ? "Adding..." : "Add Member"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Member Dialog */}
      <AlertDialog open={deleteMemberDialogOpen} onOpenChange={setDeleteMemberDialogOpen}>
        <AlertDialogContent className="bg-black border-white/20 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white font-semibold">Remove Family Member?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 font-light">
              This will remove {selectedMember?.memberName} from the family UPI account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10 rounded-none font-light">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMember && deleteMemberMutation.mutate(selectedMember.id)}
              className="bg-white text-black hover:bg-white/90 rounded-none font-light"
              data-testid="button-confirm-delete-member"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Scan QR Code Dialog */}
      <Dialog open={scanQrDialogOpen} onOpenChange={setScanQrDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-semibold tracking-wide">Scan QR to Pay</DialogTitle>
            <DialogDescription className="text-white/60 text-sm font-light">
              Upload or scan a QR code to make payment from {selectedAccountForQr?.familyName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="aspect-square bg-black/40 border border-white/10 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <Scan className="h-16 w-16 text-white/40 mx-auto mb-3" />
                <p className="text-white/60 text-sm font-light">Upload QR code image</p>
                <p className="text-white/40 text-xs font-light mt-1">JPG, PNG supported</p>
              </div>
            </div>
            <Button 
              onClick={() => {
                setScanQrDialogOpen(false);
                navigate('/upi-scanner');
              }}
              className="w-full h-12 bg-white text-black hover:bg-white/90 rounded-none font-light tracking-wider"
              data-testid="button-upload-qr-scan"
            >
              <Scan className="h-4 w-4 mr-2" />
              SCAN QR CODE
            </Button>
            <p className="text-xs text-white/40 text-center font-light">
              This will redirect you to the QR scanner page
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receive Payment QR Dialog */}
      <Dialog open={receiveQrDialogOpen} onOpenChange={setReceiveQrDialogOpen}>
        <DialogContent className="bg-black border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white font-semibold tracking-wide">Receive Payment</DialogTitle>
            <DialogDescription className="text-white/60 text-sm font-light">
              Share this QR code to receive payment on {selectedAccountForQr?.familyName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {selectedAccountForQr && (
              <>
                <div className="bg-white p-6 mx-auto w-fit">
                  <QRCode
                    value={`upi://pay?pa=${selectedAccountForQr.upiId}&pn=${encodeURIComponent(selectedAccountForQr.familyName)}&cu=INR`}
                    size={200}
                    level="H"
                    bgColor="#ffffff"
                    fgColor="#000000"
                  />
                </div>
                
                <div className="bg-black/40 border border-white/10 p-4 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-white/60 text-xs font-light uppercase tracking-widest mb-1">UPI ID</p>
                      <p className="text-white text-base font-light tracking-wide">{selectedAccountForQr.upiId}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(selectedAccountForQr.upiId);
                        toast({
                          title: "UPI ID Copied",
                          description: "UPI ID copied to clipboard",
                        });
                      }}
                      className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-none"
                      data-testid="button-copy-upi-id-qr"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      const svg = document.querySelector(`#qr-code-${selectedAccountForQr.id}`);
                      toast({
                        title: "QR Code",
                        description: "Download functionality coming soon",
                      });
                    }}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-none font-light"
                    data-testid="button-download-qr-receive"
                  >
                    Download
                  </Button>
                  <Button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: "My Family UPI QR",
                          text: `Pay me via UPI: ${selectedAccountForQr.upiId}`,
                        });
                      }
                    }}
                    className="flex-1 bg-white text-black hover:bg-white/90 rounded-none font-light"
                    data-testid="button-share-qr-receive"
                  >
                    Share
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <BottomNavigation />

      {/* Fixed Create Account Button */}
      {canCreateNewAccount && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 backdrop-blur-sm border-t border-white/10">
          <Button
            onClick={() => navigate("/family-upi/create")}
            className="w-full bg-white text-black hover:bg-white/90 h-14 rounded-none font-light tracking-wider"
            data-testid="button-create-family-upi"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Family UPI Account
          </Button>
        </div>
      )}
    </div>
  );
}
