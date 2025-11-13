import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-none bg-muted/80 transition-all duration-300", className)}
      role="status"
      aria-label="Loading content"
      {...props}
    />
  )
}

export { Skeleton }
