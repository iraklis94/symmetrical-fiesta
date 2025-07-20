import { v } from "convex/values";
import { action } from "../_generated/server";
import Stripe from "stripe";

/**
 * createPaymentIntent
 *
 * This action creates a Stripe PaymentIntent and returns the client secret
 * that is required on the client to initialize the Stripe PaymentSheet.
 * The amount should be provided in cents to avoid floating-point errors.
 */
export default action({
  args: {
    amount: v.number(), // amount in cents
    currency: v.optional(v.string()),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key not configured in environment");
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2023-10-16",
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: args.amount,
      currency: args.currency || "eur",
      payment_method_types: ["card"],
      metadata: args.metadata ?? {},
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Failed to create PaymentIntent");
    }

    return {
      clientSecret: paymentIntent.client_secret,
    };
  },
});