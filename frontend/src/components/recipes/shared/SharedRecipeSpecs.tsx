import React from "react";
import { Clock, Utensils, Users } from "lucide-react";

interface SharedRecipeSpecsProps {
  prepTime: number;
  cookTime: number;
  servings: number;
  className?: string;
}

export const SharedRecipeSpecs = ({
  prepTime,
  cookTime,
  servings,
  className = "",
}: SharedRecipeSpecsProps) => {
  return (
    <div
      className={`bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50 ${className}`}
    >
      <h3 className="text-lg font-black text-gray-900 mb-6 tracking-tight uppercase border-b border-gray-50 pb-4">
        Recipe Specs
      </h3>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">
              Prep Time
            </p>
            <p className="text-sm font-black text-gray-900">
              {prepTime} Minutes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
            <Utensils size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">
              Cook Time
            </p>
            <p className="text-sm font-black text-gray-900">
              {cookTime} Minutes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">
              Yields
            </p>
            <p className="text-sm font-black text-gray-900">
              {servings} Servings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
