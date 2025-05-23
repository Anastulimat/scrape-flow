"use client";

import {Button} from "@/components/ui/button";
import {SaveIcon} from "lucide-react";
import {useReactFlow} from "@xyflow/react";
import {useMutation} from "@tanstack/react-query";
import {UpdateWorkflow} from "@/actions/workflows/updateWorkflow";
import {toast} from "sonner";

// ----------------------------------------------------------------------

const SaveBtn = ({workflowId}: { workflowId: string }) => {

    const {toObject} = useReactFlow();

    const saveMutation = useMutation({
        mutationFn: UpdateWorkflow,
        onSuccess: () => {
            toast.success("Workflow saved successfully", {id: "save-workflow"});
        },
        onError: () => {
            toast.error("Failed to save workflow", {id: "save-workflow"});
        }
    });

    return (
        <Button
            disabled={saveMutation.isPending}
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
                const workflowDefinition = JSON.stringify(toObject());
                toast.loading("Saving workflow...", {id: "save-workflow"});
                saveMutation.mutate({
                    id: workflowId,
                    definition: workflowDefinition,
                });
            }}
        >
            <SaveIcon size={16} className="stroke-green-400"/>
            {saveMutation.isPending ? "Saving..." : "Save"}
        </Button>
    );
};

export default SaveBtn;
