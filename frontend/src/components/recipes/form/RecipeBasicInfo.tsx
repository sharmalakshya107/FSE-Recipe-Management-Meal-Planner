import React from "react";
import { Upload, X } from "lucide-react";
import { Input } from "../../ui/Input";

interface RecipeBasicInfoProps {
  title: string;
  description: string;
  imageUrl?: string;
  onChange: (fields: {
    title?: string;
    description?: string;
    imageUrl?: string;
  }) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export const RecipeBasicInfo = ({
  title,
  description,
  imageUrl,
  onChange,
  onImageUpload,
  isUploading,
}: RecipeBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <Input
        label="Recipe Title"
        placeholder="e.g. Classic Margherita Pizza"
        value={title}
        onChange={(e) => onChange({ title: e.target.value })}
        required
      />
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 min-h-[100px]"
          placeholder="Tell us about your recipe..."
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
          required
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700">
          Recipe Image
        </label>
        <div className="flex flex-col gap-4">
          {imageUrl ? (
            <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-gray-100 group">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => onChange({ imageUrl: "" })}
                className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-gray-200 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
              >
                <div className="bg-indigo-50 p-3 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                  <Upload size={24} className="text-indigo-600" />
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {isUploading ? "Uploading..." : "Click to upload photo"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG or WebP (max 5MB)
                </p>
              </label>
            </div>
          )}
          <Input
            label="Or paste Image URL"
            placeholder="https://example.com/image.jpg"
            value={imageUrl || ""}
            onChange={(e) => onChange({ imageUrl: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
