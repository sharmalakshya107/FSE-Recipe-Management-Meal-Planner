import { Request, Response } from "express";
import { inventoryService } from "./inventory.service.js";
import { AuthRequest } from "../../shared/middleware/authenticate.js";
import { catchAsync } from "../../shared/utils/catchAsync.js";

export const inventoryController = {
  getInventory: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const inventory = await inventoryService.getInventory(user.userId);
    res.json(inventory);
  }),

  addItem: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const item = await inventoryService.addItem(req.body, user.userId);
    res.status(201).json(item);
  }),

  updateItem: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const item = await inventoryService.updateItem(
      req.params["id"]!,
      req.body,
      user.userId,
    );
    res.json(item);
  }),

  removeItem: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    await inventoryService.removeItem(req.params["id"]!, user.userId);
    res.status(204).end();
  }),

  getExpiryAlerts: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    const alerts = await inventoryService.getExpiryAlerts(user.userId);
    res.json(alerts);
  }),

  addPurchasedItems: catchAsync(async (req: Request, res: Response) => {
    const { user } = req as AuthRequest;
    await inventoryService.addPurchasedItems(req.body, user.userId);
    res.status(200).json({ message: "Items added to inventory" });
  }),
};
