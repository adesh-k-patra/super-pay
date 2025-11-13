import { useState, type KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ImageCarouselProps {
  images: string[];
  productName?: string;
  className?: string;
  showThumbnails?: boolean;
  testIdPrefix?: string;
}

export function ImageCarousel({
  images,
  productName = "Product",
  className,
  showThumbnails = true,
  testIdPrefix = "carousel"
}: ImageCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goToPrevious = () => {
    setDirection(-1);
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setDirection(1);
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      goToPrevious();
    } else if (e.key === "ArrowRight") {
      goToNext();
    }
  };

  if (images.length === 0) {
    return (
      <div className={cn("aspect-square bg-white/5 border border-white/10 flex items-center justify-center", className)}>
        <p className="text-white/40 text-sm">No images available</p>
      </div>
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0
    })
  };

  return (
    <>
      <div className={cn("w-full", className)} onKeyDown={handleKeyDown} tabIndex={0}>
        {/* Main Image Display */}
        <div className="relative aspect-square bg-white/5 border border-white/10 overflow-hidden group">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={selectedIndex}
              src={images[selectedIndex]}
              alt={`${productName} - Image ${selectedIndex + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              onClick={() => setIsModalOpen(true)}
              data-testid={`${testIdPrefix}-main-image`}
            />
          </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/20 z-10"
              data-testid={`${testIdPrefix}-button-prev`}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={1} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/20 z-10"
              data-testid={`${testIdPrefix}-button-next`}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={1} />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 text-xs font-light backdrop-blur-sm border border-white/20">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "aspect-square border-2 transition-all overflow-hidden",
                selectedIndex === index
                  ? "border-white shadow-lg"
                  : "border-white/20 hover:border-white/40 opacity-60 hover:opacity-100"
              )}
              data-testid={`${testIdPrefix}-thumbnail-${index}`}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dot Indicators (alternative to thumbnails) */}
      {!showThumbnails && images.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "h-2 rounded-full transition-all",
                selectedIndex === index
                  ? "bg-white w-8"
                  : "bg-white/30 w-2 hover:bg-white/50"
              )}
              data-testid={`${testIdPrefix}-dot-${index}`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
      </div>

      {/* Full Screen Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="max-w-screen max-h-screen w-screen h-screen p-0 border-0 bg-black/95 overflow-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <DialogTitle className="sr-only">{productName} Image Gallery</DialogTitle>
          
          {/* Close Button - Top Right Outside */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="fixed top-6 right-6 bg-black/70 hover:bg-black/90 text-white p-3 border border-white/20 z-[250]"
            data-testid={`${testIdPrefix}-modal-close`}
            aria-label="Close"
          >
            <X className="h-6 w-6" strokeWidth={1} />
          </button>

          {/* Navigation Controls - Bottom Center */}
          {images.length > 1 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-[250]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="bg-black/70 hover:bg-black/90 text-white p-4 border border-white/20"
                data-testid={`${testIdPrefix}-modal-prev`}
                aria-label="Previous image"
              >
                <ChevronLeft className="h-8 w-8" strokeWidth={1} />
              </button>
              
              <div className="bg-black/70 text-white px-6 py-2 text-sm font-light backdrop-blur-sm border border-white/20">
                {selectedIndex + 1} / {images.length}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="bg-black/70 hover:bg-black/90 text-white p-4 border border-white/20"
                data-testid={`${testIdPrefix}-modal-next`}
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" strokeWidth={1} />
              </button>
            </div>
          )}

          {/* Image Container - Full Screen */}
          <div className="w-full min-h-screen flex items-center justify-center pt-20 pb-24 px-4" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.img
                key={selectedIndex}
                src={images[selectedIndex]}
                alt={`${productName} - Image ${selectedIndex + 1}`}
                className="w-full h-auto object-contain cursor-pointer"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                onClick={() => setIsModalOpen(false)}
                data-testid={`${testIdPrefix}-modal-image`}
              />
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
