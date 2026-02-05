import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { useAuth } from "../../hooks/useAuth";
import { Users, LogOut, Copy, Check, Plus } from "lucide-react";
import { useToast } from "../../components/feedback/Toast";
import { Member } from "@recipe-planner/shared";
import {
  useCreateHouseholdMutation,
  useJoinHouseholdMutation,
  useLeaveHouseholdMutation,
} from "../../services/api/householdApi";
import { Spinner } from "../../components/feedback/Spinner";

const HouseholdPage = () => {
  const { user, isLoading } = useAuth();
  const household = user?.household;
  const { addToast } = useToast();
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [createHousehold, { isLoading: isCreating }] =
    useCreateHouseholdMutation();
  const [joinHousehold, { isLoading: isJoining }] = useJoinHouseholdMutation();
  const [leaveHousehold, { isLoading: isLeaving }] =
    useLeaveHouseholdMutation();
  const [newHouseholdName, setNewHouseholdName] = useState("");

  const handleCreateHousehold = async () => {
    if (!newHouseholdName.trim()) {
      addToast("Please enter a household name", "error");
      return;
    }

    try {
      await createHousehold({ name: newHouseholdName }).unwrap();
      addToast("Household created successfully!", "success");
      setNewHouseholdName("");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      console.error(err);
      addToast(error.data?.message || "Failed to create household", "error");
    }
  };

  const handleJoinHousehold = async () => {
    if (!inviteCode.trim()) {
      addToast("Please enter an invite code", "error");
      return;
    }

    try {
      await joinHousehold({ inviteCode: inviteCode.trim() }).unwrap();
      addToast("Joined household successfully!", "success");
      setInviteCode("");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      console.error(err);
      addToast(error.data?.message || "Failed to join household", "error");
    }
  };

  const handleLeaveHousehold = async () => {
    if (!window.confirm("Are you sure you want to leave this household?")) {
      return;
    }

    try {
      await leaveHousehold().unwrap();
      addToast("Left household successfully", "success");
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      console.error(err);
      addToast(error.data?.message || "Failed to leave household", "error");
    }
  };

  const handleCopyCode = () => {
    if (household?.inviteCode) {
      navigator.clipboard.writeText(household.inviteCode);
      setCopied(true);
      addToast("Invite code copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Household Management
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage your household settings and members.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-100 shadow-sm rounded-2xl overflow-hidden bg-white">
            <CardHeader className="px-6 py-4 bg-gray-50/50 flex flex-row items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Members</h3>
              </div>
              <Badge
                variant="success"
                className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1 rounded-full font-bold text-xs"
              >
                {household?.members?.length || 1} Total
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-gray-50">
                {household &&
                household.members &&
                household.members.length > 0 ? (
                  household.members.map((member: Member) => (
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
                          <p className="text-xs text-gray-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {member.id === household?.ownerId && (
                          <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded">
                            Owner
                          </span>
                        )}
                        {member.id === user?.id && (
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
                      {user?.firstName?.[0]}
                      {user?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">
                        {user?.firstName} {user?.lastName}
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

          {household ? (
            <Card className="border-rose-100 shadow-sm rounded-2xl overflow-hidden bg-rose-50/30">
              <CardHeader className="px-6 py-4 border-b border-rose-100">
                <h3 className="text-lg font-bold text-rose-900">
                  Leave Household
                </h3>
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
                    onClick={handleLeaveHousehold}
                    disabled={isLeaving}
                  >
                    {isLeaving ? <Spinner size="sm" /> : <LogOut size={16} />}
                    <span>{isLeaving ? "Leaving..." : "Leave"}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-indigo-100 shadow-sm rounded-2xl overflow-hidden bg-indigo-50/30">
              <CardHeader className="px-6 py-4 border-b border-indigo-100">
                <h3 className="text-lg font-bold text-indigo-900">
                  Create Household
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-4">
                      Create a new household to collaborate with others.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Household Name (e.g. Smith Family)"
                        value={newHouseholdName}
                        onChange={(e) => setNewHouseholdName(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleCreateHousehold()
                        }
                      />
                      <Button
                        onClick={handleCreateHousehold}
                        disabled={isCreating || !newHouseholdName.trim()}
                        className="rounded-xl h-10 px-6 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                      >
                        {isCreating ? (
                          <Spinner size="sm" className="text-white" />
                        ) : (
                          <Plus size={16} />
                        )}
                        <span>Create</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {household && (
            <Card className="bg-indigo-600 text-white rounded-2xl p-8 shadow-md">
              <h3 className="text-xl font-bold mb-2">Invite Members</h3>
              <p className="text-indigo-100 text-sm mb-6">
                Share this code with others to join your household.
              </p>

              <div
                className="bg-white/10 rounded-xl p-4 border border-white/20 flex items-center justify-between cursor-pointer hover:bg-white/20 transition-all"
                onClick={handleCopyCode}
              >
                <div>
                  <p className="text-[10px] text-indigo-200 uppercase font-bold mb-1">
                    Invite Code
                  </p>
                  <div className="min-h-[32px] flex items-center">
                    {isLoading ? (
                      <span className="text-sm font-medium text-indigo-200 animate-pulse">
                        Wait...
                      </span>
                    ) : household.inviteCode ? (
                      <span className="font-mono text-2xl font-bold tracking-widest uppercase">
                        {household.inviteCode}
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
          )}

          {!household && (
            <Card className="bg-white border-gray-100 shadow-sm rounded-2xl p-8">
              <h3 className="text-lg font-bold mb-4">Join Household</h3>
              <p className="text-sm text-gray-500 mb-6">
                Enter an invite code to join another household.
              </p>
              <div className="space-y-3">
                <input
                  placeholder="INVITE-CODE"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-center font-mono text-lg font-bold outline-none focus:border-indigo-500"
                />
                <Button
                  className="btn-primary w-full h-12 rounded-xl font-bold flex items-center justify-center gap-2"
                  onClick={handleJoinHousehold}
                  disabled={isJoining}
                >
                  {isJoining ? (
                    <Spinner size="sm" className="text-white" />
                  ) : null}
                  {isJoining ? "Joining..." : "Join Now"}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseholdPage;
