import React from "react";
import { Search } from "lucide-react";

interface InventoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  currentFilter: "all" | "expired" | "soon";
  onFilterChange: (filter: "all" | "expired" | "soon") => void;
}

const FILTER_OPTIONS = [
  { id: "all", label: "All Items" },
  { id: "soon", label: "Expiring Soon" },
  { id: "expired", label: "Expired" },
] as const;

export const InventoryFilters = ({
  search,
  onSearchChange,
  currentFilter,
  onFilterChange,
}: InventoryFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[72px] z-30 py-2 bg-gray-50/80 backdrop-blur-md">
      <div className="relative group w-full md:max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-5 text-indigo-500 transition-colors group-focus-within:text-indigo-600">
          <Search size={18} strokeWidth={3} />
        </div>
        <input
          type="text"
          placeholder="Search stock..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-6 py-4 bg-white border-2 border-transparent rounded-[20px] shadow-sm outline-none focus:border-indigo-600/10 focus:ring-4 focus:ring-indigo-600/5 transition-all font-bold text-sm text-gray-800 placeholder:text-gray-400"
        />
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 gap-1 w-full md:w-auto">
        {FILTER_OPTIONS.map((t) => (
          <button
            key={t.id}
            onClick={() => onFilterChange(t.id)}
            className={`
                flex-1 md:flex-none px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                ${
                  currentFilter === t.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                }
              `}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};
