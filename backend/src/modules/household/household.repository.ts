import { HouseholdModel } from "./household.model.js";
import { ClientSession } from "mongoose";

export interface Household {
  id: string;
  name: string;
  adminId: string;
  memberIds: string[];
  inviteCode: string;
  inviteCodeHash: string;
  createdAt?: string;
  updatedAt?: string;
}

export const householdRepository = {
  findByMemberId: async (userId: string): Promise<Household | undefined> => {
    const household = await HouseholdModel.findOne({
      memberIds: userId,
    }).lean();
    if (!household) return undefined;
    return mapDocToHousehold(household);
  },

  findByInviteCodeHash: async (
    hash: string,
  ): Promise<Household | undefined> => {
    const household = await HouseholdModel.findOne({
      inviteCodeHash: hash,
    }).lean();
    if (!household) return undefined;
    return mapDocToHousehold(household);
  },

  findByInviteCode: async (code: string): Promise<Household | undefined> => {
    const household = await HouseholdModel.findOne({
      inviteCode: code,
    }).lean();
    if (!household) return undefined;
    return mapDocToHousehold(household);
  },

  findById: async (id: string): Promise<Household | undefined> => {
    const household = await HouseholdModel.findOne({ _id: id }).lean();
    if (!household) return undefined;
    return mapDocToHousehold(household);
  },

  save: async (
    household: Household,
    session?: ClientSession,
  ): Promise<Household> => {
    const exists = await HouseholdModel.exists({ _id: household.id }).session(
      session || null,
    );
    const docToSave = { ...household, _id: household.id };

    if (exists) {
      await HouseholdModel.updateOne({ _id: household.id }, docToSave, {
        session,
      });
    } else {
      await HouseholdModel.create([docToSave], { session });
    }
    return household;
  },

  delete: async (id: string): Promise<boolean> => {
    const res = await HouseholdModel.deleteOne({ _id: id });
    return res.deletedCount === 1;
  },
};

const mapDocToHousehold = (doc: unknown): Household => {
  const d = doc as Record<string, unknown>;
  return {
    ...(d as unknown as Household),
    id: (d._id as string).toString(),
  };
};
