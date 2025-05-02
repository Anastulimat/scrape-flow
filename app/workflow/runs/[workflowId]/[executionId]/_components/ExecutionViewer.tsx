"use client";

import {ReactNode, useState} from 'react';
import {GetWorkflowWithPhases} from "@/actions/workflows/getWorkflowWithPhases";
import {useQuery} from "@tanstack/react-query";
import {WorkflowExecutionStatus} from "@/types/workflow";
import {
    CalendarIcon,
    CircleDashedIcon,
    ClockIcon,
    CoinsIcon,
    Loader2Icon,
    LucideIcon,
    WorkflowIcon
} from "lucide-react";
import {formatDistanceToNow} from "date-fns";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {datesToDurationString} from '@/lib/helper/dates';
import {getPhasesTotalCost} from '@/lib/helper/phases';
import { GetWorkflowPhaseDetails } from '@/actions/workflows/getWorkflowPhaseDetails';

// ----------------------------------------------------------------------

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowWithPhases>>;

const ExecutionViewer = ({initialData}: { initialData: ExecutionData }) => {
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

    const query = useQuery({
        queryKey: ["execution", initialData?.id],
        initialData,
        queryFn: () => GetWorkflowWithPhases(initialData!.id),
        refetchInterval: (q) => q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
    });

    const phaseDetails = useQuery({
        queryKey: ["phaseDetails", selectedPhase],
        enabled: selectedPhase !== null,
        queryFn: () => GetWorkflowPhaseDetails(selectedPhase!)
    })

    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

    const duration = datesToDurationString(query.data?.completeAt, query.data?.startedAt);

    const creditsConsumed = getPhasesTotalCost(query.data?.phases || []);

    return (
        <div className="flex w-full h-full">
            <aside
                className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
                <div className="py-4 px-2">

                    {/* Status label */}
                    <ExecutionLabel
                        icon={CircleDashedIcon}
                        label="Status"
                        value={query.data?.status}
                    />

                    {/* Started at label */}
                    <ExecutionLabel
                        icon={CalendarIcon}
                        label="Started at"
                        value={
                            <span className="lowercase">
                                {
                                    query.data?.startedAt
                                        ? formatDistanceToNow(new Date(query.data?.startedAt), {addSuffix: true})
                                        : "-"
                                }
                            </span>
                        }
                    />

                    {/* Duration label */}
                    <ExecutionLabel
                        icon={ClockIcon}
                        label="Duration"
                        value={duration ? duration : <Loader2Icon size={20} className="animate-spin"/>}
                    />

                    {/* Credits consumed label */}
                    <ExecutionLabel
                        icon={CoinsIcon}
                        label="Credits consumed"
                        value={creditsConsumed}
                    />
                </div>

                <Separator/>

                <div className="flex justify-center items-center py-2 px-4">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <WorkflowIcon size={20} className="stroke-muted-foreground/80"/>
                        <span className="font-semibold">
                            Phases
                        </span>
                    </div>
                </div>

                <Separator/>

                <div className="overflow-auto h-full px-2 py-4">
                    {query.data?.phases.map((phase, index) => (
                        <Button
                            key={phase.id}
                            className="w-full justify-between"
                            variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                            onClick={() => {
                                if (isRunning) return;
                                setSelectedPhase(phase.id);
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <Badge variant={"outline"}>
                                    {index + 1}
                                </Badge>
                                <p className="font-semibold">
                                    {phase.name}
                                </p>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {phase.status}
                            </p>
                        </Button>
                    ))}
                </div>
            </aside>

            <div className="flex w-full h-full">
                <pre>
                    {JSON.stringify(phaseDetails.data, null, 4)}
                </pre>
            </div>
        </div>
    );
};

export default ExecutionViewer;

// ----------------------------------------------------------------------

function ExecutionLabel({icon, label, value}: { icon: LucideIcon, label: ReactNode, value: ReactNode }) {
    const Icon = icon;
    return (
        <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="text-muted-foreground flex items-center gap-2">
                <Icon size={20} className="stroke-muted-foreground/80"/>
                <span>{label}</span>
            </div>
            <div className="font-semibold capitalize flex gap-2 items-center">
                {value}
            </div>
        </div>
    )
}