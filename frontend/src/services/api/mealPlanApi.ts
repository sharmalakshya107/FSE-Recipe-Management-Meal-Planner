import { baseApi } from "./baseApi";
import type { MealPlan, UpdateMealPlanInput } from "@recipe-planner/shared";

export const mealPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMealPlan: builder.query<
      MealPlan,
      { startDate: string; endDate: string }
    >({
      query: (params) => ({
        url: "/meal-planner",
        params,
      }),
      providesTags: ["MealPlan"],
    }),
    updateMealPlan: builder.mutation<
      MealPlan,
      {
        id: string;
        updates: UpdateMealPlanInput;
        range?: { startDate: string; endDate: string };
      }
    >({
      query: ({ id, updates }) => ({
        url: `/meal-planner/${id}`,
        method: "PUT",
        body: updates,
      }),
      async onQueryStarted({ updates, range }, { dispatch, queryFulfilled }) {
        if (!range) return;

        const patchResult = dispatch(
          mealPlanApi.util.updateQueryData("getMealPlan", range, (draft) => {
            if (updates.days) {
              draft.days = updates.days;
            }
          }),
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["MealPlan", "ShoppingList"],
    }),
    deleteMealPlan: builder.mutation<void, string>({
      query: (id) => ({
        url: `/meal-planner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MealPlan", "ShoppingList"],
    }),
  }),
});

export const {
  useGetMealPlanQuery,
  useUpdateMealPlanMutation,
  useDeleteMealPlanMutation,
} = mealPlanApi;
