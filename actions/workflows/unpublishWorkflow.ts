"use server";

import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {WorkflowStatus} from "@/types/workflow";
import {revalidatePath} from "next/cache";

// ----------------------------------------------------------------------

export async function UnpublishWorkflow(id: string) {
    const {userId} = auth();
    if (!userId) {
        throw new Error("Not authenticated");
    }

    const workflow = await prisma.workflow.findUnique({
        where: {
            id,
            userId
        }
    });

    if (!workflow) {
        throw new Error("Workflow not found");
    }

    if (workflow.status !== WorkflowStatus.PUBLISHED) {
        throw new Error("Cannot unpublish a non-published workflow");
    }

    await prisma.workflow.update({
        where: {
            id,
            userId
        },
        data: {
            status: WorkflowStatus.DRAFT,
            executionPlan: null,
            creditsCost: 0
        }
    });

    revalidatePath(`/workflow/editor/${id}`);

}