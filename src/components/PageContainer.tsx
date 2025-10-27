import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function PageContainer({ children, className, noPadding = false }: PageContainerProps) {
  return (
    <div
      className={cn(
        "w-full mx-auto max-w-7xl",
        !noPadding && "px-4 sm:px-6 lg:px-8 py-6 sm:py-8",
        "relative",
        className
      )}
    >
      {/* Layered background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-50/90 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/90" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/30 dark:bg-grid-slate-800/20 bg-fixed pointer-events-none" />
      
      {/* Accent color effects */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-3xl" />
      
      {/* Content with enhanced depth */}
      <div className="relative backdrop-blur-sm">{children}</div>
    </div>
  );
}