import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    platform: {
      type: String,
      enum: ["instagram", "tiktok", "youtube"],
      required: true,
      index: true,
    },
    pricePerUnit: {
      // price per 1 unit (e.g. 1 follower)
      type: Number,
      required: true,
      min: 0,
    },
    providerServiceId: {
      type: String,
      required: true,
    },
    minQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    maxQuantity: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Service = mongoose.model("Service", serviceSchema);

