import {
  useGetInventoryQuery,
  useAddInventoryItemMutation,
  useUpdateInventoryItemMutation,
  useDeleteInventoryItemMutation,
} from "../services/api/inventoryApi";

export const useInventory = () => {
  const {
    data: inventory = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetInventoryQuery();

  const [addInventoryItem, { isLoading: isAdding }] =
    useAddInventoryItemMutation();
  const [updateInventoryItem, { isLoading: isUpdating }] =
    useUpdateInventoryItemMutation();
  const [deleteInventoryItem, { isLoading: isDeleting }] =
    useDeleteInventoryItemMutation();

  return {
    inventory,
    isLoading,
    isError,
    error,
    refetch,
    addInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,
    isAdding,
    isUpdating,
    isDeleting,
  };
};
