import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-none bg-background px-3 py-2 text-base border border-black dark:border-white/80 shadow-[inset_0_1px_6px_hsla(0,84%,70%,0.12)] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-destructive focus:border-destructive focus-visible:ring-2 focus-visible:ring-destructive/30 focus-visible:ring-offset-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
