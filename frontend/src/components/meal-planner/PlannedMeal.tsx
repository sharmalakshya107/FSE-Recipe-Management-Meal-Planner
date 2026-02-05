import React from "react";
import { useDrag } from "react-dnd";
import { X, Minus, Plus, GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { MealSlot, Recipe } from "@recipe-planner/shared";
import { ITEM_TYPES } from "./constants";

interface PlannedMealProps {
  slot: MealSlot;
  recipe?: Recipe;
  date: string;
  mealType: string;
  onRemove: (date: string, id: string) => void;
  onUpdateServings: (date: string, id: string, servings: number) => void;
}

export const PlannedMeal = React.forwardRef<HTMLDivElement, PlannedMealProps>(
  ({ slot, recipe, date, mealType, onRemove, onUpdateServings }, ref) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: ITEM_TYPES.MEAL,
      item: {
        slotId: slot.id,
        originalDate: date,
        originalType: mealType,
        type: ITEM_TYPES.MEAL,
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));

    const setRef = React.useCallback(
      (element: HTMLDivElement | null) => {
        drag(element);
        if (typeof ref === "function") {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [drag, ref],
    );

    return (
      <motion.div
        layout
        ref={setRef}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`
        bg-white border border-gray-100/50 p-2.5 rounded-xl flex flex-col group 
        cursor-grab active:cursor-grabbing hover:shadow-sm hover:border-indigo-100 transition-all
        ${isDragging ? "opacity-20 translate-z-0" : ""}
      `}
      >
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-black text-gray-800 line-clamp-2 leading-tight flex-1">
            {recipe?.title || "Unknown Recipe"}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(date, slot.id);
            }}
            className="p-1 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-md transition-colors opacity-0 group-hover:opacity-100 ml-1"
          >
            <X size={12} />
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-gray-50 pt-2 mt-auto">
          <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateServings(date, slot.id, slot.servings - 1);
              }}
              className="p-0.5 hover:bg-white rounded-md text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30"
              disabled={slot.servings <= 1}
            >
              <Minus size={10} />
            </button>
            <span className="text-[10px] font-black text-gray-700 min-w-[2ch] text-center">
              {slot.servings}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateServings(date, slot.id, slot.servings + 1);
              }}
              className="p-0.5 hover:bg-white rounded-md text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-30"
              disabled={slot.servings >= 20}
            >
              <Plus size={10} />
            </button>
          </div>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
            Servings
          </span>
        </div>
      </motion.div>
    );
  },
);

PlannedMeal.displayName = "PlannedMeal";
