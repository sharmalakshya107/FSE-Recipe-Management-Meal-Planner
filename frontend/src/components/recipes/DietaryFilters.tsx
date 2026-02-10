import React from "react";

interface DietaryFiltersProps {
  activeTags: string[];
  onChange: (tags: string[]) => void;
}

const DIETARY_TAGS = [
  "vegan",
  "vegetarian",
  "gluten-free",
  "dairy-free",
  "keto",
  "paleo",
];

export const DietaryFilters = ({
  activeTags,
  onChange,
}: DietaryFiltersProps) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar">
      <button
        onClick={() => onChange([])}
        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
          !activeTags.length
            ? "bg-black text-white border-black shadow-lg shadow-gray-200"
            : "bg-white text-gray-400 border-gray-100 hover:border-gray-200"
        }`}
      >
        All Recipes
      </button>
      {DIETARY_TAGS.map((tag) => {
        const isActive = activeTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => {
              const newTags = isActive
                ? activeTags.filter((t) => t !== tag)
                : [...activeTags, tag];
              onChange(newTags);
            }}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
              isActive
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                : "bg-white text-gray-400 border-gray-100 hover:border-indigo-100 hover:text-indigo-600"
            }`}
          >
            {tag.replace("-", " ")}
          </button>
        );
      })}
    </div>
  );
};
