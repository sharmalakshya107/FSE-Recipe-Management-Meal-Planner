import React from "react";
import { useDrag } from "react-dnd";
import { Utensils, GripVertical } from "lucide-react";
import { Recipe } from "@recipe-planner/shared";
import { ITEM_TYPES } from "./constants";

export const DraggableRecipe = React.memo(({ recipe }: { recipe: Recipe }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPES.RECIPE,
    item: { recipeId: recipe.id, type: ITEM_TYPES.RECIPE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`
        bg-white border border-gray-100 p-3 rounded-2xl flex items-center gap-3 
        cursor-grab active:cursor-grabbing hover:border-indigo-200 hover:shadow-md 
        transition-all mb-3 group
        ${isDragging ? "opacity-40 scale-95" : "opacity-100"}
      `}
    >
      <div className="w-10 h-10 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Utensils size={16} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900 truncate">
          {recipe.title}
        </p>
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest leading-none mt-1">
          {recipe.nutrition.calories} kcal
        </p>
      </div>
      <GripVertical
        size={16}
        className="text-gray-300 group-hover:text-indigo-400"
      />
    </div>
  );
});

DraggableRecipe.displayName = "DraggableRecipe";
