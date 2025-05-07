import React from "react";
import {LucideProps} from "lucide-react";
import {TaskParam, TaskType} from "@/types/task";
import {AppNode} from "@/types/appNode";

// ----------------------------------------------------------------------

export enum WorkflowStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
    label: string;
    icon: React.FC<LucideProps>;
    type: TaskType;
    isEntryPoint?: boolean;
    inputs: TaskParam[];
    outputs: TaskParam[];
    credits: number
}

export type WorkflowExecutionPlanPhase = {
    phase: number;
    nodes: AppNode[];
};


export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export enum WorkflowExecutionStatus {
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PENDING = "PENDING",
}

export enum WorkflowExecutionTrigger {
    MANUAL = "MANUAL",
    CRON = "CRON",
    SCHEDULED = "SCHEDULED",
}

export enum ExecutionPhaseStatus {
    CREATED = "CREATED",
    RUNNING = "RUNNING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PENDING = "PENDING",
}

