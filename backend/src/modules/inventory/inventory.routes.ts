import { Router } from "express";
import { inventoryController } from "./inventory.controller.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { validate } from "../../shared/middleware/validate.js";
import {
  createInventoryItemSchema,
  updateInventoryItemSchema,
  addPurchasedItemsSchema,
  uuidSchema,
  z,
} from "@recipe-planner/shared";

const router = Router();

router.use(authenticate);

router.get("/", inventoryController.getInventory);
router.get("/alerts", inventoryController.getExpiryAlerts);
router.post(
  "/",
  validate({ body: createInventoryItemSchema }),
  inventoryController.addItem,
);
router.post(
  "/purchased",
  validate({ body: addPurchasedItemsSchema }),
  inventoryController.addPurchasedItems,
);
router.put(
  "/:id",
  validate({
    params: z.object({ id: uuidSchema }),
    body: updateInventoryItemSchema,
  }),
  inventoryController.updateItem,
);
router.delete(
  "/:id",
  validate({ params: z.object({ id: uuidSchema }) }),
  inventoryController.removeItem,
);

export default router;
