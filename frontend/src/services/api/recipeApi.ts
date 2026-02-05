import { baseApi } from "./baseApi";
import type {
  Recipe,
  CreateRecipeInput,
  UpdateRecipeInput,
  ImportRecipeInput,
  NutritionInfo,
  Ingredient,
} from "@recipe-planner/shared";

export const recipeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query<
      { data: Recipe[]; total: number },
      {
        page?: number;
        limit?: number;
        search?: string;
        dietaryTags?: string[];
      } | void
    >({
      query: (params) => ({
        url: "/recipes",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Recipe" as const, id })),
              { type: "Recipe", id: "LIST" },
            ]
          : [{ type: "Recipe", id: "LIST" }],
    }),
    getRecipe: builder.query<Recipe, string>({
      query: (id) => `/recipes/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Recipe", id }],
    }),
    createRecipe: builder.mutation<Recipe, CreateRecipeInput>({
      query: (recipe) => ({
        url: "/recipes",
        method: "POST",
        body: recipe,
      }),
      invalidatesTags: [{ type: "Recipe", id: "LIST" }],
    }),
    importRecipe: builder.mutation<Recipe, ImportRecipeInput>({
      query: (data) => ({
        url: "/recipes/import",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Recipe", id: "LIST" }],
    }),
    scaleRecipe: builder.query<Recipe, { id: string; servings: number }>({
      query: ({ id, servings }) => `/recipes/${id}/scale?servings=${servings}`,
    }),
    updateRecipe: builder.mutation<
      Recipe,
      { id: string; data: UpdateRecipeInput }
    >({
      query: ({ id, data }) => ({
        url: `/recipes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Recipe", id },
        { type: "Recipe", id: "LIST" },
      ],
    }),
    deleteRecipe: builder.mutation<void, string>({
      query: (id) => ({
        url: `/recipes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Recipe", id: "LIST" }],
    }),
    shareRecipe: builder.mutation<
      { shareId: string; shareUrl: string },
      string
    >({
      query: (id) => ({
        url: `/recipes/${id}/share`,
        method: "POST",
      }),
    }),
    getSharedRecipe: builder.query<Recipe, string>({
      query: (shareId) => `/recipes/share/${shareId}`,
      providesTags: (_result, _error, shareId) => [
        { type: "Recipe", id: shareId },
      ],
    }),
    calculateNutrition: builder.mutation<
      NutritionInfo,
      { ingredients: Ingredient[]; servings: number }
    >({
      query: (data) => ({
        url: "/recipes/calculate",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeQuery,
  useCreateRecipeMutation,
  useImportRecipeMutation,
  useLazyScaleRecipeQuery,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
  useShareRecipeMutation,
  useGetSharedRecipeQuery,
  useCalculateNutritionMutation,
} = recipeApi;
