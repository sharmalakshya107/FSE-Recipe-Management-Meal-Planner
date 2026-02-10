import React from "react";
import { Loader2 } from "lucide-react";

const SPINNER_SIZES = {
  sm: 16,
  md: 32,
  lg: 48,
};

export const Spinner: React.FC<{
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2
        size={SPINNER_SIZES[size]}
        className="animate-spin text-indigo-600"
      />
    </div>
  );
};
