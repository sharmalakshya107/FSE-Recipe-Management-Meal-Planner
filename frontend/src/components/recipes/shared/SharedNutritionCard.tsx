import React from "react";
import { Flame } from "lucide-react";
import { Recipe } from "@recipe-planner/shared";

interface SharedNutritionCardProps {
  nutrition: Recipe["nutrition"];
}

export const SharedNutritionCard = ({
  nutrition,
}: SharedNutritionCardProps) => {
  return (
    <div className="bg-black rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200">
      <div className="flex items-center gap-3 mb-8">
        <Flame size={24} className="text-amber-400" />
        <h3 className="text-lg font-black tracking-tight uppercase">
          Nutrition <span className="text-gray-500 font-bold">/ Serving</span>
        </h3>
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-baseline">
          <span className="text-gray-400 font-bold uppercase text-xs">
            Calories
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black italic">
              {nutrition.calories}
            </span>
            <span className="text-xs font-black text-gray-500 uppercase">
              kcal
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
              Protein
            </p>
            <p className="text-lg font-black leading-none">
              {nutrition.protein}g
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
              Carbs
            </p>
            <p className="text-lg font-black leading-none">
              {nutrition.carbs}g
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
              Fat
            </p>
            <p className="text-lg font-black leading-none">{nutrition.fat}g</p>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
              Fiber
            </p>
            <p className="text-lg font-black leading-none">
              {nutrition.fiber}g
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
