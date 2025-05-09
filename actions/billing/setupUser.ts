"use server";

import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {redirect} from "next/navigation";

// ----------------------------------------------------------------------

export async function SetupUser() {
    const {userId} = auth();
    if (!userId) {
        throw new Error("Not authenticated");
    }

    const balance = await prisma.userBalance.findUnique({
        where: {userId}
    });

    if (!balance) {
        // Free 200 credits
        await prisma.userBalance.create({
            data: {
                userId,
                credits: 200
            }
        });
    }

    redirect("/");
}