import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";

const router = Router();

router.use(authenticate);

router.get("/", inventoryController.getInventory);
router.get("/alerts", inventoryController.getExpiryAlerts);
router.post("/", inventoryController.addItem);
router.post("/purchased", inventoryController.addPurchasedItems);
router.put("/:id", inventoryController.updateItem);
router.delete("/:id", inventoryController.removeItem);

export default router;
