import React, {Suspense} from 'react';
import {Skeleton} from "@/components/ui/skeleton";
import {GetWorkflowsForUser} from "@/actions/workflows/getWorkflowsForUser";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {AlertCircle, InboxIcon} from "lucide-react";
import CreateWorkflowDialog from "@/app/(dashboard)/workflows/_components/CreateWorkflowDialog";
import WorkflowCard from './_components/WorkflowCard';

// ----------------------------------------------------------------------

const Workflows = () => {
    return (
        <div className="flex-1 flex flex-col h-full">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">
                        Workflows
                    </h1>
                    <p className="text-muted-foreground">Manage your workflows</p>
                </div>
                <CreateWorkflowDialog />
            </div>

            <div className="h-full py-6">
                <Suspense fallback={<UserWorkflowsSkeleton/>}>
                    <UserWorkflows/>
                </Suspense>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------

const UserWorkflowsSkeleton = () => {
    return (
        <div className="space-y-2">
            {
                [1, 2, 3, 4].map((item) => (
                    <Skeleton key={item} className="h-32 w-full"/>
                ))
            }
        </div>
    )
}


const UserWorkflows = async () => {
    const workflows = await GetWorkflowsForUser();
    if (!workflows) {
        return (
            <Alert variant={"destructive"}>
                <AlertCircle className="h-4 w-4"/>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    There was an error fetching your workflows. Please try again later.
                </AlertDescription>
            </Alert>
        );
    }

    if (workflows.length === 0) {
        return (
            <div className="flex flex-col gap-4 h-full items-center justify-center">
                <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
                    <InboxIcon size={40} className="stroke-primary"/>
                </div>
                <div className="flex flex-col gap-1 text-center">
                    <p className="font-bold">No workflow created yet</p>
                    <p className="text-sm text-muted-foreground">
                        Click on the button below to create your first workflow.
                    </p>
                </div>
                <CreateWorkflowDialog triggerText={"Create your first workflow"}/>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {workflows.map((workflow) => (
                <WorkflowCard key={workflow.id} workflow={workflow}/>
            ))}
        </div>
    )


}

export default Workflows;
