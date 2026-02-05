import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { householdRepository, Household } from "./household.repository.js";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../../shared/errors/index.js";

export const householdService = {
  createHousehold: async (
    name: string,
    adminId: string,
  ): Promise<Household> => {
    const existing = await householdRepository.findByMemberId(adminId);
    if (existing)
      throw new BadRequestError(
        "You are already in a household. Leave it first.",
      );

    const plaintextCode = crypto.randomBytes(5).toString("hex").toUpperCase();
    const hash = crypto
      .createHash("sha256")
      .update(plaintextCode)
      .digest("hex");

    const household: Household = {
      id: uuidv4(),
      name,
      adminId,
      memberIds: [adminId],
      inviteCode: plaintextCode,
      inviteCodeHash: hash,
      createdAt: new Date().toISOString(),
    };

    await householdRepository.save(household);
    return household;
  },

  joinHousehold: async (
    inviteCode: string,
    userId: string,
  ): Promise<Household> => {
    const existing = await householdRepository.findByMemberId(userId);
    if (existing) throw new BadRequestError("You are already in a household.");

    const normalizedCode = inviteCode.trim();
    const hash = crypto
      .createHash("sha256")
      .update(normalizedCode)
      .digest("hex");

    let household = await householdRepository.findByInviteCodeHash(hash);

    // Self-Healing: If hash search failed, try plaintext search (in case hash is corrupted/outdated)
    if (!household) {
      household = await householdRepository.findByInviteCode(normalizedCode);
      if (household) {
        console.warn(
          `Self-Healing: Updating corrupted hash for household ${household.id}`,
        );
        household.inviteCodeHash = hash;
        // logic continues below to save
      }
    }

    if (!household) throw new NotFoundError("Invalid invite code");

    household.memberIds.push(userId);
    return householdRepository.save(household);
  },

  getHousehold: async (userId: string): Promise<Household> => {
    const household = await householdRepository.findByMemberId(userId);
    if (!household) throw new NotFoundError("You are not in a household");
    return household;
  },

  leaveHousehold: async (userId: string): Promise<void> => {
    const household = await householdRepository.findByMemberId(userId);
    if (!household) throw new NotFoundError("You are not in a household");

    if (household.adminId === userId) {
      if (household.memberIds.length > 1) {
        throw new BadRequestError("Transfer admin rights before leaving");
      }
      await householdRepository.delete(household.id);
      return;
    }

    household.memberIds = household.memberIds.filter((id) => id !== userId);
    await householdRepository.save(household);
  },
};
