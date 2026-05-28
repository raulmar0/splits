import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  mono?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, mono, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="mono uc text-[10px] font-medium tracking-[0.1em] text-text-3">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "rounded-[5px] px-3 py-2 text-[13px]",
            "transition-colors duration-[120ms] ease-out",
            "focus:outline-none focus:ring-2 focus:ring-lime focus:ring-offset-2 focus:ring-offset-bg",
            mono && "mono",
            className
          )}
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
