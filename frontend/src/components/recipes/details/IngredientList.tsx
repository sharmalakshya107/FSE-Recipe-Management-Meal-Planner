import React from "react";
import { Ingredient } from "@recipe-planner/shared";
import { Utensils } from "lucide-react";

interface IngredientListProps {
  ingredients: Ingredient[];
}

export const IngredientList = ({ ingredients }: IngredientListProps) => (
  <div className="space-y-3">
    <h3 className="text-lg font-bold text-gray-900 pb-2 border-b-2 border-indigo-600 flex items-center gap-2">
      <Utensils size={18} className="text-indigo-600" />
      Ingredients
    </h3>
    <ul className="space-y-2">
      {ingredients.map((ing, idx) => (
        <li
          key={ing.id || idx}
          className="flex items-start gap-2 text-sm text-gray-800 bg-white p-2.5 rounded-lg border border-gray-200"
        >
          <span className="font-bold text-indigo-600 min-w-[70px] shrink-0">
            {ing.amount} {ing.unit}
          </span>
          <span className="flex-1 leading-snug">{ing.name}</span>
        </li>
      ))}
    </ul>
  </div>
);
