import { v4 as uuidv4 } from "uuid";
import {
  InventoryItem,
  CreateInventoryInput,
  UpdateInventoryInput,
} from "@recipe-planner/shared";
import { inventoryRepository } from "./inventory.repository.js";

export const inventoryService = {
  getInventory: async (userId: string) => {
    let targetId = userId;
    try {
      const { householdService } =
        await import("../household/household.service.js");
      const household = await householdService.getHousehold(userId);
      if (household) targetId = household.id;
    } catch (e) {}
    return inventoryRepository.findByUserId(targetId);
  },

  addItem: async (
    input: CreateInventoryInput,
    userId: string,
  ): Promise<InventoryItem> => {
    let targetId = userId;
    let hId: string | undefined;
    try {
      const { householdService } =
        await import("../household/household.service.js");
      const household = await householdService.getHousehold(userId);
      if (household) {
        targetId = household.id;
        hId = household.id;
      }
    } catch (e) {}

    const item: InventoryItem = {
      ...input,
      id: uuidv4(),
      userId: targetId,
      householdId: hId,
      updatedAt: new Date().toISOString(),
    };
    return inventoryRepository.save(item);
  },

  updateItem: async (
    id: string,
    input: UpdateInventoryInput,
    userId: string,
  ): Promise<InventoryItem> => {
    const existing = await inventoryRepository.findById(id);
    if (!existing) throw new Error("Item not found");

    let isAuthorized = existing.userId === userId;
    if (!isAuthorized && existing.householdId) {
      const { householdService } =
        await import("../household/household.service.js");
      const household = await householdService.getHousehold(userId);
      if (household && household.id === existing.householdId)
        isAuthorized = true;
    }

    if (!isAuthorized) throw new Error("Unauthorized to update this item");

    const updated: InventoryItem = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    return inventoryRepository.save(updated);
  },

  removeItem: async (id: string, userId: string) => {
    const existing = await inventoryRepository.findById(id);
    if (!existing) throw new Error("Item not found");

    let isAuthorized = existing.userId === userId;
    if (!isAuthorized && existing.householdId) {
      const { householdService } =
        await import("../household/household.service.js");
      const household = await householdService.getHousehold(userId);
      if (household && household.id === existing.householdId)
        isAuthorized = true;
    }

    if (!isAuthorized) throw new Error("Unauthorized to remove this item");
    return inventoryRepository.delete(id);
  },

  getExpiryAlerts: async (userId: string, withinDays: number = 7) => {
    const inventory = await inventoryService.getInventory(userId);
    const now = new Date();
    const threshold = new Date();
    threshold.setDate(now.getDate() + withinDays);

    return inventory.filter((item) => {
      if (!item.expiryDate) return false;
      const expiry = new Date(item.expiryDate);
      return expiry <= threshold;
    });
  },

  addPurchasedItems: async (
    items: { name: string; amount: number; unit: string }[],
    userId: string,
  ) => {
    let targetId = userId;
    let hId: string | undefined;
    try {
      const { householdService } =
        await import("../household/household.service.js");
      const household = await householdService.getHousehold(userId);
      if (household) {
        targetId = household.id;
        hId = household.id;
      }
    } catch (e) {}

    const existingInventory = await inventoryRepository.findByUserId(targetId);

    for (const item of items) {
      const existing = existingInventory.find(
        (i) =>
          i.name.toLowerCase() === item.name.toLowerCase() &&
          i.unit === item.unit,
      );

      if (existing) {
        await inventoryRepository.save({
          ...existing,
          amount: existing.amount + item.amount,
          updatedAt: new Date().toISOString(),
        });
      } else {
        await inventoryRepository.save({
          id: uuidv4(),
          userId: targetId,
          householdId: hId,
          name: item.name,
          amount: item.amount,
          unit: item.unit as import("@recipe-planner/shared").Unit,
          category: undefined,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  },
};
