"use server";

import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ----------------------------------------------------------------------

export async function RemoveWorkflowSchedule(id: string) {
    const {userId} = auth();
    if (!userId) {
        throw new Error("Not authenticated");
    }

    await prisma.workflow.update({
        where: {
            id,
            userId
        },
        data: {
            cron: null,
            nextRunAt: null
        }
    });

    revalidatePath(`/workflows`);
}