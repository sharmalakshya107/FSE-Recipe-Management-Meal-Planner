import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button";

interface InventoryHeaderProps {
  itemCount: number;
  onAddClick: () => void;
}

export const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  itemCount,
  onAddClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight italic">
          Pantry Manager
        </h1>
        <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">
          {itemCount} Essentials in Stock
        </p>
      </div>
      <Button
        onClick={onAddClick}
        className="btn-primary shadow-lg shadow-indigo-100 flex items-center gap-2 h-14 px-8 rounded-2xl"
      >
        <Plus size={24} strokeWidth={3} />
        <span className="font-black">Add New Stock</span>
      </Button>
    </div>
  );
};
