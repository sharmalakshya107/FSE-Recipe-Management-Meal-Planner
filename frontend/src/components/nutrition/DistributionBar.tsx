import React from "react";
import { motion } from "framer-motion";

interface DistributionBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

export const DistributionBar = ({
  label,
  value,
  total,
  color,
}: DistributionBarProps) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-xs font-bold text-gray-900">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
