import clsx from "clsx";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

const base = "inline-flex items-center justify-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
const variants = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-gray-600 hover:bg-gray-100",
};
const sizes = { sm: "text-xs px-3 py-1.5", md: "text-sm px-4 py-2", lg: "text-base px-5 py-2.5" };

export default function Button({ variant = "primary", size = "md", className, children, ...props }: Props) {
  return (
    <button className={clsx(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
