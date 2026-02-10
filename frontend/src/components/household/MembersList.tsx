import React from "react";
import { Users } from "lucide-react";
import { Card, CardHeader, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Member, User } from "@recipe-planner/shared";

interface MembersListProps {
  members?: Member[];
  ownerId?: string;
  currentUser?: User | null;
}

export const MembersList = ({
  members,
  ownerId,
  currentUser,
}: MembersListProps) => {
  return (
    <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
      <CardHeader className="px-6 py-4 bg-gray-50/50 flex flex-row items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-indigo-600" />
          <h3 className="text-lg font-bold text-gray-900">Members</h3>
        </div>
        <Badge
          variant="outline"
          className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 rounded-full font-bold text-xs"
        >
          {members?.length || 1} Total
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-gray-50">
          {members && members.length > 0 ? (
            members.map((member: Member) => (
              <li
                key={member.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                    {member.firstName[0]}
                    {member.lastName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.id === ownerId && (
                    <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded">
                      Owner
                    </span>
                  )}
                  {member.id === currentUser?.id && (
                    <Badge
                      variant="secondary"
                      className="bg-indigo-50 text-indigo-600 border-indigo-100 px-2 py-1 rounded font-bold text-[10px]"
                    >
                      YOU
                    </Badge>
                  )}
                </div>
              </li>
            ))
          ) : (
            <li className="px-6 py-4 flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                {currentUser?.firstName?.[0]}
                {currentUser?.lastName?.[0]}
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {currentUser?.firstName} {currentUser?.lastName}
                </p>
                <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest">
                  Owner
                </p>
              </div>
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
};
