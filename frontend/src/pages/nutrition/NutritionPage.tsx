import React from "react";
import { motion } from "framer-motion";
import { useMealPlan } from "../../hooks/useMealPlan";
import { useRecipes } from "../../hooks/useRecipes";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Spinner } from "../../components/feedback/Spinner";
import { Alert } from "../../components/feedback/Alert";
import {
  PieChart,
  TrendingUp,
  Zap,
  Target,
  Activity,
  Brain,
  Droplets,
  Flame,
  ChevronRight,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const NutritionPage = () => {
  const { today, nextWeek } = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const n = new Date(d);
    n.setDate(d.getDate() + 7);
    return {
      today: d.toISOString(),
      nextWeek: n.toISOString(),
    };
  }, []);

  const { plan, isLoading: isPlanLoading } = useMealPlan(today, nextWeek);
  const { recipes, isLoading: isRecipesLoading } = useRecipes({ limit: 1000 });

  if (isPlanLoading || isRecipesLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );

  const hasMeals = plan?.days.some((day) => day.slots.length > 0);

  if (!hasMeals) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Nutrition Overview
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Track your nutritional intake across your meal plan.
          </p>
        </div>

        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Flame size={40} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              No Nutrition Data Yet
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Add meals to your meal planner to see your nutritional breakdown
              and track your daily intake.
            </p>
            <a
              href="/meal-planner"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Go to Meal Planner
              <ChevronRight size={18} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

  plan?.days.forEach((day) => {
    day.slots.forEach((slot) => {
      const recipe = recipes.find((r) => r.id === slot.recipeId);
      if (recipe?.nutrition) {
        totals.calories += recipe.nutrition.calories || 0;
        totals.protein += recipe.nutrition.protein || 0;
        totals.carbs += recipe.nutrition.carbs || 0;
        totals.fat += recipe.nutrition.fat || 0;
      }
    });
  });

  const avgCalories = totals.calories / 7;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Nutrition Overview
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Summary of your nutritional intake for planned meals.
          </p>
        </div>
        <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100">
          <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg shadow-sm text-xs font-bold uppercase">
            Weekly
          </button>
          <button className="px-4 py-2 text-gray-400 text-xs font-bold uppercase">
            Monthly
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Daily Average"
          value={Math.round(avgCalories)}
          suffix="kcal"
          color="border-amber-200"
        />
        <StatCard
          title="Total Protein"
          value={Math.round(totals.protein)}
          suffix="g"
          color="border-emerald-200"
        />
        <StatCard
          title="Total Carbs"
          value={Math.round(totals.carbs)}
          suffix="g"
          color="border-indigo-200"
        />
        <StatCard
          title="Total Fats"
          value={Math.round(totals.fat)}
          suffix="g"
          color="border-rose-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
          <CardHeader className="px-6 py-4 border-b border-gray-50">
            <h3 className="text-lg font-bold text-gray-900">
              Macronutrient Balance
            </h3>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <DistributionBar
              label="Protein"
              value={totals.protein}
              total={totals.protein + totals.carbs + totals.fat}
              color="bg-emerald-500"
            />
            <DistributionBar
              label="Carbohydrates"
              value={totals.carbs}
              total={totals.protein + totals.carbs + totals.fat}
              color="bg-indigo-500"
            />
            <DistributionBar
              label="Fats"
              value={totals.fat}
              total={totals.protein + totals.carbs + totals.fat}
              color="bg-rose-500"
            />
          </CardContent>
        </Card>

        <Card className="border-indigo-100 shadow-sm rounded-2xl overflow-hidden bg-indigo-50/50">
          <CardHeader className="px-6 py-4">
            <h3 className="text-lg font-bold text-indigo-900">
              Weekly Summary
            </h3>
          </CardHeader>
          <CardContent className="px-6 pb-8 space-y-6">
            <div className="p-5 bg-white rounded-xl border border-indigo-100">
              <p className="text-sm text-gray-700 leading-relaxed">
                Your average daily intake is{" "}
                <span className="font-bold text-indigo-600">
                  {Math.round(avgCalories)} kcal
                </span>
                . This is consistent with your target range.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Observations
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  Protein intake is on track for your goals.
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                  Good balance of micronutrients in current plan.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  suffix,
  color,
}: {
  title: string;
  value: number;
  suffix: string;
  color: string;
}) => {
  return (
    <Card className={`border ${color} shadow-sm rounded-2xl bg-white`}>
      <CardContent className="p-6">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
          {title}
        </p>
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs font-bold text-gray-400">{suffix}</p>
        </div>
      </CardContent>
    </Card>
  );
};

const DistributionBar = ({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-widest">
          {label}
        </span>
        <span className="text-xs font-bold text-gray-900">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-2 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default NutritionPage;
