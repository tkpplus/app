import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "new" | "popular" | "category";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-white hover:bg-primary-hover": variant === "default",
          "border-transparent bg-secondary text-primary-hover hover:bg-secondary/80": variant === "secondary",
          "border-border text-text-main": variant === "outline",
          "border-transparent bg-accent-yellow text-text-main": variant === "new",
          "border-transparent bg-accent-orange text-white": variant === "popular",
          "border-border bg-surface text-text-main": variant === "category",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
