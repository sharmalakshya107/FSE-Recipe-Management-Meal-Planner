import { Router, Request, Response, NextFunction } from "express";
import { upload } from "./upload.middleware.js";
import { authenticate } from "../../shared/middleware/authenticate.js";
import { BadRequestError } from "../../shared/errors/index.js";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new BadRequestError("No file uploaded");
      }

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
