import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft,
  Star,
  CheckCircle2,
  XCircle,
  Building2,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import type { InvestmentVendor } from "@shared/schema";

export default function CompareVendors() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedAssetType, setSelectedAssetType] = useState<string>("stocks");

  const { data: vendorsData, isLoading } = useQuery<{ vendors: InvestmentVendor[] }>({
    queryKey: ["/api/vendors", selectedAssetType],
    queryFn: async () => {
      const params = new URLSearchParams({ assetType: selectedAssetType });
      const res = await fetch(`/api/vendors?${params}`);
      return res.json();
    },
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, authLoading, navigate]);

  if (!isAuthenticated && !authLoading) {
    return null;
  }

  const handleBack = () => {
    navigate("/investment");
  };

  const assetTypes = [
    { id: "stocks", label: "Stocks", icon: TrendingUp },
    { id: "mutual_funds", label: "Mutual Funds", icon: Shield },
    { id: "bonds", label: "Bonds", icon: Building2 },
  ];

  const vendors = vendorsData?.vendors || [];

  const pagination = usePagination({
    data: vendors,
    itemsPerPage: 10,
  });

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white/80 hover:text-white hover:bg-white/10 p-2"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-white">Compare Brokers</h1>
          
          <div className="w-10" />
        </div>
      </div>

      {/* Asset Type Filter */}
      <div className="pt-24 p-4 border-b border-white/10">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {assetTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedAssetType === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedAssetType(type.id)}
              className={cn(
                "whitespace-nowrap",
                selectedAssetType === type.id 
                  ? "bg-white text-black" 
                  : "border-white/20 text-white/80 hover:bg-white/10"
              )}
              data-testid={`button-filter-${type.id}`}
            >
              <type.icon className="h-4 w-4 mr-2" />
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Vendors List */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white/5 border border-white/10">
                <CardContent className="p-4">
                  <Skeleton className="h-20 w-full bg-white/10" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : vendors.length === 0 ? (
          <Card className="bg-white/5 border border-white/10">
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/60">No brokers available for {selectedAssetType}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {pagination.paginatedData.map((vendor) => (
            <Card 
              key={vendor.id} 
              className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              data-testid={`card-vendor-${vendor.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white/80" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{vendor.vendorName}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-white/80 fill-white" />
                          <span className="text-sm text-white/70">{vendor.rating || "N/A"}</span>
                        </div>
                        {vendor.isActive === 1 && (
                          <Badge className="bg-white/10 text-white/80 border-0 text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Vendor Type & Trust */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-white/60 mb-1">Vendor Type</p>
                    <p className="text-sm font-semibold text-white capitalize">{vendor.vendorType}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-white/60 mb-1">Trust Badge</p>
                    <p className="text-sm font-semibold text-white capitalize">{vendor.trustBadge || "N/A"}</p>
                  </div>
                </div>

                {/* Certifications */}
                {vendor.certifications && vendor.certifications.length > 0 && (
                  <div>
                    <p className="text-xs text-white/60 mb-2">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {vendor.certifications.map((cert: string, idx: number) => (
                        <Badge 
                          key={idx}
                          variant="outline" 
                          className="border-white/20 text-white/80 text-xs"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1 text-white/80" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Asset Types */}
                {vendor.assetTypes && vendor.assetTypes.length > 0 && (
                  <div>
                    <p className="text-xs text-white/60 mb-2">Asset Types</p>
                    <div className="flex flex-wrap gap-2">
                      {vendor.assetTypes.map((asset: string, idx: number) => (
                        <Badge 
                          key={idx}
                          className="bg-white/10 text-white/80 border-0 text-xs"
                        >
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivery Time */}
                {vendor.avgDeliveryTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="h-4 w-4 text-white/80" />
                    <span className="text-white/80">Avg Delivery: {vendor.avgDeliveryTime} days</span>
                  </div>
                )}

                <Button 
                  className="w-full bg-white text-black hover:bg-white/90"
                  data-testid={`button-select-vendor-${vendor.id}`}
                >
                  Select Broker
                </Button>
              </CardContent>
            </Card>
            ))}
            
            <PaginationControls
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={pagination.goToPage}
              canGoNext={pagination.canGoNext}
              canGoPrevious={pagination.canGoPrevious}
              startIndex={pagination.startIndex}
              endIndex={pagination.endIndex}
              totalItems={pagination.totalItems}
              className="mt-6"
            />
          </>
        )}
      </div>
    </div>
  );
}
