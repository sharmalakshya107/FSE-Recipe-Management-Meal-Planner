import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useShoppingList } from "../../hooks/useShoppingList";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/feedback/Spinner";
import { Alert } from "../../components/feedback/Alert";
import {
  ShoppingBag,
  Printer,
  CheckCircle2,
  Circle,
  RefreshCcw,
  ChevronRight,
  PackageCheck,
} from "lucide-react";
import { useAddPurchasedItemsMutation } from "../../services/api/inventoryApi";
import { useToast } from "../../components/feedback/Toast";
import { ShoppingListItem } from "@recipe-planner/shared";

const ShoppingListPage = () => {
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const [completeShopping, { isLoading: isCompleting }] =
    useAddPurchasedItemsMutation();

  const getDates = () => {
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
  };

  const { startDate, endDate } = getDates();

  const { list, isLoading, isFetching, isError, refetch } = useShoppingList(
    startDate,
    endDate,
  );
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const formatAmount = (amount: number) => {
    if (amount === 0) return "";

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

  const handlePrint = () => {
    window.print();
  };

  const handleCompleteShopping = async () => {
    const purchasedItems: { name: string; amount: number; unit: string }[] = [];

    if (!list) return;

    Object.keys(list).forEach((category) => {
      if (category !== "totalItems") {
        const items = list[category as keyof typeof list];
        if (Array.isArray(items)) {
          (items as ShoppingListItem[]).forEach((item) => {
            if (checkedItems[item.name]) {
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

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );

  if (isError)
    return <Alert variant="error">Unable to load your shopping list.</Alert>;

  const categories = list
    ? Object.keys(list).filter(
        (key) =>
          key !== "totalItems" &&
          Array.isArray(list[key]) &&
          list[key].length > 0,
      )
    : [];

  const totalPossibleItems = list?.totalItems || 0;

  if (totalPossibleItems === 0) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            Shopping List
          </h1>
        </div>
        <div className="flex items-center justify-center min-h-[400px] bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="text-center max-w-md p-8">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} className="text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              No Items to Shop For
            </h3>
            <p className="text-gray-600 mb-6">
              Your shopping list is empty. Add meals to your meal planner to
              generate a shopping list automatically.
            </p>
            <Button
              onClick={() => (window.location.href = "/meal-planner")}
              className="btn-primary w-full py-4 rounded-xl font-bold"
            >
              Go to Meal Planner
              <ChevronRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const checkedCount = Object.values(checkedItems).filter((v) => v).length;
  const progress =
    totalPossibleItems > 0 ? (checkedCount / totalPossibleItems) * 100 : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      {/* Header with Progress */}
      <div className="relative overflow-hidden bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 italic">
              Your Groceries
            </h1>
            <p className="text-indigo-100 font-medium">
              Valid for the next 14 days
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handlePrint}
              className="px-6 rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white border-none"
            >
              <Printer size={18} className="mr-2" />
              Print
            </Button>
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 rounded-xl font-bold shadow-lg flex items-center gap-2 overflow-hidden"
            >
              <RefreshCcw
                size={18}
                className={isFetching ? "animate-spin" : ""}
              />
              <span>{isFetching ? "Syncing..." : "Sync"}</span>
            </Button>
          </div>
        </div>

        {/* Floating Background Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-100">
                Progress
              </span>
              <span className="text-3xl font-black">
                {checkedCount}
                <span className="text-indigo-300 text-lg">
                  /{totalPossibleItems}
                </span>
              </span>
            </div>
            <div className="h-3 bg-indigo-900/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              />
            </div>
          </div>

          <Button
            onClick={handleCompleteShopping}
            isLoading={isCompleting}
            disabled={checkedCount === 0}
            className={`
              h-14 px-8 rounded-2xl font-black shadow-xl transition-all
              ${
                checkedCount > 0
                  ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-900/20 scale-105"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              }
            `}
          >
            <PackageCheck size={20} className="mr-2" />
            Complete Shopping
          </Button>
        </div>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Card
            key={category}
            className="border-none shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-shadow"
          >
            <div className="px-6 py-5 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
                <h3 className="text-lg font-black text-gray-900 capitalize italic">
                  {category}
                </h3>
              </div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2.5 py-1 rounded-lg">
                {(list?.[category as keyof typeof list] as ShoppingListItem[])
                  ?.length || 0}
              </span>
            </div>
            <CardContent className="p-0">
              <ul className="divide-y divide-gray-50">
                {(
                  list?.[category as keyof typeof list] as ShoppingListItem[]
                )?.map((item: ShoppingListItem) => (
                  <li
                    key={item.name}
                    onClick={() => toggleItem(item.name)}
                    className={`px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 transition-all ${
                      checkedItems[item.name] ? "bg-gray-50/80" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      {checkedItems[item.name] ? (
                        <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-100 scale-110 transition-transform">
                          <CheckCircle2 size={16} />
                        </div>
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-200 rounded-full transition-colors group-hover:border-indigo-300" />
                      )}
                      <div>
                        <p
                          className={`text-sm font-bold text-gray-900 transition-all ${checkedItems[item.name] ? "line-through text-gray-400" : ""}`}
                        >
                          {item.name}
                        </p>
                        <p
                          className={`text-[10px] font-black uppercase tracking-widest mt-0.5 ${checkedItems[item.name] ? "text-gray-300" : "text-indigo-500"}`}
                        >
                          {formatAmount(item.amount)} {item.unit}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShoppingListPage;
