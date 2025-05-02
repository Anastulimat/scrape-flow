import {Suspense} from "react";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import {Loader2Icon} from "lucide-react";
import {GetWorkflowWithPhases} from "@/actions/workflows/getWorkflowWithPhases";
import ExecutionViewer from "@/app/workflow/runs/[workflowId]/[executionId]/_components/ExecutionViewer";

// ----------------------------------------------------------------------

export default function ExecutionViewerPage({params}: { params: { workflowId: string, executionId: string } }) {
    return (
        <div className="flex flex-col h-screen w-full overflow-hidden">
            <Topbar
                title="Workflow run details"
                workflowId={params.workflowId}
                subtitle={`Run ID: ${params.executionId}`}
                hideButtons
            />
            <section className="flex h-full overflow-auto">
                <Suspense fallback={
                    <div className="flex w-full items-center justify-center">
                        <Loader2Icon className="h-10 w-10 animate-spin stroke-primary"/>
                    </div>
                }>
                    <ExecutionViewerWrapper executionId={params.executionId}/>
                </Suspense>
            </section>
        </div>
    )
}

async function ExecutionViewerWrapper({executionId}: { executionId: string }) {

    const workflowExecution = await GetWorkflowWithPhases(executionId);
    if (!workflowExecution) return (
        <div>Workflow execution not found</div>
    )

    return (
        <ExecutionViewer
            initialData={workflowExecution}
        />
    )
}