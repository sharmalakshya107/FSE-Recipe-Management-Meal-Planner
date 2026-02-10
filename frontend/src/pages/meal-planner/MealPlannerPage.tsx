import React, { useState } from "react";
import { useMealPlan } from "../../hooks/useMealPlan";
import { useRecipes } from "../../hooks/useRecipes";
import { Spinner } from "../../components/feedback/Spinner";
import { useToast } from "../../components/feedback/Toast";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  MEAL_TYPES,
  ITEM_TYPES,
} from "../../components/meal-planner/constants";
import { RecipeSidebar } from "../../components/meal-planner/RecipeSidebar";
import { ManualAddModal } from "../../components/meal-planner/ManualAddModal";
import { MealPlanHeader } from "../../components/meal-planner/MealPlanHeader";
import { WeekGrid } from "../../components/meal-planner/WeekGrid";
import { useMealPlanActions } from "../../hooks/useMealPlanActions";

const formatDateLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setHours(0, 0, 0, 0);
  return new Date(d.setDate(diff));
};

const MealPlannerPage = () => {
  const { addToast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const startOfWeek = getStartOfWeek(currentDate);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const { plan, isLoading, updateMealPlan } = useMealPlan(
    formatDateLocal(startOfWeek),
    formatDateLocal(endOfWeek),
  );

  const { recipes } = useRecipes({ limit: 1000 });

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedMealType, setSelectedMealType] = useState(MEAL_TYPES[0].label);

  const { handleDrop, handleUpdateServings, handleRemoveMeal } =
    useMealPlanActions({
      plan,
      recipes,
      startOfWeek,
      endOfWeek,
      updateMealPlan,
      addToast,
      formatDateLocal,
    });

  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const handleAddMeal = async (recipeId: string, servings: number) => {
    if (!selectedDay || !recipeId || !plan) return;
    const dateStr = formatDateLocal(selectedDay);
    handleDrop(
      { type: ITEM_TYPES.RECIPE, recipeId: recipeId },
      dateStr,
      selectedMealType.toLowerCase(),
      servings,
    );
    setIsManualModalOpen(false);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col lg:flex-row gap-8 h-full max-w-[1600px] mx-auto">
        <RecipeSidebar recipes={recipes} />

        <div className="flex-1 space-y-8 min-w-0">
          <MealPlanHeader
            startOfWeek={startOfWeek}
            endOfWeek={endOfWeek}
            currentDate={currentDate}
            onPrevWeek={handlePrevWeek}
            onNextWeek={handleNextWeek}
            onToday={() => setCurrentDate(new Date())}
            onShoppingList={() => {
              const s = formatDateLocal(startOfWeek);
              const e = formatDateLocal(endOfWeek);
              window.location.href = `/shopping-list?startDate=${s}&endDate=${e}`;
            }}
          />

          <WeekGrid
            weekDays={weekDays}
            planDays={plan?.days || []}
            recipes={recipes}
            formatDateLocal={formatDateLocal}
            onAdd={(d, type) => {
              setSelectedDay(d);
              setSelectedMealType(type);
              setIsManualModalOpen(true);
            }}
            onRemove={handleRemoveMeal}
            onUpdateServings={handleUpdateServings}
            onDrop={handleDrop}
          />
        </div>

        <ManualAddModal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          selectedMealType={selectedMealType}
          recipes={recipes}
          onAdd={(data) => handleAddMeal(data.recipeId, data.servings)}
        />
      </div>
    </DndProvider>
  );
};

export default MealPlannerPage;
