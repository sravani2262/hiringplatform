import { cn } from "@/lib/utils";

export function Logo({ className, size = "medium" }: { className?: string; size?: "small" | "medium" | "large" }) {
  const dimensions = {
    small: "h-8 w-8",
    medium: "h-10 w-10",
    large: "h-12 w-12"
  };

  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden",
      dimensions[size],
      "bg-gradient-to-br from-primary via-accent to-secondary",
      "flex items-center justify-center",
      "shadow-lg shadow-primary/20",
      "hover:shadow-xl hover:shadow-primary/30 transition-all duration-300",
      className
    )}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-2/3 h-2/3 text-white"
      >
        <path
          d="M12 4L3 9L12 14L21 9L12 4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 14L12 19L21 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-70"
        />
      </svg>
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
    </div>
  );
}