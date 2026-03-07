import { User } from "../models/User.js";
import { Order } from "../models/Order.js";
import { Service } from "../models/Service.js";
import { Coupon } from "../models/Coupon.js";
import { Transaction } from "../models/Transaction.js";

export async function getAdminOverview(req, res, next) {
  try {
    const [usersCount, ordersCount, servicesCount, totalRevenueAgg] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { status: { $in: ["processing", "completed"] } } },
        { $group: { _id: null, total: { $sum: "$price" } } },
      ]),
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    res.json({
      usersCount,
      ordersCount,
      servicesCount,
      totalRevenue,
    });
  } catch (err) {
    next(err);
  }
}

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

export async function toggleUserActive(req, res, next) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function listCoupons(req, res, next) {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    next(err);
  }
}

export async function createCoupon(req, res, next) {
  try {
    const { code, discountPercentage, expiresAt, maxUses } = req.body;
    const coupon = await Coupon.create({
      code,
      discountPercentage,
      expiresAt,
      maxUses,
    });
    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
}

export async function listTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(200);
    res.json(transactions);
  } catch (err) {
    next(err);
  }
}

