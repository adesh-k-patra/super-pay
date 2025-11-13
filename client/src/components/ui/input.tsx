import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-none bg-input px-4 py-3 text-base border-2 border-border shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(255,255,255,0.08)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 hover:border-accent hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.06),inset_0_0_0_1px_rgba(255,255,255,0.15)] focus:shadow-[inset_0_2px_6px_rgba(255,255,255,0.1),0_0_0_3px_rgba(255,255,255,0.08)] disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground md:text-sm transition-all duration-200 font-medium text-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
