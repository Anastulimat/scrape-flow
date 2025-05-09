import {headers} from "next/headers";
import {stripe} from "@/lib/stripe/stripe";
import {NextResponse} from "next/server";

// ----------------------------------------------------------------------
export async function POST(request: Request) {
    const body = await request.text();
    const signature = headers().get('stripe-signature') as string;

    try {
        const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
        return new NextResponse(null, {status: 200});

    } catch (error) {
        console.log("Stripe webhook error: ", error);
        return new NextResponse("Webhook error", {status: 400});
    }
}