import {TaskParamType, TaskType} from "@/types/task";
import {DatabaseIcon, LucideProps} from "lucide-react";
import {WorkflowTask} from "@/types/workflow";

// ----------------------------------------------------------------------

export const WritePropertyToJsonTask = {
    type: TaskType.WRITE_PROPERTY_TO_JSON,
    label: "Write property to JSON",
    icon: (props: LucideProps) => <DatabaseIcon className="stroke-orange-400" {...props}/>,
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: "JSON",
            type: TaskParamType.STRING,
            required: true,
        },
        {
            name: "Property name",
            type: TaskParamType.STRING,
            required: true,
        },
        {
            name: "Property value",
            type: TaskParamType.STRING,
            required: true,
        },
    ] as const,
    outputs: [
        {
            name: "Updated JSON",
            type: TaskParamType.STRING,
        },
    ] as const,
} satisfies WorkflowTask;
