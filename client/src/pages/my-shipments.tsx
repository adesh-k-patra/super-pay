import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigationHistory } from "@/hooks/use-navigation-history";
import { 
  Package as PackageIcon, 
  ArrowLeft, 
  ChevronRight,
  MapPin,
  Navigation,
  Eye,
  TruckIcon
} from "lucide-react";

interface CourierBooking {
  id: string;
  bookingId: string;
  pickupLocation: string;
  dropLocation: string;
  itemType: string;
  weightKg: number;
  quantity: number;
  vehicle: {
    name: string;
    code: string;
  };
  status: 'confirmed' | 'driver_assigned' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  pricing: {
    total: number;
    estimatedDistance: number;
  };
  bookingType: string;
  scheduledDate?: string;
  scheduledTime?: string;
  createdAt: string;
  paymentMethod: string;
}

const MOCK_SHIPMENTS: CourierBooking[] = [
  {
    id: "1",
    bookingId: "COU1729501234567",
    pickupLocation: "Connaught Place, New Delhi",
    dropLocation: "Sector 62, Noida",
    itemType: "documents",
    weightKg: 2,
    quantity: 1,
    vehicle: {
      name: "Bike",
      code: "bike"
    },
    status: "in_transit",
    pricing: {
      total: 125,
      estimatedDistance: 8.5
    },
    bookingType: "ondemand",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    paymentMethod: "online"
  },
  {
    id: "2",
    bookingId: "COU1729501234568",
    pickupLocation: "Bandra West, Mumbai",
    dropLocation: "Andheri East, Mumbai",
    itemType: "groceries",
    weightKg: 15,
    quantity: 2,
    vehicle: {
      name: "Auto",
      code: "auto"
    },
    status: "delivered",
    pricing: {
      total: 245,
      estimatedDistance: 12.3
    },
    bookingType: "ondemand",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: "cod"
  },
  {
    id: "3",
    bookingId: "COU1729501234569",
    pickupLocation: "MG Road, Bangalore",
    dropLocation: "Whitefield, Bangalore",
    itemType: "furniture",
    weightKg: 150,
    quantity: 1,
    vehicle: {
      name: "Mini Truck",
      code: "mini_truck"
    },
    status: "confirmed",
    pricing: {
      total: 899,
      estimatedDistance: 18.7
    },
    bookingType: "scheduled",
    scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: "14:00",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    paymentMethod: "online"
  },
  {
    id: "4",
    bookingId: "COU1729501234570",
    pickupLocation: "Park Street, Kolkata",
    dropLocation: "Salt Lake, Kolkata",
    itemType: "parcels",
    weightKg: 8,
    quantity: 3,
    vehicle: {
      name: "Auto",
      code: "auto"
    },
    status: "driver_assigned",
    pricing: {
      total: 189,
      estimatedDistance: 7.2
    },
    bookingType: "ondemand",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    paymentMethod: "online"
  },
  {
    id: "5",
    bookingId: "COU1729501234571",
    pickupLocation: "Jubilee Hills, Hyderabad",
    dropLocation: "HITEC City, Hyderabad",
    itemType: "appliances",
    weightKg: 45,
    quantity: 1,
    vehicle: {
      name: "Mini Truck",
      code: "mini_truck"
    },
    status: "delivered",
    pricing: {
      total: 567,
      estimatedDistance: 15.4
    },
    bookingType: "ondemand",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    paymentMethod: "online"
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case 'confirmed': return 'bg-white/10 text-white border-white/20';
    case 'driver_assigned': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'picked_up': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'in_transit': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'delivered': return 'bg-white/10 text-white border-white/20';
    case 'cancelled': return 'bg-white/5 text-white/60 border-white/10';
    default: return 'bg-white/5 text-white/60 border-white/10';
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case 'confirmed': return 'Confirmed';
    case 'driver_assigned': return 'Driver Assigned';
    case 'picked_up': return 'Picked Up';
    case 'in_transit': return 'In Transit';
    case 'delivered': return 'Delivered';
    case 'cancelled': return 'Cancelled';
    default: return status;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function MyShipments() {
  const [, navigate] = useLocation();
  const { goBack } = useNavigationHistory();
  const [activeTab, setActiveTab] = useState("all");

  const bookings = MOCK_SHIPMENTS;

  const filteredBookings = bookings.filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") {
      return ['confirmed', 'driver_assigned', 'picked_up', 'in_transit'].includes(booking.status);
    }
    if (activeTab === "completed") {
      return booking.status === 'delivered';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="relative flex items-center justify-center py-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="absolute left-4 text-white/60 hover:text-white hover:bg-white/10 rounded-none h-8 w-8"
            data-testid="button-back"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1} />
          </Button>
          <div className="text-center">
            <h1 className="text-sm font-bold tracking-wider uppercase">My Shipments</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">
              {filteredBookings.length} Booking{filteredBookings.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-4 pb-8 w-full max-w-screen-lg mx-auto">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="w-full bg-white/5 border border-white/10 p-0 h-auto rounded-none">
            <TabsTrigger 
              value="all" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-none py-3 text-xs uppercase tracking-widest font-semibold"
              data-testid="tab-all"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="active" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-none py-3 text-xs uppercase tracking-widest font-semibold"
              data-testid="tab-active"
            >
              Active
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-black rounded-none py-3 text-xs uppercase tracking-widest font-semibold"
              data-testid="tab-completed"
            >
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12 border border-white/10 bg-white/5">
                <PackageIcon className="h-12 w-12 text-white/40 mx-auto mb-4" strokeWidth={1} />
                <p className="text-white/60 text-sm font-light mb-2">No shipments found</p>
                <p className="text-white/40 text-xs font-light">
                  {activeTab === "active" && "You don't have any active shipments"}
                  {activeTab === "completed" && "You haven't completed any shipments yet"}
                  {activeTab === "all" && "Start booking your first shipment"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="border border-white/10 bg-white/5 p-4 hover:border-white/30 transition-all"
                    data-testid={`shipment-${booking.bookingId}`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xs font-bold tracking-wider uppercase">{booking.bookingId}</h3>
                          <Badge 
                            className={`${getStatusColor(booking.status)} rounded-none text-[10px] px-2 py-0.5 font-semibold tracking-wider`}
                          >
                            {getStatusLabel(booking.status)}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-light">
                          {formatDate(booking.createdAt)} • {formatTime(booking.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="mb-4 space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white/40 text-[10px] uppercase tracking-widest font-light mb-0.5">Pickup</p>
                          <p className="font-light text-sm truncate">{booking.pickupLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white/40 text-[10px] uppercase tracking-widest font-light mb-0.5">Drop</p>
                          <p className="font-light text-sm truncate">{booking.dropLocation}</p>
                        </div>
                      </div>
                    </div>

                    {/* Package Details */}
                    <div className="grid grid-cols-3 gap-3 text-xs mb-4 py-3 border-t border-white/10">
                      <div>
                        <p className="text-white/40 uppercase tracking-widest text-[10px] mb-0.5">Vehicle</p>
                        <p className="font-light">{booking.vehicle.name}</p>
                      </div>
                      <div>
                        <p className="text-white/40 uppercase tracking-widest text-[10px] mb-0.5">Item</p>
                        <p className="font-light capitalize">{booking.itemType}</p>
                      </div>
                      <div>
                        <p className="text-white/40 uppercase tracking-widest text-[10px] mb-0.5">Total</p>
                        <p className="font-light">₹{Math.round(booking.pricing.total)}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3 border-t border-white/10">
                      <Button
                        onClick={() => navigate(`/booking/courier/tracking/${booking.bookingId}`)}
                        className="flex-1 bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-none h-10 text-xs font-semibold uppercase tracking-wider"
                        data-testid={`button-track-${booking.bookingId}`}
                      >
                        <TruckIcon className="h-4 w-4 mr-2" strokeWidth={1} />
                        Track
                      </Button>
                      <Button
                        onClick={() => {
                          localStorage.setItem('currentCourierBooking', JSON.stringify(booking));
                          navigate(`/booking/courier/tracking/${booking.bookingId}`);
                        }}
                        className="flex-1 bg-white text-black hover:bg-white/90 rounded-none h-10 text-xs font-semibold uppercase tracking-wider"
                        data-testid={`button-view-${booking.bookingId}`}
                      >
                        <Eye className="h-4 w-4 mr-2" strokeWidth={1.5} />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* New Booking CTA */}
        {filteredBookings.length > 0 && (
          <Button
            onClick={() => navigate("/booking/courier/search")}
            className="w-full bg-white text-black hover:bg-white/90 h-12 text-sm font-bold tracking-wider rounded-none mt-6"
            data-testid="button-new-booking"
          >
            <PackageIcon className="h-4 w-4 mr-2" strokeWidth={1.5} />
            NEW SHIPMENT
          </Button>
        )}
      </div>
    </div>
  );
}
