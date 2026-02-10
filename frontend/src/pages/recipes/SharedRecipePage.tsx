import React from "react";
import { useParams, Link } from "react-router-dom";
import { useGetSharedRecipeQuery } from "../../services/api/recipeApi";
import { Spinner } from "../../components/feedback/Spinner";
import { Utensils } from "lucide-react";
import { ROUTES } from "../../config/routes";
import { RecipeHero } from "../../components/recipes/shared/RecipeHero";
import { SharedIngredientsList } from "../../components/recipes/shared/SharedIngredientsList";
import { SharedInstructionsList } from "../../components/recipes/shared/SharedInstructionsList";
import { SharedRecipeSpecs } from "../../components/recipes/shared/SharedRecipeSpecs";
import { SharedNutritionCard } from "../../components/recipes/shared/SharedNutritionCard";
import { SharedPromotionalCard } from "../../components/recipes/shared/SharedPromotionalCard";
import { Button } from "../../components/ui/Button";

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
      <RecipeHero
        title={recipe.title}
        description={recipe.description}
        imageUrl={recipe.imageUrl}
        dietaryTags={recipe.dietaryTags}
      />

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

            <SharedIngredientsList ingredients={recipe.ingredients} />
            <SharedInstructionsList instructions={recipe.instructions} />
          </div>

          <div className="space-y-8">
            <SharedRecipeSpecs
              prepTime={recipe.prepTime}
              cookTime={recipe.cookTime}
              servings={recipe.servings}
              className="hidden lg:block"
            />
            <SharedNutritionCard nutrition={recipe.nutrition} />
            <SharedPromotionalCard />
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
