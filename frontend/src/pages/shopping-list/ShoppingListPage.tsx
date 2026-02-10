import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useShoppingList } from "../../hooks/useShoppingList";
import { Spinner } from "../../components/feedback/Spinner";
import { Alert } from "../../components/feedback/Alert";
import { useAddPurchasedItemsMutation } from "../../services/api/inventoryApi";
import { useToast } from "../../components/feedback/Toast";
import { ShoppingListItem } from "@recipe-planner/shared";
import { ShoppingListHeader } from "../../components/shopping/ShoppingListHeader";
import { ShoppingListCategory } from "../../components/shopping/ShoppingListCategory";
import { EmptyShoppingList } from "../../components/shopping/EmptyShoppingList";

const formatAmount = (amount: number) => {
  if (amount === 0) return "";
  const tolerance = 0.05;
  if (Math.abs(amount - 0.25) < tolerance) return "¼";
  if (Math.abs(amount - 0.5) < tolerance) return "½";
  if (Math.abs(amount - 0.75) < tolerance) return "¾";
  if (Math.abs(amount - 0.33) < tolerance) return "⅓";
  if (Math.abs(amount - 0.66) < tolerance) return "⅔";
  if (Math.abs(amount - 0.125) < tolerance) return "⅛";

  return amount % 1 === 0 ? amount.toString() : amount.toFixed(2);
};

const ShoppingListPage = () => {
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const [completeShopping, { isLoading: isCompleting }] =
    useAddPurchasedItemsMutation();

  const { startDate, endDate } = React.useMemo(() => {
    const paramStart = searchParams.get("startDate");
    const paramEnd = searchParams.get("endDate");

    if (paramStart && paramEnd) {
      return { startDate: paramStart, endDate: paramEnd };
    }

    const today = new Date();
    const nextTwoWeeks = new Date(today);
    nextTwoWeeks.setDate(today.getDate() + 14);

    return {
      startDate: today.toISOString().split("T")[0],
      endDate: nextTwoWeeks.toISOString().split("T")[0],
    };
  }, [searchParams]);

  const { list, isLoading, isFetching, isError, refetch } = useShoppingList(
    startDate,
    endDate,
  );
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = React.useCallback((id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handlePrint = React.useCallback(() => {
    window.print();
  }, []);

  const handleCompleteShopping = async () => {
    const purchasedItems: { name: string; amount: number; unit: string }[] = [];

    if (!list) return;

    Object.keys(list).forEach((category) => {
      if (category !== "totalItems") {
        const items = list[category as keyof typeof list];
        if (Array.isArray(items)) {
          (items as ShoppingListItem[]).forEach((item) => {
            if (checkedItems[item.id]) {
              purchasedItems.push({
                name: item.name,
                amount: item.amount,
                unit: item.unit,
              });
            }
          });
        }
      }
    });

    if (purchasedItems.length === 0) {
      addToast("Please check at least one item", "error");
      return;
    }

    try {
      await completeShopping(purchasedItems).unwrap();
      addToast(
        `Successfully added ${purchasedItems.length} items to Pantry!`,
        "success",
      );
      setCheckedItems({});
    } catch (err) {
      addToast("Failed to update inventory", "error");
    }
  };

  const categories = React.useMemo(() => {
    if (!list) return [];
    return Object.keys(list).filter(
      (key) =>
        key !== "totalItems" &&
        Array.isArray(list[key]) &&
        list[key].length > 0,
    );
  }, [list]);

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );

  if (isError)
    return <Alert variant="error">Unable to load your shopping list.</Alert>;

  const totalPossibleItems = list?.totalItems || 0;

  if (totalPossibleItems === 0) {
    return <EmptyShoppingList />;
  }

  const checkedCount = Object.values(checkedItems).filter((v) => v).length;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <ShoppingListHeader
        checkedCount={checkedCount}
        totalPossibleItems={totalPossibleItems}
        isFetching={isFetching}
        onRefresh={refetch}
        onPrint={handlePrint}
        onComplete={handleCompleteShopping}
        isCompleting={isCompleting}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <ShoppingListCategory
            key={category}
            category={category}
            items={list?.[category as keyof typeof list] as ShoppingListItem[]}
            checkedItems={checkedItems}
            onToggleItem={toggleItem}
            formatAmount={formatAmount}
          />
        ))}
      </div>
    </div>
  );
};

export default ShoppingListPage;
