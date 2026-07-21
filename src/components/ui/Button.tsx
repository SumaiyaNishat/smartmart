import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "link";
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ecomm-primary/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

    let variantStyles = "";
    if (variant === "primary") {
      variantStyles = "px-10 py-4 bg-ecomm-primary text-white rounded-xl shadow-[0_10px_20px_rgba(255,127,92,0.3)] hover:scale-105 active:scale-95";
    } else if (variant === "secondary") {
      variantStyles = "px-8 py-3 bg-white text-ecomm-dark border border-gray-200 rounded-xl hover:bg-gray-50 active:scale-95";
    } else if (variant === "link") {
      variantStyles = "text-ecomm-primary hover:underline underline-offset-4 active:opacity-80 p-0 bg-transparent";
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
