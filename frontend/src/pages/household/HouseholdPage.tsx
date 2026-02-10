import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../components/feedback/Toast";
import {
  createHouseholdSchema,
  joinHouseholdSchema,
} from "@recipe-planner/shared";
import {
  useCreateHouseholdMutation,
  useJoinHouseholdMutation,
  useLeaveHouseholdMutation,
} from "../../services/api/householdApi";
import { Spinner } from "../../components/feedback/Spinner";
import { useAppForm } from "../../hooks/useAppForm";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { MembersList } from "../../components/household/MembersList";
import { CreateHouseholdForm } from "../../components/household/CreateHouseholdForm";
import { JoinHouseholdForm } from "../../components/household/JoinHouseholdForm";
import { InviteCodeCard } from "../../components/household/InviteCodeCard";
import { LeaveHouseholdCard } from "../../components/household/LeaveHouseholdCard";

const HouseholdPage = () => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const household = user?.household;
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const [createHousehold, { isLoading: isCreating }] =
    useCreateHouseholdMutation();
  const [joinHousehold, { isLoading: isJoining }] = useJoinHouseholdMutation();
  const [leaveHousehold, { isLoading: isLeaving }] =
    useLeaveHouseholdMutation();

  const {
    isDeleting: isConfirmingLeave,
    requestDelete: requestLeave,
    cancelDelete: cancelLeave,
  } = useDeleteConfirmation();

  const createForm = useAppForm({
    schema: createHouseholdSchema,
    defaultValues: {
      name: "",
    },
  });

  const joinForm = useAppForm({
    schema: joinHouseholdSchema,
    defaultValues: {
      inviteCode: "",
    },
  });

  const handleCreateHousehold = async (data: { name: string }) => {
    try {
      await createHousehold(data).unwrap();
      addToast("Household created successfully!", "success");
      createForm.reset();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      addToast(error.data?.message || "Failed to create household", "error");
    }
  };

  const handleJoinHousehold = async (data: { inviteCode: string }) => {
    try {
      await joinHousehold(data).unwrap();
      addToast("Joined household successfully!", "success");
      joinForm.reset();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      addToast(error.data?.message || "Failed to join household", "error");
    }
  };

  const confirmLeaveHousehold = async () => {
    try {
      await leaveHousehold().unwrap();
      addToast("Left household successfully", "success");
      cancelLeave();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
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

  if (isAuthLoading) {
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

      <ConfirmModal
        isOpen={isConfirmingLeave}
        onClose={cancelLeave}
        onConfirm={confirmLeaveHousehold}
        title="Leave Household"
        message="Are you sure you want to leave this household? You will lose access to shared recipes and inventory."
        confirmLabel="Leave"
        variant="danger"
        isLoading={isLeaving}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <MembersList
            members={household?.members}
            ownerId={household?.ownerId}
            currentUser={user}
          />

          {household ? (
            <LeaveHouseholdCard
              onLeave={() => requestLeave("household")}
              isLoading={isLeaving}
            />
          ) : (
            <CreateHouseholdForm
              form={createForm}
              onSubmit={handleCreateHousehold}
              isLoading={isCreating}
            />
          )}
        </div>

        <div className="space-y-6">
          {household && (
            <InviteCodeCard
              inviteCode={household.inviteCode}
              onCopy={handleCopyCode}
              copied={copied}
            />
          )}

          {!household && (
            <JoinHouseholdForm
              form={joinForm}
              onSubmit={handleJoinHousehold}
              isLoading={isJoining}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseholdPage;
