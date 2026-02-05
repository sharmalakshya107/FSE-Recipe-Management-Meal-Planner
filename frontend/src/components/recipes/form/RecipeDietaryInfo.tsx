import React from "react";
import { DietaryTag } from "@recipe-planner/shared";

interface RecipeDietaryInfoProps {
  selectedTags: DietaryTag[];
  onChange: (tags: DietaryTag[]) => void;
}

const ALL_TAGS: DietaryTag[] = [
  "vegan",
  "vegetarian",
  "gluten-free",
  "dairy-free",
  "keto",
  "paleo",
];

export const RecipeDietaryInfo = ({
  selectedTags,
  onChange,
}: RecipeDietaryInfoProps) => {
  const toggleTag = (tag: DietaryTag) => {
    onChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag],
    );
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-bold text-gray-900 border-b border-gray-100 block pb-2 uppercase tracking-wider">
        Dietary Tags
      </label>
      <div className="flex flex-wrap gap-2">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              selectedTags.includes(tag)
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                : "bg-gray-50 text-gray-500 border-gray-100 hover:border-indigo-200 hover:text-indigo-600"
            }`}
          >
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};
