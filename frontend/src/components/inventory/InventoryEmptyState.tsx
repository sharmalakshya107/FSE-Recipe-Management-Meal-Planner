import React from "react";
import { Package } from "lucide-react";

export const InventoryEmptyState = () => {
  return (
    <div className="col-span-full py-24 text-center bg-white border-2 border-dashed border-gray-100 rounded-[40px]">
      <Package size={48} className="text-gray-100 mx-auto mb-6" />
      <h3 className="text-2xl font-black text-gray-900 mb-2 italic">
        Nothing here yet
      </h3>
      <p className="text-gray-400 font-bold max-w-xs mx-auto">
        Your pantry is looking a bit empty. Start tracking your ingredients!
      </p>
    </div>
  );
};
