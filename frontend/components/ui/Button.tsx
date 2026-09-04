import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  let baseStyles =
    "inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  let sizeStyles = "px-4 py-2.5 text-sm";
  if (size === "sm") sizeStyles = "px-3 py-1.5 text-xs";
  if (size === "lg") sizeStyles = "px-6 py-3.5 text-base";

  let variantStyles = "bg-primary hover:bg-primary-dark text-white shadow-sm focus:ring-primary";
  if (variant === "secondary") {
    variantStyles = "bg-secondary hover:bg-secondary-dark text-white shadow-sm focus:ring-secondary";
  } else if (variant === "outline") {
    variantStyles =
      "border-2 border-slate-200 hover:border-primary text-text-main hover:text-primary bg-white focus:ring-primary";
  } else if (variant === "ghost") {
    variantStyles = "text-text-muted hover:text-primary hover:bg-primary/5 focus:ring-primary";
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
