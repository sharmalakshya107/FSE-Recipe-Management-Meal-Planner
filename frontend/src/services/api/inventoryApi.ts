import { baseApi } from "./baseApi";
import type {
  InventoryItem,
  CreateInventoryInput,
  UpdateInventoryInput,
} from "@recipe-planner/shared";

export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventory: builder.query<InventoryItem[], void>({
      query: () => "/inventory",
      providesTags: ["Inventory"],
    }),
    addInventoryItem: builder.mutation<InventoryItem, CreateInventoryInput>({
      query: (item) => ({
        url: "/inventory",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Inventory", "ShoppingList"],
    }),
    updateInventoryItem: builder.mutation<
      InventoryItem,
      { id: string; updates: UpdateInventoryInput }
    >({
      query: ({ id, updates }) => ({
        url: `/inventory/${id}`,
        method: "PUT",
        body: updates,
      }),
      invalidatesTags: ["Inventory", "ShoppingList"],
    }),
    deleteInventoryItem: builder.mutation<void, string>({
      query: (id) => ({
        url: `/inventory/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inventory", "ShoppingList"],
    }),
    addPurchasedItems: builder.mutation<
      void,
      { name: string; amount: number; unit: string }[]
    >({
      query: (items) => ({
        url: "/inventory/purchased",
        method: "POST",
        body: items,
      }),
      invalidatesTags: ["Inventory", "ShoppingList"],
    }),
  }),
});

export const {
  useGetInventoryQuery,
  useAddInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
  useAddPurchasedItemsMutation,
} = inventoryApi;
