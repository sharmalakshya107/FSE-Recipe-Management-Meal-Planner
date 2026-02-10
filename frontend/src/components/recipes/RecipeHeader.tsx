import React from "react";
import { Plus, Link2 } from "lucide-react";
import { Button } from "../ui/Button";

interface RecipeHeaderProps {
  onImportClick: () => void;
  onAddClick: () => void;
}

export const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  onImportClick,
  onAddClick,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Recipe Explorer
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Browse our collection and find your next favorite meal.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          onClick={onImportClick}
          variant="outline"
          className="rounded-xl h-11 px-5"
        >
          <Link2 size={18} className="mr-2" />
          Import from URL
        </Button>
        <Button
          onClick={onAddClick}
          className="btn-primary h-11 px-6 rounded-xl"
        >
          <Plus size={18} className="mr-2" />
          Add New Recipe
        </Button>
      </div>
    </div>
  );
};
