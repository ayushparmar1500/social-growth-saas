import Stripe from "stripe";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "../config/env.js";

if (!STRIPE_SECRET_KEY) {
  console.warn("Stripe secret key is not set. Stripe integration will be disabled.");
}

export const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" }) : null;

export async function createWalletTopUpIntent({ amount, currency = "usd", metadata = {} }) {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

export function constructWebhookEvent(rawBody, signature) {
  if (!stripe || !STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe webhook is not configured");
  }

  return stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
}

