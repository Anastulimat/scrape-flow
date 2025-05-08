import {TaskParamType, TaskType} from "@/types/task";
import {LucideProps, SendIcon} from "lucide-react";
import {WorkflowTask} from "@/types/workflow";

// ----------------------------------------------------------------------

export const DeliverViaWebhookTask = {
    type: TaskType.DELIVER_VIA_WEBHOOK,
    label: "Deliver via webhook",
    icon: (props: LucideProps) => <SendIcon className="stroke-orange-400" {...props}/>,
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: "Target URL",
            type: TaskParamType.STRING,
            required: true,
        },
        {
            name: "Body",
            type: TaskParamType.STRING,
            required: true,
        },
    ] as const,
    outputs: [] as const,
} satisfies WorkflowTask;
