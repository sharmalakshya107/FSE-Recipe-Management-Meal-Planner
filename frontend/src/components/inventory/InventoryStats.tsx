import React from "react";
import { Package, Calendar, AlertCircle } from "lucide-react";

interface InventoryStatsProps {
  stats: {
    total: number;
    expired: number;
    expiringSoon: number;
  };
}

export const InventoryStats = ({ stats }: InventoryStatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
            Total Essentials
          </p>
          <p className="text-3xl font-black text-gray-900">{stats.total}</p>
        </div>
        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
          <Package size={24} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">
            Expiring Soon
          </p>
          <p className="text-3xl font-black text-gray-900">
            {stats.expiringSoon}
          </p>
        </div>
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
          <Calendar size={24} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">
            Stale / Expired
          </p>
          <p className="text-3xl font-black text-gray-900">{stats.expired}</p>
        </div>
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
          <AlertCircle size={24} />
        </div>
      </div>
    </div>
  );
};
