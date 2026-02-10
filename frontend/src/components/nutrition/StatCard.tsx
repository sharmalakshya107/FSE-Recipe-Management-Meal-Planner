import React from "react";
import { Card, CardContent } from "../ui/Card";

interface StatCardProps {
  title: string;
  value: number;
  suffix: string;
  color: string;
}

export const StatCard = ({ title, value, suffix, color }: StatCardProps) => {
  return (
    <Card className={`border ${color} shadow-sm rounded-2xl bg-white`}>
      <CardContent className="p-6">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs font-bold text-gray-400">{suffix}</p>
        </div>
      </CardContent>
    </Card>
  );
};
