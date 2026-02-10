import React from "react";
import { LogOut } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Spinner } from "../feedback/Spinner";

interface LeaveHouseholdCardProps {
  onLeave: () => void;
  isLoading: boolean;
}

export const LeaveHouseholdCard = ({
  onLeave,
  isLoading,
}: LeaveHouseholdCardProps) => {
  return (
    <Card className="border-rose-100 shadow-sm rounded-2xl overflow-hidden bg-rose-50/30">
      <CardHeader className="px-6 py-4 border-b border-rose-100">
        <h3 className="text-lg font-bold text-rose-900">Leave Household</h3>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">
              If you leave, you will lose access to shared data.
            </p>
          </div>
          <Button
            variant="danger"
            className="rounded-xl h-10 px-4 flex items-center gap-2"
            onClick={onLeave}
            disabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" /> : <LogOut size={16} />}
            <span>{isLoading ? "Leaving..." : "Leave"}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
