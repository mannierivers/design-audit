import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  // Updated with v4 syntax: ring-(--fg-muted)
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-(--fg-muted) disabled:pointer-events-none disabled:opacity-50 rounded-none uppercase tracking-widest",
  {
    variants: {
      variant: {
        // v4 syntax: bg-(--fg-base) etc.
        default:
          "bg-(--fg-base) text-(--bg-base) hover:bg-(--fg-muted) hover:text-(--bg-base) border border-transparent",
        
        destructive:
          "bg-red-900 text-white hover:bg-red-800 border border-red-900",
        
        outline:
          "border border-(--border-base) bg-transparent hover:bg-(--border-base) text-(--fg-base)",
        
        secondary:
          "bg-(--border-base) text-(--fg-base) hover:bg-(--fg-muted) hover:text-(--bg-base)",
        
        ghost:
          "hover:bg-(--border-base) hover:text-(--fg-base) text-(--fg-muted)",
        
        link:
          "text-(--fg-base) underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-8 py-2",
        sm: "h-8 px-4 text-[10px]",
        lg: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };