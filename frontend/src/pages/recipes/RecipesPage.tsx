import React, { useState } from "react";
import { useRecipes } from "../../hooks/useRecipes";
import { RecipeCard } from "../../components/recipes/RecipeCard";
import { Spinner } from "../../components/feedback/Spinner";
import { Alert } from "../../components/feedback/Alert";
import { useDebounce } from "../../hooks/useDebounce";
import { CreateRecipeModal } from "../../components/recipes/CreateRecipeModal";
import { ImportRecipeModal } from "../../components/recipes/ImportRecipeModal";
import { RecipeDetailsModal } from "../../components/recipes/RecipeDetailsModal";
import { EditRecipeModal } from "../../components/recipes/EditRecipeModal";
import { useToast } from "../../components/feedback/Toast";
import { Recipe } from "@recipe-planner/shared";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { DietaryFilters } from "../../components/recipes/DietaryFilters";
import { Pagination } from "../../components/ui/Pagination";
import { RecipeHeader } from "../../components/recipes/RecipeHeader";
import { RecipeSearch } from "../../components/recipes/RecipeSearch";
import { RecipeEmptyState } from "../../components/recipes/RecipeEmptyState";

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
      <RecipeHeader
        onImportClick={() => setIsImportModalOpen(true)}
        onAddClick={() => setIsCreateModalOpen(true)}
      />

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

      <RecipeSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <DietaryFilters
        activeTags={filters.dietaryTags || []}
        onChange={(tags) => updateFilters({ dietaryTags: tags })}
      />

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
            <RecipeEmptyState onClearSearch={() => setSearchTerm("")} />
          )}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default RecipesPage;
