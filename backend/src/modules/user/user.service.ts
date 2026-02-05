import { authRepository } from "../auth/auth.repository.js";
import { NotFoundError } from "../../shared/errors/index.js";
import { UpdateUserProfileInput } from "@recipe-planner/shared";
import crypto from "crypto";

export const userService = {
  getProfile: async (userId: string) => {
    const user = await authRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const { passwordHash, refreshTokens, tokenVersion, ...profile } = user;

    try {
      const { householdService } =
        await import("../household/household.service.js");
      const { householdRepository } =
        await import("../household/household.repository.js");

      try {
        const hData = await householdService.getHousehold(userId);

        interface HouseholdMember {
          id: string;
          firstName: string;
          lastName: string;
          email: string;
          role: "user" | "admin";
        }

        // We found the household. Now try to populate details.
        // If this part fails, we should still return the household object
        // so the frontend knows the user is in one (preventing Join 400 loop).
        let mappedMembers: HouseholdMember[] = [];
        let inviteCode = hData.inviteCode;

        try {
          const members = await authRepository.findByIds(hData.memberIds);
          mappedMembers = members.map((m) => ({
            id: m.id,
            firstName: m.firstName,
            lastName: m.lastName,
            email: m.email,
            role: ((m.role as string) || "user").toLowerCase() as
              | "user"
              | "admin",
          }));

          if (!inviteCode) {
            // Regeneration logic: If a household is missing its invite code,
            // generate one now to ensure consistency.
            inviteCode = crypto.randomBytes(5).toString("hex").toUpperCase();
            const hash = crypto
              .createHash("sha256")
              .update(inviteCode)
              .digest("hex");
            hData.inviteCode = inviteCode;
            hData.inviteCodeHash = hash;
            await householdRepository.save(hData);
          }
        } catch (popError) {
          console.error("Failed to populate household details:", popError);
        }

        const household = {
          id: hData.id,
          name: hData.name,
          inviteCode: inviteCode || "UNAVAILABLE",
          ownerId: hData.adminId,
          members: mappedMembers,
        };

        return { ...profile, household };
      } catch (dbError) {
        const err = dbError as { statusCode?: number; code?: string };
        if (
          dbError instanceof NotFoundError ||
          err.statusCode === 404 ||
          err.code === "NOT_FOUND"
        ) {
          return profile;
        }
        throw dbError;
      }
    } catch (e) {
      console.error("Error in getProfile household resolution:", e);
      // If we can't load services or unexpected error, throw to alert client
      throw e;
    }
  },

  updateProfile: async (
    userId: string,
    input: Partial<UpdateUserProfileInput>,
  ) => {
    const user = await authRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    if (input.firstName) user.firstName = input.firstName;
    if (input.lastName) user.lastName = input.lastName;

    await authRepository.save(user);
    return userService.getProfile(userId);
  },
};
