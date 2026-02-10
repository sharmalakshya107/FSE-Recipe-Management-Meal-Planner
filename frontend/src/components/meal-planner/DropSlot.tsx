import React from "react";
import { useDrop } from "react-dnd";
import { MealType, Recipe, MealSlot } from "@recipe-planner/shared";
import { Plus, LucideIcon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { MEAL_TYPES, DAYS, DragItem, ITEM_TYPES } from "./constants";
import { PlannedMeal } from "./PlannedMeal";

interface DropSlotProps {
  date: Date;
  mealType: {
    id: string;
    label: string;
    icon: LucideIcon;
    color: string;
    bg: string;
  };
  slots: MealSlot[];
  recipes: Recipe[];
  onAdd: (date: Date, type: string) => void;
  onRemove: (date: string, id: string) => void;
  onUpdateServings: (date: string, id: string, servings: number) => void;
  onDrop: (item: DragItem, targetDate: string, targetType: string) => void;
}

const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const DropSlot = React.memo(
  ({
    date,
    mealType,
    slots,
    recipes,
    onAdd,
    onRemove,
    onUpdateServings,
    onDrop,
  }: DropSlotProps) => {
    const dateStr = formatDateLocal(date);
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
      accept: [ITEM_TYPES.MEAL, ITEM_TYPES.RECIPE],
      drop: (item: DragItem) => onDrop(item, dateStr, mealType.id),
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }));

    const Icon = mealType.icon;

    return (
      <div
        ref={drop}
        className={`
        relative min-h-[100px] p-3 rounded-2xl border-2 border-transparent transition-all
        ${isOver ? "bg-indigo-50/50 border-dashed border-indigo-400/50" : "bg-gray-50/30"}
        ${canDrop && !isOver ? "bg-indigo-50/20" : ""}
      `}
      >
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${mealType.bg} ${mealType.color}`}
            >
              <Icon size={14} />
            </div>
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
              {mealType.label}
            </span>
          </div>
          <button
            onClick={() => onAdd(date, mealType.label)}
            className="p-1 text-gray-300 hover:text-indigo-600 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-100"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {slots.map((slot) => {
              const recipe = recipes.find((r) => r.id === slot.recipeId);
              return (
                <PlannedMeal
                  key={slot.id}
                  slot={slot}
                  recipe={recipe}
                  date={dateStr}
                  mealType={mealType.id}
                  onRemove={onRemove}
                  onUpdateServings={onUpdateServings}
                />
              );
            })}
          </AnimatePresence>

          {slots.length === 0 && (
            <div className="py-4 text-center border border-dashed border-gray-100 rounded-xl opacity-40">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                Drop Here
              </p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

DropSlot.displayName = "DropSlot";
