import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

interface AlertProps {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  className?: string;
}

import { ALERT_VARIANTS } from "../../theme/variants";

const iconMap = {
  info: <Info size={18} className="text-blue-500" />,
  success: <CheckCircle size={18} className="text-green-500" />,
  warning: <AlertCircle size={18} className="text-yellow-500" />,
  error: <XCircle size={18} className="text-red-500" />,
};

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = "info",
  title,
  className = "",
}) => {
  const containerStyle = ALERT_VARIANTS[variant];

  return (
    <div
      className={`p-4 border rounded-lg flex items-start space-x-3 ${containerStyle} ${className}`}
    >
      <div className="mt-0.5">{iconMap[variant]}</div>
      <div className="flex-1">
        {title && <h4 className="text-sm font-semibold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};
