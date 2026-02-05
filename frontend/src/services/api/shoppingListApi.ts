import { baseApi } from "./baseApi";

export const shoppingListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShoppingList: builder.query<
      Record<string, import("@recipe-planner/shared").ShoppingListItem[]> & {
        totalItems: number;
      },
      { startDate: string; endDate: string }
    >({
      query: (params) => ({
        url: "/shopping-list/generate",
        params,
      }),
      providesTags: ["ShoppingList"],
    }),
  }),
});

export const { useGetShoppingListQuery } = shoppingListApi;
