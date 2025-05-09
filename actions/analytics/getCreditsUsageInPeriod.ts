"use server";

import {Period} from "@/types/analytics";
import {auth} from "@clerk/nextjs/server";
import {periodToDateRange} from "@/lib/helper/dates";
import prisma from "@/lib/prisma";
import {eachDayOfInterval, format} from "date-fns";
import {ExecutionPhaseStatus} from "@/types/workflow";

// ----------------------------------------------------------------------

type Stats = Record<string, {
    success: number,
    failed: number,
}>;

const {COMPLETED, FAILED} = ExecutionPhaseStatus;

// ----------------------------------------------------------------------


export async function GetCreditsUsageInPeriod(selectedPeriod: Period) {
    const {userId} = auth();
    if (!userId) {
        throw new Error("Not authenticated");
    }

    const dateRange = periodToDateRange(selectedPeriod);
    const executionPhases = await prisma.executionPhase.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
            },
            status: {
                in: [COMPLETED, FAILED]
            }
        },
    });

    const dateFormat = "yyyy-MM-dd";

    const stats: Stats = eachDayOfInterval({
        start: dateRange.startDate,
        end: dateRange.endDate,
    })
        .map(date => format(date, dateFormat))
        .reduce((acc, date) => {
            acc[date] = {
                success: 0,
                failed: 0,
            };
            return acc;
        }, {} as any);

    executionPhases.forEach(phase => {
        const date = format(phase.startedAt!, dateFormat);
        if (phase.status === COMPLETED) {
            stats[date].success += phase.creditsConsumed || 0;
        }

        if (phase.status === FAILED) {
            stats[date].failed += phase.creditsConsumed || 0;
        }
    });

    return Object.entries(stats).map(([date, info]) => ({
        date,
        ...info
    }));

}