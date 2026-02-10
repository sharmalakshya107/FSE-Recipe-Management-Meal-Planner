import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { ShoppingListItem } from "@recipe-planner/shared";

interface ShoppingListCategoryProps {
  category: string;
  items: ShoppingListItem[];
  checkedItems: Record<string, boolean>;
  onToggleItem: (id: string) => void;
  formatAmount: (amount: number) => string;
}

export const ShoppingListCategory = ({
  category,
  items,
  checkedItems,
  onToggleItem,
  formatAmount,
}: ShoppingListCategoryProps) => {
  return (
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow">
      <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <h3 className="text-lg font-black text-gray-900 capitalize italic">
            {category}
          </h3>
        </div>
        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-lg">
          {items.length}
        </span>
      </div>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-50">
          {items.map((item) => (
            <li
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-all ${
                checkedItems[item.id] ? "bg-gray-50/80" : ""
              }`}
            >
              <div className="flex items-center space-x-4">
                {checkedItems[item.id] ? (
                  <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-100 scale-110 transition-transform">
                    <CheckCircle2 size={16} />
                  </div>
                ) : (
                  <div className="w-6 h-6 border-2 border-gray-200 rounded-full transition-colors group-hover:border-indigo-300" />
                )}
                <div>
                  <p
                    className={`text-sm font-bold text-gray-900 transition-all ${
                      checkedItems[item.id] ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {item.name}
                  </p>
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${
                      checkedItems[item.id]
                        ? "text-gray-300"
                        : "text-indigo-500"
                    }`}
                  >
                    {formatAmount(item.amount)} {item.unit}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
