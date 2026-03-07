import express from "express";
import {
  adminListOrders,
  adminUpdateOrderStatus,
  createOrder,
  getOrderById,
  listMyOrders,
} from "../controllers/orderController.js";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// User order routes
router.use(authMiddleware);

router.get("/", listMyOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);

// Admin order management
router.get("/admin/all", adminMiddleware, adminListOrders);
router.patch("/admin/:id/status", adminMiddleware, adminUpdateOrderStatus);

export default router;

