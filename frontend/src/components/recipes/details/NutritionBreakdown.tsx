import React from "react";
import { Recipe } from "@recipe-planner/shared";

interface NutritionBreakdownProps {
  nutrition: Recipe["nutrition"];
}

export const NutritionBreakdown = ({ nutrition }: NutritionBreakdownProps) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
        Protein
      </p>
      <p className="text-sm font-black text-emerald-900">
        {nutrition.protein}g
      </p>
    </div>
    <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
      <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
        Carbs
      </p>
      <p className="text-sm font-black text-amber-900">{nutrition.carbs}g</p>
    </div>
    <div className="bg-rose-50/50 border border-rose-100 p-3 rounded-xl">
      <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest mb-1">
        Fat
      </p>
      <p className="text-sm font-black text-rose-900">{nutrition.fat}g</p>
    </div>
    <div className="bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl">
      <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
        Fiber
      </p>
      <p className="text-sm font-black text-indigo-900">{nutrition.fiber}g</p>
    </div>
  </div>
);
