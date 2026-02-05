import React from "react";
import { DayPlan, Recipe } from "@recipe-planner/shared";
import { DragItem } from "./constants";
import { DayColumn } from "./DayColumn";

interface WeekGridProps {
  weekDays: Date[];
  planDays: DayPlan[];
  recipes: Recipe[];
  formatDateLocal: (date: Date) => string;
  onAdd: (date: Date, type: string) => void;
  onRemove: (date: string, id: string) => void;
  onUpdateServings: (date: string, id: string, servings: number) => void;
  onDrop: (
    item: DragItem,
    targetDate: string,
    targetType: string,
    servingsOverride?: number,
  ) => void;
}

export const WeekGrid = ({
  weekDays,
  planDays,
  recipes,
  formatDateLocal,
  onAdd,
  onRemove,
  onUpdateServings,
  onDrop,
}: WeekGridProps) => {
  return (
    <div className="flex flex-col xl:flex-row gap-6 overflow-x-auto pb-4 -mx-2 px-2 snap-x">
      {weekDays.map((date) => (
        <DayColumn
          key={date.toISOString()}
          date={date}
          dayPlan={planDays?.find((d) => d && d.date === formatDateLocal(date))}
          recipes={recipes}
          isToday={date.toDateString() === new Date().toDateString()}
          onAdd={onAdd}
          onRemove={onRemove}
          onUpdateServings={onUpdateServings}
          onDrop={onDrop}
        />
      ))}
    </div>
  );
};
