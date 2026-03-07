import express from "express";
import { adminMiddleware, authMiddleware } from "../middleware/authMiddleware.js";
import {
  createCoupon,
  getAdminOverview,
  listCoupons,
  listTransactions,
  listUsers,
  toggleUserActive,
} from "../controllers/adminController.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

router.get("/overview", getAdminOverview);
router.get("/users", listUsers);
router.patch("/users/:id/toggle-active", toggleUserActive);

router.get("/coupons", listCoupons);
router.post("/coupons", createCoupon);

router.get("/transactions", listTransactions);

export default router;

