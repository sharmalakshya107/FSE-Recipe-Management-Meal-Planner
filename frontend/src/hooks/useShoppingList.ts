import { useGetShoppingListQuery } from "../services/api/shoppingListApi";

export const useShoppingList = (startDate: string, endDate: string) => {
  const {
    data: list,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetShoppingListQuery({
    startDate,
    endDate,
  });

  return {
    list,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};
