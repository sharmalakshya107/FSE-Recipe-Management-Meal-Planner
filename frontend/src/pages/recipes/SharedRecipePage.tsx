import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetSharedRecipeQuery } from "../../services/api/recipeApi";
import { Spinner } from "../../components/feedback/Spinner";
import { Alert } from "../../components/feedback/Alert";
import { Button } from "../../components/ui/Button";
import { ROUTES } from "../../config/routes";
import {
  Clock,
  Users,
  Utensils,
  Flame,
  ChefHat,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";

const SharedRecipePage = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const {
    data: recipe,
    isLoading,
    isError,
  } = useGetSharedRecipeQuery(shareId || "");

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 font-medium animate-pulse">
          Fetching a delicious recipe for you...
        </p>
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Utensils size={40} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Recipe Not Found
          </h1>
          <p className="text-gray-500 mb-8">
            The link you followed might be broken or the recipe has been
            unshared.
          </p>
          <Link to={ROUTES.HOME}>
            <Button className="w-full h-12 rounded-xl btn-primary">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[45vh] lg:h-[60vh] overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
            <ChefHat size={120} className="text-white/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-black uppercase tracking-widest border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              {recipe.title}
            </h1>
            <p className="text-lg text-white/80 max-w-2xl font-medium leading-relaxed">
              {recipe.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl lg:hidden">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">
                  Prep
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {recipe.prepTime}m
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">
                  Cook
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {recipe.cookTime}m
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">
                  Yield
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {recipe.servings} Servings
                </p>
              </div>
            </div>

            <section>
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Utensils size={20} />
                </div>
                Ingredients
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recipe.ingredients.map((ing) => (
                  <div
                    key={ing.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all group"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <span className="text-sm font-black text-indigo-600">
                        {ing.amount}
                      </span>
                      <span className="text-[8px] font-black uppercase text-gray-400">
                        {ing.unit}
                      </span>
                    </div>
                    <span className="text-gray-700 font-bold">{ing.name}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <ChefHat size={20} />
                </div>
                Instructions
              </h2>
              <div className="space-y-6">
                {recipe.instructions.map((inst, idx) => (
                  <div key={idx} className="flex gap-6 group">
                    <div className="shrink-0 w-10 h-10 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center font-black transition-colors group-hover:bg-purple-600 group-hover:text-white">
                      {idx + 1}
                    </div>
                    <div className="pt-2">
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {inst.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl shadow-gray-100/50 hidden lg:block">
              <h3 className="text-lg font-black text-gray-900 mb-6 tracking-tight uppercase border-b border-gray-50 pb-4">
                Recipe Specs
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">
                      Prep Time
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      {recipe.prepTime} Minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                    <Utensils size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">
                      Cook Time
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      {recipe.cookTime} Minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-gray-400 mb-0.5">
                      Yields
                    </p>
                    <p className="text-sm font-black text-gray-900">
                      {recipe.servings} Servings
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black rounded-3xl p-8 text-white shadow-2xl shadow-indigo-200">
              <div className="flex items-center gap-3 mb-8">
                <Flame size={24} className="text-amber-400" />
                <h3 className="text-lg font-black tracking-tight uppercase">
                  Nutrition{" "}
                  <span className="text-gray-500 font-bold">/ Serving</span>
                </h3>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-gray-400 font-bold uppercase text-xs">
                    Calories
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black italic">
                      {recipe.nutrition.calories}
                    </span>
                    <span className="text-xs font-black text-gray-500 uppercase">
                      kcal
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
                      Protein
                    </p>
                    <p className="text-lg font-black leading-none">
                      {recipe.nutrition.protein}g
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
                      Carbs
                    </p>
                    <p className="text-lg font-black leading-none">
                      {recipe.nutrition.carbs}g
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
                      Fat
                    </p>
                    <p className="text-lg font-black leading-none">
                      {recipe.nutrition.fat}g
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-[8px] font-black uppercase text-gray-500 mb-1">
                      Fiber
                    </p>
                    <p className="text-lg font-black leading-none">
                      {recipe.nutrition.fiber}g
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 text-white text-center relative overflow-hidden group">
              <div className="relative z-10">
                <h4 className="text-xl font-black mb-3 italic">
                  Love this recipe?
                </h4>
                <p className="text-white/80 text-sm mb-6 font-medium leading-relaxed">
                  Join our community to save this recipe to your notebook and
                  start meal planning today.
                </p>
                <Link to={ROUTES.REGISTER}>
                  <Button className="w-full bg-white text-indigo-600 hover:bg-gray-50 border-none rounded-2xl h-14 font-black transition-transform group-hover:scale-105 active:scale-95 shadow-xl shadow-indigo-900/40 uppercase tracking-widest text-xs">
                    Get Started Free <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
                <Link
                  to={ROUTES.LOGIN}
                  className="inline-block mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
                >
                  Already a member? Sign In
                </Link>
              </div>

              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full -translate-x-12 translate-y-12 blur-3xl" />
            </div>
          </div>
        </div>
      </div>

      <footer className="py-20 border-t border-gray-100 text-center">
        <Link
          to={ROUTES.HOME}
          className="flex items-center justify-center gap-2"
        >
          <Utensils size={32} className="text-indigo-600" />
          <span className="text-2xl font-black italic tracking-tighter text-gray-900">
            Flavor<span className="text-indigo-600">Flow</span>
          </span>
        </Link>
        <p className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-gray-400">
          The Future of Modern Cooking
        </p>
      </footer>
    </div>
  );
};

export default SharedRecipePage;
