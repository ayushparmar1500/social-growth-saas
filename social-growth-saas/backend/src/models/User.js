import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
  },
  { _id: false }
);

const referralSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true, sparse: true },
    referredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    earnings: { type: Number, default: 0 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    wallet: walletSchema,
    referral: referralSchema,
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

