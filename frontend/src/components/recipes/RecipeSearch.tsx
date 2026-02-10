import React from "react";
import { Search } from "lucide-react";

interface RecipeSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const RecipeSearch: React.FC<RecipeSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 outline-none transition-all font-medium"
        />
      </div>
    </div>
  );
};
