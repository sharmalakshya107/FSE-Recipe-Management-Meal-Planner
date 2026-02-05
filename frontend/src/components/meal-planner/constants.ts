import { Coffee, Sun, Moon, Cookie } from "lucide-react";

export const MEAL_TYPES = [
  {
    id: "breakfast",
    label: "Breakfast",
    icon: Coffee,
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    id: "lunch",
    label: "Lunch",
    icon: Sun,
    color: "text-sky-500",
    bg: "bg-sky-50",
  },
  {
    id: "dinner",
    label: "Dinner",
    icon: Moon,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    id: "snack",
    label: "Snack",
    icon: Cookie,
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
];

export const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const ITEM_TYPES = {
  MEAL: "MEAL",
  RECIPE: "RECIPE",
};

export interface DragItem {
  id?: string;
  recipeId?: string;
  slotId?: string;
  originalDate?: string;
  originalType?: string;
  type: string;
}
