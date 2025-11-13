import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, LockIcon } from "lucide-react";

export interface Stage {
  id: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  route?: string;
}

interface StageTrackerProps {
  stages: Stage[];
  currentStageIndex: number;
  completedStageIndices: number[];
  onStageClick?: (stageIndex: number, stage: Stage) => void;
  onNext?: () => void;
  onPrev?: () => void;
  className?: string;
  variant?: "horizontal" | "vertical";
  showDescriptions?: boolean;
}

/**
 * StageTracker component displays progress through a multi-step process
 * 
 * Features:
 * - Color coding: green (completed), yellow (current), gray (upcoming)
 * - Interactive navigation to completed stages
 * - Icons and titles positioned properly
 * - Prevents skipping ahead to future stages
 */
export function StageTracker({
  stages,
  currentStageIndex,
  completedStageIndices,
  onStageClick,
  onNext,
  onPrev,
  className,
  variant = "horizontal",
  showDescriptions = false
}: StageTrackerProps) {
  const isStageCompleted = (index: number) => completedStageIndices.includes(index);
  const isCurrentStage = (index: number) => index === currentStageIndex;
  const isStageClickable = (index: number) => isStageCompleted(index) && !!onStageClick;
  const isStageAccessible = (index: number) => isStageCompleted(index) || isCurrentStage(index);

  const getStageStatus = (index: number) => {
    if (isStageCompleted(index)) return "completed";
    if (isCurrentStage(index)) return "current";
    return "upcoming";
  };

  const getStageColors = (status: string) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-green-500",
          border: "border-green-500",
          text: "text-green-700",
          icon: "text-white"
        };
      case "current":
        return {
          bg: "bg-yellow-500",
          border: "border-yellow-500", 
          text: "text-yellow-700",
          icon: "text-white"
        };
      default:
        return {
          bg: "bg-gray-300",
          border: "border-gray-300",
          text: "text-gray-500",
          icon: "text-gray-400"
        };
    }
  };

  const getStageIcon = (stage: Stage, status: string) => {
    if (status === "completed") {
      return <CheckCircle className="h-4 w-4 text-white" />;
    }
    if (status === "current") {
      const CurrentIcon = stage.icon;
      return CurrentIcon ? <CurrentIcon className="h-4 w-4 text-white" /> : <Clock className="h-4 w-4 text-white" />;
    }
    const UpcomingIcon = stage.icon;
    return UpcomingIcon ? <UpcomingIcon className="h-4 w-4 text-gray-400" /> : <LockIcon className="h-4 w-4 text-gray-400" />;
  };

  const renderStage = (stage: Stage, index: number) => {
    const status = getStageStatus(index);
    const colors = getStageColors(status);
    const isClickable = isStageClickable(index);
    const stageNumber = index + 1;

    const stageElement = (
      <div
        className={cn(
          "flex flex-col items-center gap-2 transition-all duration-200",
          variant === "horizontal" ? "flex-1" : "w-full"
        )}
        role="listitem"
        aria-current={isCurrentStage(index) ? "step" : undefined}
        data-testid={`stage-${stage.id}`}
      >
        {/* Stage Circle with Number/Icon */}
        <div
          className={cn(
            "relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-200",
            colors.bg,
            colors.border,
            !isStageAccessible(index) && "opacity-50"
          )}
        >
          {/* Stage Icon or Number */}
          <div className="flex items-center justify-center">
            {getStageIcon(stage, status)}
          </div>
          {/* Stage Number Badge */}
          <span className={cn("absolute -bottom-1 -right-1 bg-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center", status === "completed" ? "text-green-600" : status === "current" ? "text-yellow-600" : "text-gray-500")}>
            {stageNumber}
          </span>
          
          {/* Status Icon Overlay */}
          <div className="absolute -top-1 -right-1">
            {status === "completed" && (
              <div className="w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
            {status === "current" && (
              <div className="w-5 h-5 bg-yellow-600 rounded-full flex items-center justify-center animate-pulse">
                <Clock className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
        </div>

        {/* Stage Title */}
        <div className="text-center">
          <h4 className={cn("text-sm font-semibold", colors.text)}>
            {stage.title}
          </h4>
          {showDescriptions && stage.description && (
            <p className="text-xs text-gray-500 mt-1 max-w-20">
              {stage.description}
            </p>
          )}
        </div>
      </div>
    );

    if (isClickable) {
      return (
        <Button
          key={stage.id}
          variant="ghost"
          className="p-0 h-auto bg-transparent hover:bg-transparent hover:scale-110 hover:shadow-lg transition-all duration-200"
          onClick={() => onStageClick && onStageClick(index, stage)}
          aria-label={`Go to ${stage.title}`}
          data-testid={`button-stage-${stage.id}`}
        >
          {stageElement}
        </Button>
      );
    }

    return <div key={stage.id}>{stageElement}</div>;
  };

  if (variant === "vertical") {
    return (
      <div 
        className={cn("flex flex-col gap-6", className)}
        role="list"
        aria-label="Progress tracker"
        data-testid="stage-tracker-vertical"
      >
        {stages.map((stage, index) => (
          <div key={stage.id} className="relative">
            {renderStage(stage, index)}
            {/* Vertical Connection Line */}
            {index < stages.length - 1 && (
              <div 
                className={cn(
                  "absolute top-12 left-6 w-0.5 h-6",
                  isStageCompleted(index) ? "bg-green-500" : "bg-gray-300"
                )}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Show all stages by default - responsive behavior handled by CSS
  const getVisibleStages = () => {
    // Always show all stages, let CSS handle responsive behavior
    return stages.map((stage, index) => ({ stage, index }));
  };

  const visibleStages = getVisibleStages();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to keep current stage centered
  React.useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const stageElements = container.querySelectorAll('[data-stage-index]');
      const currentStageElement = container.querySelector(`[data-stage-index="${currentStageIndex}"]`);
      
      if (currentStageElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = currentStageElement.getBoundingClientRect();
        const scrollLeft = elementRect.left - containerRect.left + container.scrollLeft - (containerRect.width / 2) + (elementRect.width / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [currentStageIndex]);

  return (
    <div className={cn("relative", className)}>
      {/* Stage Indicators */}
      <div className="flex justify-center mb-2">
        <div className="flex gap-1">
          {stages.map((_, index) => (
            <div
              key={`indicator-${index}`}
              className={cn(
                "h-1 rounded-full transition-all duration-300",
                index === currentStageIndex 
                  ? "bg-red-500 w-6" 
                  : isStageCompleted(index)
                    ? "bg-green-500 w-2"
                    : "bg-gray-300 w-2"
              )}
            />
          ))}
        </div>
      </div>

      {/* Scrollable Stages Container */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-hide -mx-4 px-4"
        role="list"
        aria-label="Progress tracker"
        data-testid="stage-tracker-horizontal"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex items-center justify-center gap-2 px-6 py-6 min-w-max">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex items-center flex-shrink-0">
              {/* Stage Element */}
              <div
                data-stage-index={index}
                className={cn(
                  "transition-all duration-500 transform relative",
                  index === currentStageIndex ? "scale-110" : "scale-100",
                  "w-20 sm:w-24 md:w-28"
                )}
                style={{ scrollSnapAlign: 'center' }}
              >
                {renderStage(stage, index)}
              </div>
              
              {/* Connection Line Between Stages */}
              {index < stages.length - 1 && (
                <div className="flex items-center justify-center mx-1 sm:mx-2">
                  <div className="w-8 sm:w-12 md:w-16 h-0.5 relative bg-gray-300 rounded">
                    <div 
                      className={cn(
                        "absolute left-0 h-full rounded transition-all duration-500",
                        isStageCompleted(index) ? "bg-green-500" : "bg-gray-300"
                      )}
                      style={{ 
                        width: isStageCompleted(index) ? '100%' : '0%',
                        transformOrigin: 'left'
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (onPrev) {
              onPrev();
            } else if (currentStageIndex > 0) {
              const prevIndex = currentStageIndex - 1;
              onStageClick?.(prevIndex, stages[prevIndex]);
            }
          }}
          disabled={currentStageIndex === 0}
          className="opacity-70 hover:opacity-100"
        >
          Previous
        </Button>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">{currentStageIndex + 1}</span>
          <span>/</span>
          <span>{stages.length}</span>
        </div>
        
        <Button
          variant="outline" 
          size="sm"
          onClick={() => {
            if (onNext) {
              onNext();
            } else if (currentStageIndex < stages.length - 1) {
              const nextIndex = currentStageIndex + 1;
              if (isStageCompleted(nextIndex)) {
                onStageClick?.(nextIndex, stages[nextIndex]);
              }
            }
          }}
          disabled={
            currentStageIndex === stages.length - 1 || 
            (!onNext && currentStageIndex < stages.length - 1 && !isStageCompleted(currentStageIndex + 1))
          }
          className="opacity-70 hover:opacity-100"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

/**
 * Simple hook to manage stage tracker state
 */
export function useStageTracker(totalStages: number, initialStage: number = 0) {
  const [currentStageIndex, setCurrentStageIndex] = React.useState(initialStage);
  const [completedStageIndices, setCompletedStageIndices] = React.useState<number[]>([]);

  const nextStage = () => {
    if (currentStageIndex < totalStages - 1) {
      setCompletedStageIndices(prev => [...prev, currentStageIndex]);
      setCurrentStageIndex(currentStageIndex + 1);
    }
  };

  const goToStage = (stageIndex: number) => {
    if (stageIndex <= currentStageIndex || completedStageIndices.includes(stageIndex)) {
      setCurrentStageIndex(stageIndex);
    }
  };

  const completeCurrentStage = () => {
    setCompletedStageIndices(prev => 
      prev.includes(currentStageIndex) ? prev : [...prev, currentStageIndex]
    );
  };

  const reset = () => {
    setCurrentStageIndex(0);
    setCompletedStageIndices([]);
  };

  return {
    currentStageIndex,
    completedStageIndices,
    nextStage,
    goToStage,
    completeCurrentStage,
    reset,
    isCompleted: completedStageIndices.length === totalStages,
    canProgress: currentStageIndex < totalStages - 1
  };
}