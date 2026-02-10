import React from "react";
import { Clock, Users, Flame, Minus, Plus } from "lucide-react";

interface RecipeStatsProps {
  totalTime: number;
  servings: number;
  calories: number;
  onUpdateServings: (newServings: number) => void;
  isScaling?: boolean;
}

export const RecipeStats = ({
  totalTime,
  servings,
  calories,
  onUpdateServings,
  isScaling,
}: RecipeStatsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    <div className="bg-white border border-gray-200 p-4 rounded-2xl text-center">
      <div className="inline-flex p-2 bg-indigo-50 text-indigo-600 rounded-lg mb-2">
        <Clock size={20} />
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
        Total Time
      </p>
      <p className="text-lg font-bold text-gray-900">{totalTime} min</p>
    </div>

    <div className="bg-white border border-gray-200 p-4 rounded-2xl text-center relative overflow-hidden group">
      <div className="inline-flex p-2 bg-amber-50 text-amber-600 rounded-lg mb-2 group-hover:bg-amber-100 transition-colors">
        <Users size={20} />
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
        Servings
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => onUpdateServings(servings - 1)}
          disabled={servings <= 1 || isScaling}
          className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
        >
          <Minus size={16} />
        </button>
        <span className="text-lg font-black text-gray-900 min-w-[2ch]">
          {servings}
        </span>
        <button
          onClick={() => onUpdateServings(servings + 1)}
          disabled={servings >= 50 || isScaling}
          className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 disabled:opacity-30 transition-all"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>

    <div className="bg-white border border-gray-200 p-4 rounded-2xl text-center">
      <div className="inline-flex p-2 bg-indigo-50 text-indigo-600 rounded-lg mb-2">
        <Flame size={20} />
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
        Calories
      </p>
      <p className="text-lg font-bold text-gray-900">
        {calories > 0 ? `${calories} kcal` : "— kcal"}
      </p>
    </div>
  </div>
);
