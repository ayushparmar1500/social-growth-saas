import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import { createWalletTopUpIntent, constructWebhookEvent } from "../services/stripeService.js";

export async function getWallet(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      wallet: user.wallet,
      transactions,
    });
  } catch (err) {
    next(err);
  }
}

export async function createTopUpIntent(req, res, next) {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than zero" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const transaction = await Transaction.create({
      user: user._id,
      amount,
      type: "credit",
      status: "pending",
      description: "Wallet top-up",
    });

    const paymentIntent = await createWalletTopUpIntent({
      amount,
      metadata: {
        userId: user._id.toString(),
        transactionId: transaction._id.toString(),
      },
    });

    transaction.stripePaymentIntentId = paymentIntent.id;
    await transaction.save();

    res.status(201).json({
      clientSecret: paymentIntent.client_secret,
      transactionId: transaction._id,
    });
  } catch (err) {
    next(err);
  }
}

export async function stripeWebhook(req, res, next) {
  try {
    const signature = req.headers["stripe-signature"];
    const event = constructWebhookEvent(req.body, signature);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const { userId, transactionId } = paymentIntent.metadata || {};

      if (userId && transactionId) {
        const transaction = await Transaction.findById(transactionId);
        const user = await User.findById(userId);

        if (transaction && user && transaction.status === "pending") {
          transaction.status = "completed";
          await transaction.save();

          user.wallet.balance += transaction.amount;
          await user.save();
        }
      }
    } else if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object;
      const { transactionId } = paymentIntent.metadata || {};
      if (transactionId) {
        const transaction = await Transaction.findById(transactionId);
        if (transaction && transaction.status === "pending") {
          transaction.status = "failed";
          await transaction.save();
        }
      }
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
}

