"use server";

import prisma from "@/lib/prisma";
import {auth} from "@clerk/nextjs/server";

// ----------------------------------------------------------------------

export async function GetWorkflowWithPhases(executionId: string) {
    const {userId} = auth();
    if (!userId) {
        throw new Error("Not authenticated");
    }

    return prisma.workflowExecution.findUnique({
        where: {
            id: executionId,
            userId,
        },
        include: {
            phases: {
                orderBy: {
                    number: "asc"
                }
            }
        }
    });
}