"use server";

import {Period} from "@/types/analytics";
import {periodToDateRange} from "@/lib/helper/dates";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {WorkflowExecutionStatus} from "@/types/workflow";

// ----------------------------------------------------------------------
const {COMPLETED, FAILED} = WorkflowExecutionStatus;

// ----------------------------------------------------------------------

export async function GetStatsCardsValues(period: Period) {
    const {userId} = auth();
    if (!userId) {
        throw new Error("Not authenticated");
    }

    const dateRange = periodToDateRange(period);
    const executions = await prisma.workflowExecution.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
            },
            status: {
                in: [COMPLETED, FAILED]
            },
        },
        select: {
            creditsConsumed: true,
            phases: {
                where: {
                    creditsConsumed: {
                        not: null
                    },
                },
                select: {
                    creditsConsumed: true,
                }
            },
        }
    });

    const stats = {
        workflowExecutions: executions.length,
        creditsConsumed: 0,
        phaseExecutions: 0,
    }

    stats.creditsConsumed = executions.reduce(
        (sum, execution) => sum + execution.creditsConsumed,
        0
    );

    stats.phaseExecutions = executions.reduce(
        (sum, execution) => sum + execution.phases.length,
        0
    );

    return stats;
}