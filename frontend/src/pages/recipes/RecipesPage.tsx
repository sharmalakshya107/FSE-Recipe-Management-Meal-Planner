import React, { useState } from "react";
import { useRecipes } from "../../hooks/useRecipes";
import { RecipeCard } from "../../components/recipes/RecipeCard";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/feedback/Spinner";
import { Alert } from "../../components/feedback/Alert";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Plus,
  Compass,
  LayoutGrid,
  Link2,
} from "lucide-react";
import { useDebounce } from "../../hooks/useDebounce";
import { CreateRecipeModal } from "../../components/recipes/CreateRecipeModal";
import { ImportRecipeModal } from "../../components/recipes/ImportRecipeModal";
import { RecipeDetailsModal } from "../../components/recipes/RecipeDetailsModal";
import { EditRecipeModal } from "../../components/recipes/EditRecipeModal";
import { useToast } from "../../components/feedback/Toast";
import { Recipe } from "@recipe-planner/shared";
import { ConfirmModal } from "../../components/ui/ConfirmModal";

const RecipesPage = () => {
  const { addToast } = useToast();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState<Recipe | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [recipeToDelete, setRecipeToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    recipes,
    total,
    page,
    setPage,
    limit,
    filters,
    updateFilters,
    isLoading,
    isError,
    error,
    deleteRecipe,
  } = useRecipes();

  const handleEdit = (recipe: Recipe) => {
    setRecipeToEdit(recipe);
    setIsEditModalOpen(true);
    setSelectedRecipe(null);
  };

  const handleDelete = (id: string) => {
    setRecipeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!recipeToDelete) return;

    try {
      await deleteRecipe(recipeToDelete).unwrap();
      addToast("Recipe deleted successfully", "success");
      setSelectedRecipe(null);
      setIsDeleteModalOpen(false);
      setRecipeToDelete(null);
    } catch (err) {
      addToast("Failed to delete recipe", "error");
    }
  };

  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearch = useDebounce(searchTerm, 500);

  React.useEffect(() => {
    updateFilters({ search: debouncedSearch });
  }, [debouncedSearch, updateFilters]);

  const totalPages = Math.ceil(total / limit);

  if (isError) {
    return (
      <Alert variant="error">
        {(error as { data?: { message?: string } })?.data?.message ||
          "Failed to load recipes."}
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Recipe Explorer
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Browse our collection and find your next favorite meal.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsImportModalOpen(true)}
            variant="outline"
            className="rounded-xl h-11 px-5"
          >
            <Link2 size={18} className="mr-2" />
            Import from URL
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary h-11 px-6 rounded-xl"
          >
            <Plus size={18} className="mr-2" />
            Add New Recipe
          </Button>
        </div>
      </div>

      <CreateRecipeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditRecipeModal
        isOpen={isEditModalOpen}
        recipe={recipeToEdit}
        onClose={() => {
          setIsEditModalOpen(false);
          setRecipeToEdit(null);
        }}
      />

      <ImportRecipeModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <RecipeDetailsModal
        recipe={selectedRecipe}
        isOpen={!!selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRecipeToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Recipe"
        message="Are you sure you want to delete this recipe? This action cannot be undone."
        confirmLabel="Delete Recipe"
      />

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:border-indigo-500 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Dietary Filters Bar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
        <button
          onClick={() => updateFilters({ dietaryTags: [] })}
          className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
            !filters.dietaryTags?.length
              ? "bg-black text-white border-black shadow-lg shadow-gray-200"
              : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
          }`}
        >
          All Recipes
        </button>
        {[
          "vegan",
          "vegetarian",
          "gluten-free",
          "dairy-free",
          "keto",
          "paleo",
        ].map((tag) => {
          const isActive = filters.dietaryTags?.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => {
                const newTags = isActive
                  ? filters.dietaryTags?.filter((t) => t !== tag)
                  : [...(filters.dietaryTags || []), tag];
                updateFilters({ dietaryTags: newTags });
              }}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                  : "bg-white text-gray-400 border-gray-100 hover:border-indigo-100 hover:text-indigo-600"
              }`}
            >
              {tag.replace("-", " ")}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>

          {recipes.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                No recipes found
              </h3>
              <p className="text-gray-500 font-medium">
                Try adjusting your search filters.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 font-bold text-xs uppercase text-indigo-600 hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100">
              <p className="text-sm font-bold text-gray-400 uppercase">
                Page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl h-10 px-3 border-gray-200"
                >
                  <ChevronLeft size={18} />
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                          page === p
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl h-10 px-3 border-gray-200"
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
