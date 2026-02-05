import { InventoryItem } from "@recipe-planner/shared";
import { InventoryModel } from "./inventory.model.js";

export const inventoryRepository = {
  findByUserId: async (userId: string): Promise<InventoryItem[]> => {
    const items = await InventoryModel.find({
      $or: [{ userId }, { householdId: userId }],
    }).lean();
    return items.map(mapDocToInventory);
  },

  findById: async (id: string): Promise<InventoryItem | undefined> => {
    const item = await InventoryModel.findOne({ _id: id }).lean();
    if (!item) return undefined;
    return mapDocToInventory(item);
  },

  create: async (item: InventoryItem): Promise<InventoryItem> => {
    const docToSave = {
      ...item,
      _id: item.id,
    };
    await InventoryModel.create(docToSave);
    return item;
  },

  update: async (
    id: string,
    updates: Partial<InventoryItem>,
  ): Promise<InventoryItem | undefined> => {
    const updated = await InventoryModel.findOneAndUpdate(
      { _id: id },
      { $set: updates },
      { new: true },
    ).lean();

    if (!updated) return undefined;
    return mapDocToInventory(updated);
  },

  save: async (item: InventoryItem): Promise<InventoryItem> => {
    const exists = await InventoryModel.exists({ _id: item.id });
    const docToSave = { ...item, _id: item.id };

    if (exists) {
      await InventoryModel.updateOne({ _id: item.id }, docToSave);
    } else {
      await InventoryModel.create(docToSave);
    }
    return item;
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await InventoryModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  },
};

const mapDocToInventory = (doc: unknown): InventoryItem => {
  const d = doc as Record<string, unknown>;
  return {
    ...(d as unknown as InventoryItem),
    id: (d._id as string).toString(),
  };
};
