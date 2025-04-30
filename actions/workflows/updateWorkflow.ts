"use server";

import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {WorkflowStatus} from "@/types/workflow";
import {waitFor} from "@/lib/helper/waitFor";

// ----------------------------------------------------------------------

export async function UpdateWorkflow({id, definition}: { id: string, definition: string }) {
    const {userId} = auth();
    if (!userId) {
        throw new Error("Not authenticated");
    }

    await waitFor(5000);
    const workflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId
        }
    });

    if (!workflow) {
        throw new Error("Workflow not found");
    }

    if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("Cannot update a published workflow");
    }

    await prisma.workflow.update({
        where: {
            id,
            userId
        },
        data: {
            definition
        }
    });
}