import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: "2025-06-30.basil"
})