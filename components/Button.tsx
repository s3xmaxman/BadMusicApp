import { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "success" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled, type = "button", variant = "default", size = "md", ...props }, ref) => {
    return (
      <button
        type={type}
        className={twMerge(
          `relative group flex items-center justify-center rounded-xl font-medium transition-all duration-300`,
          variant === "default" &&
            "bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/30 text-white hover:shadow-lg hover:shadow-purple-500/20 hover:border-purple-500/50",
          variant === "outline" &&
            "border border-neutral-800 hover:border-purple-500/30 bg-transparent hover:bg-neutral-800/50 text-white",
          variant === "ghost" &&
            "bg-transparent hover:bg-neutral-800/50 text-white border border-transparent",
          variant === "success" &&
            "bg-gradient-to-br from-green-500/20 to-green-900/20 border border-green-500/30 text-white hover:shadow-lg hover:shadow-green-500/20 hover:border-green-500/50",
          variant === "danger" &&
            "bg-gradient-to-br from-red-500/20 to-red-900/20 border border-red-500/30 text-white hover:shadow-lg hover:shadow-red-500/20 hover:border-red-500/50",
          size === "sm" && "text-xs px-3 py-1.5",
          size === "md" && "text-sm px-4 py-2",
          size === "lg" && "text-base px-6 py-3",
          size === "icon" && "p-2",
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
        <div className="relative">{children}</div>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
