import "server-only";
import Stripe from "stripe";
import {getCreditsPack, PackId} from "@/types/billing";
import prisma from "@/lib/prisma";

// ----------------------------------------------------------------------

export async function handleCheckoutSessionCompleted(event: Stripe.Checkout.Session) {
    // writeFile("sessions_completed.json", JSON.stringify(event), () => {});
    if (!event.metadata) {
        throw new Error("Missing metadata");
    }

    const {userId, packageId} = event.metadata;
    if (!userId) {
        throw new Error("Missing userId");
    }

    if (!packageId) {
        throw new Error("Missing packageId");
    }

    const purchasedPack = getCreditsPack(packageId as PackId);
    if (!purchasedPack) {
        throw new Error("Invalid packageId");
    }

    await prisma.userBalance.upsert({
        where: {userId},
        create: {
            userId,
            credits: purchasedPack.credits
        },
        update: {
            credits: {
                increment: purchasedPack.credits
            }
        },
    });
}