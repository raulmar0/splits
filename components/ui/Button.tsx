import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "ghost";
  size?: "sm" | "md";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const variants = {
      default: "bg-surface-2 border-border text-text",
      primary: "bg-lime border-transparent text-[#0a0c10] font-semibold",
      ghost: "bg-transparent border-transparent text-text-2",
    };

    const sizes = {
      sm: "px-2 py-1 text-[11px]",
      md: "px-2.5 py-1.5 text-[12px]",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-[5px] border font-medium",
          "transition-colors duration-[120ms] ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
