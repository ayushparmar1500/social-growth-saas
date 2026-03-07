import express from "express";
import {
  createService,
  deleteService,
  getService,
  listServices,
  updateService,
} from "../controllers/serviceController.js";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listServices);
router.get("/:id", getService);

router.post("/", authMiddleware, adminMiddleware, createService);
router.put("/:id", authMiddleware, adminMiddleware, updateService);
router.delete("/:id", authMiddleware, adminMiddleware, deleteService);

export default router;

