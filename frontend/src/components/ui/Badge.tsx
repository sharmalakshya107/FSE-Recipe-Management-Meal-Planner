import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "outline";
  className?: string;
}

import { BADGE_VARIANTS } from "../../theme/variants";

const baseStyles =
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = "",
  variant = "default",
  ...props
}) => {
  return (
    <div
      className={`${baseStyles} ${BADGE_VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
