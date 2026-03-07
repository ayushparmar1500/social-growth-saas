import { Order } from "../models/Order.js";
import { Service } from "../models/Service.js";
import { Coupon } from "../models/Coupon.js";
import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import { smmCreateOrder } from "../services/smmService.js";

function calculatePrice(quantity, pricePerUnit, discountPercentage = 0) {
  const base = quantity * pricePerUnit;
  const discount = discountPercentage > 0 ? (base * discountPercentage) / 100 : 0;
  return Math.max(base - discount, 0);
}

export async function createOrder(req, res, next) {
  try {
    const { serviceId, quantity, link, couponCode } = req.body;
    const userId = req.user.id;

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(400).json({ message: "Invalid service" });
    }

    if (quantity < service.minQuantity || quantity > service.maxQuantity) {
      return res.status(400).json({
        message: `Quantity must be between ${service.minQuantity} and ${service.maxQuantity}`,
      });
    }

    let discountPercentage = 0;
    let appliedCouponCode;

    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      const now = new Date();

      if (
        coupon &&
        coupon.expiresAt > now &&
        (coupon.maxUses === 0 || coupon.usedCount < coupon.maxUses)
      ) {
        discountPercentage = coupon.discountPercentage;
        appliedCouponCode = coupon.code;
      }
    }

    const price = calculatePrice(quantity, service.pricePerUnit, discountPercentage);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.wallet.balance < price) {
      return res.status(400).json({ message: "Insufficient wallet balance" });
    }

    // Deduct from wallet and create debit transaction atomically
    user.wallet.balance -= price;

    const transaction = new Transaction({
      user: user._id,
      amount: price,
      type: "debit",
      status: "completed",
      description: `Order payment for ${service.name}`,
    });

    const order = new Order({
      user: user._id,
      service: service._id,
      quantity,
      link,
      status: "pending",
      price,
      couponCode: appliedCouponCode,
    });

    await Promise.all([user.save(), transaction.save(), order.save()]);

    // Attempt to send order to SMM panel
    try {
      const smmResult = await smmCreateOrder({
        service,
        quantity,
        link,
      });

      order.providerOrderId = smmResult.providerOrderId;
      order.providerStatus = smmResult.status;
      order.status = "processing";
      await order.save();
    } catch (e) {
      console.error("Failed to push order to SMM panel:", e.message);
      // keep order as pending; will require manual retry
    }

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

export async function listMyOrders(req, res, next) {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("service")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate("service");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export async function adminListOrders(req, res, next) {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status = status;
    }
    const orders = await Order.find(filter)
      .populate("service")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
}

