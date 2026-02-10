import React, { memo } from "react";
import { Recipe } from "@recipe-planner/shared";
import { Clock, Users, Flame, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
}

export const RecipeCard = memo(({ recipe, onClick }: RecipeCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 overflow-hidden"
    >
      <div className="relative h-48 bg-gray-50">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-300">
            <span className="text-xs font-bold uppercase tracking-widest">
              No Image
            </span>
          </div>
        )}

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {recipe.dietaryTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-[10px] font-bold uppercase bg-white/90 text-gray-700 rounded-lg border border-gray-100 shadow-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
          {recipe.title}
        </h3>

        <p className="text-xs font-medium text-gray-500 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <Stat icon={Clock} value={`${recipe.prepTime + recipe.cookTime}m`} />
          <Stat icon={Users} value={`${recipe.servings} Servings`} />
          <Stat
            icon={Flame}
            value={`${recipe.nutrition?.calories || 0} kcal`}
          />
        </div>
      </div>
    </div>
  );
});

const Stat = memo(
  ({ icon: Icon, value }: { icon: LucideIcon; value: string }) => (
    <div className="flex items-center gap-1.5">
      <Icon size={14} className="text-gray-400" />
      <span className="text-[10px] font-bold text-gray-600 uppercase">
        {value}
      </span>
    </div>
  ),
);
