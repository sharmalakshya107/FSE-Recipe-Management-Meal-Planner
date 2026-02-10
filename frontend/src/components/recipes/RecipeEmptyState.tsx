import React from "react";

interface RecipeEmptyStateProps {
  onClearSearch: () => void;
}

export const RecipeEmptyState: React.FC<RecipeEmptyStateProps> = ({
  onClearSearch,
}) => {
  return (
    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-1">No recipes found</h3>
      <p className="text-gray-500 font-medium">
        Try adjusting your search filters.
      </p>
      <button
        onClick={onClearSearch}
        className="mt-4 font-bold text-xs uppercase text-indigo-600 hover:underline"
      >
        Clear Search
      </button>
    </div>
  );
};
