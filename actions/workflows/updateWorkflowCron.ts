"use server";

import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import parser from "cron-parser";
import {revalidatePath} from "next/cache";

// ----------------------------------------------------------------------

export async function UpdateWorkflowCron({id, cron}: { id: string, cron: string }) {
    const {userId} = auth();
    if (!userId) {
        throw new Error("Not authenticated");
    }

    try {
        const interval = parser.parseExpression(cron, {utc: true});
        await prisma.workflow.update({
            where: {
                id,
                userId
            },
            data: {
                cron,
                nextRunAt: interval.next().toDate(),
            }
        });
    } catch (error: any) {
        console.error("Invalid cron expression:", error.message);
        throw new Error("Invalid cron expression");
    }

    revalidatePath(`/workflows`);
}