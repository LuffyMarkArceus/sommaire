import {
  handleCheckouSessionCompleted,
  handleSubscriptionDeleted,
} from "@/lib/payments";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
  const paylooad = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    event = stripe.webhooks.constructEvent(paylooad, sig!, endpointSecret);

    switch (event.type) {
      case "checkout.session.completed":
        const sessionId = event.data.object.id;

        const session = await stripe.checkout.sessions.retrieve(sessionId, {
          expand: ["line_items"],
        });

        await handleCheckouSessionCompleted({ session, stripe });
        console.log("Checkout Session Completed");
        break;

      case "customer.subscription.deleted":
        const subscriptionId = event.data.object.id;

        await handleSubscriptionDeleted({ subscriptionId, stripe });
        console.log("Customer Subscription Deleted");
        break;
      default:
        console.log(`Unhandled event type : ${event.type}`);
    }
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed To Trigger WebHook", err },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status: "success",
  });
};
