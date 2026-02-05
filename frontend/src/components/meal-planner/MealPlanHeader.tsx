import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  ShoppingBag,
} from "lucide-react";
import { Button } from "../ui/Button";

interface MealPlanHeaderProps {
  startOfWeek: Date;
  endOfWeek: Date;
  currentDate: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onToday: () => void;
  onShoppingList: () => void;
}

export const MealPlanHeader = ({
  startOfWeek,
  endOfWeek,
  currentDate,
  onPrevWeek,
  onNextWeek,
  onToday,
  onShoppingList,
}: MealPlanHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-200 flex items-center justify-center text-white shrink-0">
          <CalendarIcon size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">
            Meal Planner
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
            Week of{" "}
            {startOfWeek.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-lg shadow-gray-100 border border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={onShoppingList}
          className="px-6 h-10 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-50 hover:text-emerald-600 border border-transparent hover:border-emerald-100"
        >
          <ShoppingBag size={16} className="mr-2" />
          Shopping List
        </Button>
        <div className="w-px h-6 bg-gray-100 mx-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevWeek}
          className="rounded-xl w-10 h-10 p-0"
        >
          <ChevronLeft size={20} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToday}
          className="px-6 h-10 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-50 hover:text-indigo-600"
        >
          Today
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onNextWeek}
          className="rounded-xl w-10 h-10 p-0"
        >
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};
