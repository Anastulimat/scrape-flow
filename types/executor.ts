import {Browser} from "puppeteer";
import {WorkflowTask} from "@/types/workflow";

// ----------------------------------------------------------------------
export type Environment = {
    browser?: Browser;

    // Phase with nodeId/taskId as key
    phases: Record<
        string, // key: nodeId
        {
            inputs: Record<string, string>;
            outputs: Record<string, string>;
        }
    >;
};

export type ExecutionEnvironment<T extends WorkflowTask> = {
    getInput(name: T["inputs"][number]["name"]): string;
}

