import stripe from "stripe";
import Booking from "../models/booking.js";

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;
  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body, // Make sure you're using raw body!
      sig,
      process.env.STRIPE_WEBHOOKS_SECRET
    );
  } catch (error) {
    console.error("Stripe signature verification failed:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    // ✅ Listen for correct event type
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const bookingId = session.metadata?.bookingId;
      if (!bookingId) {
        console.log("Missing booking ID in session metadata");
        return response.status(400).send("Missing booking ID");
      }

      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        paymentLink: "", // ✅ Optional
      });

      console.log("✅ Booking marked as paid:", bookingId);
    } else {
      console.log("Unhandled event type:", event.type);
    }

    response.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    response.status(500).send("Internal Server Error");
  }
};
