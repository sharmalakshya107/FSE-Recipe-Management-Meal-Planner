import React from "react";
import { Instruction } from "@recipe-planner/shared";
import { Info } from "lucide-react";

interface InstructionListProps {
  instructions: Instruction[];
}

export const InstructionList = ({ instructions }: InstructionListProps) => (
  <div className="space-y-3">
    <h3 className="text-lg font-bold text-gray-900 pb-2 border-b-2 border-indigo-600 flex items-center gap-2">
      <Info size={18} className="text-indigo-600" />
      Instructions
    </h3>
    <div className="space-y-3">
      {instructions.map((inst, idx) => (
        <div key={inst.step || idx} className="flex gap-3">
          <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">
            {inst.step}
          </span>
          <p className="text-sm text-gray-800 leading-relaxed pt-0.5 max-w-md">
            {inst.text}
          </p>
        </div>
      ))}
    </div>
  </div>
);
