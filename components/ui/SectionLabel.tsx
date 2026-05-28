import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
  accent?: boolean;
}

export function SectionLabel({ children, className, accent }: SectionLabelProps) {
  return (
    <p
      className={cn(
        "mono uc text-[10px] font-medium tracking-[0.12em]",
        accent ? "text-lime" : "text-text-3",
        className
      )}
    >
      {children}
    </p>
  );
}
