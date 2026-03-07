import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createTopUpIntent, getWallet } from "../controllers/walletController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getWallet);
router.post("/topup", createTopUpIntent);

export default router;

