import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useLocation } from "wouter";
import { useWishlist } from "@/hooks/use-wishlist";
import { Button } from "./button";

export function WishlistNotification() {
  const [, navigate] = useLocation();
  const { showNotification, setShowNotification, lastAddedCategory, getCountByCategory } = useWishlist();

  // Auto-hide after 4 seconds
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showNotification, setShowNotification]);

  const getCategoryLabel = (category: string | null) => {
    if (!category) return "";
    switch(category) {
      case 'hotel-food': return 'Food';
      case 'supermart': return 'Supermart';
      case 'medicine': return 'Medicine';
      case 'electronics': return 'Electronics';
      case 'beauty': return 'Beauty';
      case 'pet': return 'Pet';
      case 'home': return 'Home';
      default: return category;
    }
  };

  const handleViewAll = () => {
    setShowNotification(false);
    navigate(`/delivery-now/wishlist${lastAddedCategory ? `?category=${lastAddedCategory}` : ''}`);
  };

  const handleClose = () => {
    setShowNotification(false);
  };

  const count = lastAddedCategory ? getCountByCategory(lastAddedCategory) : 0;
  const categoryLabel = getCategoryLabel(lastAddedCategory);

  return (
    <AnimatePresence>
      {showNotification && lastAddedCategory && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
          data-testid="wishlist-notification"
        >
          <div className="bg-black border border-white/20 backdrop-blur-xl shadow-2xl">
            <div className="p-4 flex items-center gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                <Heart className="h-5 w-5 text-red-400 fill-red-400" strokeWidth={1.5} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold tracking-wide mb-0.5">
                  Added to Wishlist
                </p>
                <p className="text-white/60 text-xs font-light">
                  {count} {count === 1 ? 'item' : 'items'} in {categoryLabel} wishlist
                </p>
              </div>

              {/* View All Button */}
              <Button
                onClick={handleViewAll}
                className="bg-white text-black hover:bg-white/90 rounded-none h-8 px-4 text-xs font-bold tracking-wider flex-shrink-0"
                data-testid="button-view-wishlist"
              >
                VIEW ALL
              </Button>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="flex-shrink-0 text-white/50 hover:text-white transition-colors p-1"
                data-testid="button-close-notification"
                aria-label="Close notification"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
