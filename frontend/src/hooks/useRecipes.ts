import {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useImportRecipeMutation,
  useCalculateNutritionMutation,
} from "../services/api/recipeApi";
import { useState, useCallback } from "react";

export const useRecipes = (
  options: {
    page?: number;
    limit?: number;
    filters?: { search?: string; dietaryTags?: string[]; createdBy?: string };
  } = {},
) => {
  const [page, setPage] = useState(options.page || 1);
  const [limit, setLimit] = useState(options.limit || 10);
  const [filters, setFilters] = useState({
    search: options.filters?.search || "",
    dietaryTags: options.filters?.dietaryTags || ([] as string[]),
    createdBy: options.filters?.createdBy || "",
  });

  const { data, isLoading, isError, error, refetch } = useGetRecipesQuery({
    page,
    limit,
    ...filters,
  });

  const [createRecipe, { isLoading: isCreating }] = useCreateRecipeMutation();
  const [updateRecipe, { isLoading: isUpdating }] = useUpdateRecipeMutation();
  const [deleteRecipe, { isLoading: isDeleting }] = useDeleteRecipeMutation();
  const [importRecipe, { isLoading: isImporting }] = useImportRecipeMutation();
  const [calculateNutrition, { isLoading: isCalculatingNutrition }] =
    useCalculateNutritionMutation();

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  }, []);

  return {
    recipes: data?.data || [],
    total: data?.total || 0,
    page,
    limit,
    setPage,
    setLimit,
    filters,
    updateFilters,
    isLoading,
    isError,
    error,
    refetch,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    importRecipe,
    calculateNutrition,
    isCreating,
    isUpdating,
    isDeleting,
    isImporting,
    isCalculatingNutrition,
  };
};
