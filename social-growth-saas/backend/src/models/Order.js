import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    link: {
      // profile username or post URL
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "canceled"],
      default: "pending",
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    couponCode: {
      type: String,
    },
    providerOrderId: {
      type: String,
    },
    providerStatus: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);

