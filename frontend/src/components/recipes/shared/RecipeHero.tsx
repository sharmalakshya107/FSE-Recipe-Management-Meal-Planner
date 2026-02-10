import React from "react";
import { ChefHat } from "lucide-react";

interface RecipeHeroProps {
  title: string;
  description?: string;
  imageUrl?: string;
  dietaryTags: string[];
}

export const RecipeHero = ({
  title,
  description,
  imageUrl,
  dietaryTags,
}: RecipeHeroProps) => {
  return (
    <div className="relative h-[45vh] lg:h-[60vh] overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
          <ChefHat size={120} className="text-white/20" />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            {dietaryTags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-black uppercase tracking-widest border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight">
            {title}
          </h1>
          <p className="text-lg text-white/80 max-w-2xl font-medium leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
