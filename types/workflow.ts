import React from "react";
import {LucideProps} from "lucide-react";
import {TaskParam, TaskType} from "@/types/task";

// ----------------------------------------------------------------------

export enum WorkflowStatus {
    DRAFT = "DRAFT",
    PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
    label: string;
    icon: React.FC<LucideProps>;
    type: TaskType;
    inEntryPoints?: boolean;
    inputs: TaskParam[];
    outputs: TaskParam[];
    credits: number
}