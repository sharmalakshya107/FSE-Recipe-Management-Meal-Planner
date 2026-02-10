import React from "react";
import { ChefHat } from "lucide-react";

interface Instruction {
  text: string;
}

interface SharedInstructionsListProps {
  instructions: Instruction[];
}

export const SharedInstructionsList = ({
  instructions,
}: SharedInstructionsListProps) => {
  return (
    <section>
      <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
          <ChefHat size={20} />
        </div>
        Instructions
      </h2>
      <div className="space-y-6">
        {instructions.map((inst, idx) => (
          <div key={idx} className="flex gap-6 group">
            <div className="shrink-0 w-10 h-10 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center font-black transition-colors group-hover:bg-purple-600 group-hover:text-white">
              {idx + 1}
            </div>
            <div className="pt-2">
              <p className="text-gray-700 leading-relaxed font-medium">
                {inst.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
