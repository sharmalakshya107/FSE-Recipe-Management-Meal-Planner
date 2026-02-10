import React from "react";
import { Utensils } from "lucide-react";

interface RecipeHeaderProps {
  imageUrl?: string;
  title: string;
  description?: string;
}

export const RecipeHeader = ({
  imageUrl,
  title,
  description,
}: RecipeHeaderProps) => (
  <div className="space-y-6">
    <div className="relative h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Utensils size={40} className="mx-auto text-gray-300 mb-2" />
            <span className="text-sm font-medium text-gray-400">No Image</span>
          </div>
        </div>
      )}
    </div>

    {description && (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700 leading-relaxed">{description}</p>
      </div>
    )}
  </div>
);
