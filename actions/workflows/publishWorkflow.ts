"use server";

import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {WorkflowStatus} from "@/types/workflow";
import {FlowToExecutionPlan} from "@/lib/workflow/executionPlan";
import {calculateWorkflowCost} from "@/lib/workflow/helpers";
import {revalidatePath} from "next/cache";

// ----------------------------------------------------------------------

export async function PublishWorkflow({id, flowDefinition}: { id: string, flowDefinition: string }) {
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

    if (workflow.status !== WorkflowStatus.DRAFT) {
        throw new Error("Cannot publish a non-draft workflow");
    }

    const flow = JSON.parse(flowDefinition);
    const result = FlowToExecutionPlan(flow.nodes, flow.edges);

    if (result.error) {
        throw new Error("Flow definition is invalid");
    }

    if (!result.executionPlan) {
        throw new Error("No execution plan generated");
    }

    const creditsCost = calculateWorkflowCost(flow.nodes);
    await prisma.workflow.update({
        where: {
            id,
            userId
        },
        data: {
            definition: flowDefinition,
            executionPlan: JSON.stringify(result.executionPlan),
            status: WorkflowStatus.PUBLISHED,
            creditsCost: creditsCost,
        }
    });

    revalidatePath(`/workflow/editor/${id}`);

}