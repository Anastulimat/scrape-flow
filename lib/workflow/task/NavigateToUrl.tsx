import {TaskParamType, TaskType} from "@/types/task";
import {Link2Icon, LucideProps} from "lucide-react";
import {WorkflowTask} from "@/types/workflow";

// ----------------------------------------------------------------------

export const NavigateToUrlTask = {
    type: TaskType.NAVIGATE_TO_URL,
    label: "Navigate to URL",
    icon: (props: LucideProps) => <Link2Icon className="stroke-orange-400" {...props}/>,
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE,
            required: true,
        },
        {
            name: "URL",
            type: TaskParamType.STRING,
            required: true,
        },
    ] as const,
    outputs: [
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE,
        },
    ] as const,
} satisfies WorkflowTask;
