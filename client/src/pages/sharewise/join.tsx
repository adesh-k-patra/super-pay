import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Users, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function JoinGroup() {
  const [, params] = useRoute("/sharewise/join/:inviteCode");
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const inviteCode = params?.inviteCode;
  const [status, setStatus] = useState<"loading" | "success" | "error" | "already_member">("loading");
  const [groupData, setGroupData] = useState<any>(null);

  const joinGroup = useMutation({
    mutationFn: async () => {
      const result = await apiRequest("POST", `/api/sharewise/join/${inviteCode}`, {});
      return result;
    },
    onSuccess: (data) => {
      setGroupData(data.group);
      if (data.message === "Already a member") {
        setStatus("already_member");
      } else {
        setStatus("success");
        toast({
          title: "Joined Successfully",
          description: `You've joined ${data.group.name}`
        });
      }
    },
    onError: (error: any) => {
      setStatus("error");
      toast({
        title: "Error",
        description: error.message || "Failed to join group",
        variant: "destructive"
      });
    }
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    if (inviteCode && user) {
      joinGroup.mutate();
    }
  }, [inviteCode, user, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  const handleViewGroup = () => {
    if (groupData) {
      navigate(`/sharewise/groups/${groupData.id}`);
    }
  };

  const handleBackToGroups = () => {
    navigate("/sharewise/groups");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {status === "loading" && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Loader2 className="h-10 w-10 text-white/60 animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-wider mb-2">JOINING GROUP</h2>
              <p className="text-white/60">Please wait while we add you to the group...</p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-wider mb-2">JOINED SUCCESSFULLY!</h2>
              {groupData && (
                <>
                  <p className="text-xl font-medium text-white/80 mb-2">{groupData.name}</p>
                  {groupData.description && (
                    <p className="text-white/60 text-sm">{groupData.description}</p>
                  )}
                </>
              )}
            </div>
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleViewGroup}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 font-bold text-lg uppercase tracking-wider"
                data-testid="button-view-group"
              >
                <Users className="h-5 w-5 mr-2" />
                View Group
              </Button>
              <Button
                onClick={handleBackToGroups}
                variant="ghost"
                className="w-full text-white/60 hover:text-white hover:bg-white/10 rounded-none h-12"
                data-testid="button-back-to-groups"
              >
                Back to Groups
              </Button>
            </div>
          </div>
        )}

        {status === "already_member" && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
              <Users className="h-10 w-10 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-wider mb-2">ALREADY A MEMBER</h2>
              {groupData && (
                <>
                  <p className="text-xl font-medium text-white/80 mb-2">{groupData.name}</p>
                  <p className="text-white/60 text-sm">You're already a member of this group</p>
                </>
              )}
            </div>
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleViewGroup}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 font-bold text-lg uppercase tracking-wider"
                data-testid="button-view-group"
              >
                <Users className="h-5 w-5 mr-2" />
                View Group
              </Button>
              <Button
                onClick={handleBackToGroups}
                variant="ghost"
                className="w-full text-white/60 hover:text-white hover:bg-white/10 rounded-none h-12"
                data-testid="button-back-to-groups"
              >
                Back to Groups
              </Button>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
              <AlertCircle className="h-10 w-10 text-red-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-wider mb-2">INVALID INVITE</h2>
              <p className="text-white/60">This invite code is invalid or has expired</p>
            </div>
            <div className="pt-4">
              <Button
                onClick={handleBackToGroups}
                className="w-full bg-white text-black hover:bg-white/90 rounded-none h-14 font-bold text-lg uppercase tracking-wider"
                data-testid="button-back-to-groups"
              >
                Back to Groups
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
