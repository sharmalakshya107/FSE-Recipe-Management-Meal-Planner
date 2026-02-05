import React from "react";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

interface AlertProps {
  children: React.ReactNode;
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = "info",
  title,
  className = "",
}) => {
  const variants = {
    info: {
      container: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <Info size={18} className="text-blue-500" />,
    },
    success: {
      container: "bg-green-50 border-green-200 text-green-800",
      icon: <CheckCircle size={18} className="text-green-500" />,
    },
    warning: {
      container: "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: <AlertCircle size={18} className="text-yellow-500" />,
    },
    error: {
      container: "bg-red-50 border-red-200 text-red-800",
      icon: <XCircle size={18} className="text-red-500" />,
    },
  };

  const style = variants[variant];

  return (
    <div
      className={`p-4 border rounded-lg flex items-start space-x-3 ${style.container} ${className}`}
    >
      <div className="mt-0.5">{style.icon}</div>
      <div className="flex-1">
        {title && <h4 className="text-sm font-semibold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};
