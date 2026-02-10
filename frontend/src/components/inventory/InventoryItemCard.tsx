import React, { memo } from "react";
import { Card, CardContent } from "../ui/Card";
import { Package, Tag, Calendar, Edit2, Trash2 } from "lucide-react";
import { InventoryItem } from "@recipe-planner/shared";

interface InventoryItemCardProps {
  item: InventoryItem;
  onEdit: (item: InventoryItem) => void;
  onDelete: (id: string) => void;
}

export const InventoryItemCard = memo(
  ({ item, onEdit, onDelete }: InventoryItemCardProps) => {
    const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();

    return (
      <Card
        key={item.id}
        className="border-none shadow-sm rounded-[32px] bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                <Package size={28} />
              </div>
              <div>
                <h3 className="font-black text-xl text-gray-900 leading-tight tracking-tight capitalize">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-indigo-600 font-black text-sm">
                    {item.amount}
                  </span>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {item.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <div className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 flex items-center gap-1.5">
              <Tag size={12} strokeWidth={2.5} className="text-indigo-400" />
              {item.category || "Other"}
            </div>
            {item.expiryDate && (
              <div
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${
                  isExpired
                    ? "bg-rose-50 text-rose-600 border-rose-100"
                    : "bg-amber-50 text-amber-600 border-amber-100"
                }`}
              >
                <Calendar size={12} strokeWidth={2.5} />
                {new Date(item.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-50">
            <button
              onClick={() => onEdit(item)}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
            >
              <Edit2 size={16} strokeWidth={2.5} />
              Edit
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all border border-transparent hover:border-rose-100"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </CardContent>
      </Card>
    );
  },
);
