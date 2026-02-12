import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "bg-white border border-neutral-200 rounded-none", 
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

export { Card };