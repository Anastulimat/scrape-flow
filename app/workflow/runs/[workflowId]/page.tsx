import Topbar from "@/app/workflow/_components/topbar/Topbar";
import {GetWorkflowExecutions} from "@/actions/workflows/getWorkflowExecutions";
import {InboxIcon, Loader2Icon} from "lucide-react";
import {Suspense} from "react";
import ExecutionsTable from "@/app/workflow/runs/[workflowId]/_components/ExecutionsTable";

// ----------------------------------------------------------------------

export default function ExecutionsPage({params}: { params: { workflowId: string } }) {
    return (
        <div className="h-full w-full overflow-auto">
            <Topbar
                title="All runs"
                subtitle="List of all workflow runs"
                workflowId={params.workflowId}
                hideButtons
            />

            <Suspense
                fallback={
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader2Icon size={20} className="animate-spin stroke-primary"/>
                    </div>
                }
            >
                <ExecutionsTableWrapper workflowId={params.workflowId}/>
            </Suspense>
        </div>
    );
}

async function ExecutionsTableWrapper({workflowId}: { workflowId: string }) {
    const executions = await GetWorkflowExecutions(workflowId);
    if (!executions) return (
        <div>No executions found</div>
    );

    if (executions.length === 0) {
        return (
            <div className="container w-full py-6">
                <div className="flex items-center justify-center gap-2 flex-col h-full">
                    <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
                        <InboxIcon size={40} className="stroke-primary"/>
                    </div>
                    <div className="flex flex-col gap-1 text-center">
                        <p className="font-bold">
                            No runs have been triggered yet for this workflow
                        </p>
                        <p className="text-sm text-muted-foreground">
                            You can trigger a new run in the editor page
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container py-6 w-full">
            <ExecutionsTable workflowId={workflowId} initialData={executions}/>
        </div>
    )
}