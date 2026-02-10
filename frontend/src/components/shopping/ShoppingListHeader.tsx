import React from "react";
import { Printer, RefreshCcw, PackageCheck } from "lucide-react";
import { Button } from "../ui/Button";
import { motion } from "framer-motion";

interface ShoppingListHeaderProps {
  checkedCount: number;
  totalPossibleItems: number;
  isFetching: boolean;
  onRefresh: () => void;
  onPrint: () => void;
  onComplete: () => void;
  isCompleting: boolean;
}

export const ShoppingListHeader = ({
  checkedCount,
  totalPossibleItems,
  isFetching,
  onRefresh,
  onPrint,
  onComplete,
  isCompleting,
}: ShoppingListHeaderProps) => {
  const progress =
    totalPossibleItems > 0 ? (checkedCount / totalPossibleItems) * 100 : 0;

  return (
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
            onClick={onPrint}
            className="px-6 rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white border-none"
          >
            <Printer size={18} className="mr-2" />
            Print
          </Button>
          <Button
            onClick={onRefresh}
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
          onClick={onComplete}
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
  );
};
