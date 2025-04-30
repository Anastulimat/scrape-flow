"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {DeleteWorkflow} from "@/actions/workflows/deleteWorkflow";
import {toast} from "sonner";

// ----------------------------------------------------------------------

interface Props {
    open: boolean;
    setOpen: (open: boolean) => void;
    workflowName: string;
    workflowId: string;
}

// ----------------------------------------------------------------------

const DeleteWorkflowDialog = ({open, setOpen, workflowName, workflowId}: Props) => {
    const [confirmText, setConfirmText] = useState("");

    const deleteMutation = useMutation({
        mutationFn: DeleteWorkflow,
        onSuccess: () => {
            toast.success("Workflow deleted successfully", {id: workflowId});
            setConfirmText("");
        },
        onError: () => {
            toast.error("Failed to delete workflow", {id: workflowId});
        }
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDescription>
                        If you delete this workflow, all of its data will be permanently deleted. This action cannot be
                        undone.
                        <div className="flex flex-col py-4 gap-2">
                            <p>
                                If you are sure, entre <b>{workflowName}</b> to confirm:
                            </p>
                            <Input
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                            />
                        </div>
                    </AlertDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText("")}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={confirmText !== workflowName || deleteMutation.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                            toast.loading("Deleting workflow...", {id: workflowId});
                            deleteMutation.mutate(workflowId);
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteWorkflowDialog;
