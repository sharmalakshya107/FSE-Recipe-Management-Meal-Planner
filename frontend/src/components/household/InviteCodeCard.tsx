import React from "react";
import { Copy, Check } from "lucide-react";
import { Card } from "../ui/Card";

interface InviteCodeCardProps {
  inviteCode?: string;
  onCopy: () => void;
  copied: boolean;
}

export const InviteCodeCard = ({
  inviteCode,
  onCopy,
  copied,
}: InviteCodeCardProps) => {
  return (
    <Card className="bg-indigo-600 text-white rounded-2xl p-8 shadow-md">
      <h3 className="text-xl font-bold mb-2">Invite Members</h3>
      <p className="text-indigo-100 text-sm mb-6">
        Share this code with others to join your household.
      </p>

      <div
        className="bg-white/10 rounded-xl p-4 border border-white/20 flex items-center justify-between cursor-pointer hover:bg-white/20 transition-all"
        onClick={onCopy}
      >
        <div>
          <p className="text-[10px] text-indigo-200 uppercase font-bold mb-1">
            Invite Code
          </p>
          <div className="min-h-[32px] flex items-center">
            {inviteCode ? (
              <span className="font-mono text-2xl font-bold tracking-widest uppercase">
                {inviteCode}
              </span>
            ) : (
              <span className="text-sm font-medium text-indigo-200">
                No household
              </span>
            )}
          </div>
        </div>
        <div className="p-2 bg-white/10 rounded-lg">
          {copied ? (
            <Check size={20} className="text-emerald-300" />
          ) : (
            <Copy size={20} />
          )}
        </div>
      </div>
    </Card>
  );
};
