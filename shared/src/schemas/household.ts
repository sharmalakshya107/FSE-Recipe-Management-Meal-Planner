import { z } from "zod";

export const createHouseholdSchema = z.object({
  name: z
    .string()
    .min(1, "Household name is required")
    .max(50, "Name too long"),
});

export const joinHouseholdSchema = z.object({
  inviteCode: z.string().length(10, "Invite code must be 10 characters"),
});

export type CreateHouseholdInput = z.infer<typeof createHouseholdSchema>;
export type JoinHouseholdInput = z.infer<typeof joinHouseholdSchema>;
