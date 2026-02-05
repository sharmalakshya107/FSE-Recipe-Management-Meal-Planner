import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import { Instruction } from "@recipe-planner/shared";

interface InstructionFormProps {
  instructions: Instruction[];
  onChange: (instructions: Instruction[]) => void;
}

export const InstructionForm = ({
  instructions,
  onChange,
}: InstructionFormProps) => {
  const [newInstruction, setNewInstruction] = useState("");

  const handleAdd = () => {
    if (!newInstruction) return;
    onChange([
      ...(instructions || []),
      {
        step: (instructions?.length || 0) + 1,
        text: newInstruction,
      },
    ]);
    setNewInstruction("");
  };

  const handleRemove = (idx: number) => {
    onChange(
      instructions
        .filter((_, i) => i !== idx)
        .map((step, i) => ({ ...step, step: i + 1 })),
    );
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-bold text-gray-900 border-b border-gray-100 block pb-2 uppercase tracking-wider">
        Instructions
      </label>
      <div className="flex gap-2">
        <textarea
          className="flex-1 p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 min-h-[60px]"
          placeholder="Step by step..."
          value={newInstruction}
          onChange={(e) => setNewInstruction(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors self-end"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="space-y-3">
        {instructions?.map((inst, idx) => (
          <div
            key={idx}
            className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 relative group"
          >
            <span className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-xs font-bold border border-gray-100 shadow-sm shrink-0">
              {idx + 1}
            </span>
            <p className="text-sm text-gray-700">{inst.text}</p>
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-2 right-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
