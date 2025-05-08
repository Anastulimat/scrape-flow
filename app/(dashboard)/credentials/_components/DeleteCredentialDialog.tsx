"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {AlertDescription} from "@/components/ui/alert";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {Button} from "@/components/ui/button";
import {XIcon} from "lucide-react";
import {DeleteCredential} from "@/actions/credentials/deleteCredential";

// ----------------------------------------------------------------------

interface Props {
    name: string
}

// ----------------------------------------------------------------------

const DeleteCredentialDialog = ({name}: Props) => {
    const [open, setOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const deleteMutation = useMutation({
        mutationFn: DeleteCredential,
        onSuccess: () => {
            toast.success("Credential deleted successfully", {id: name});
            setConfirmText("");
        },
        onError: () => {
            toast.error("Failed to delete credential", {id: name});
        }
    });

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <XIcon size={18}/>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDescription>
                        If you delete this credential, all of its data will be permanently deleted. This action cannot be
                        undone.
                        <div className="flex flex-col py-4 gap-2">
                            <p>
                                If you are sure, entre <b>{name}</b> to confirm:
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
                        disabled={confirmText !== name || deleteMutation.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                            toast.loading("Deleting credential...", {id: name});
                            deleteMutation.mutate(name);
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteCredentialDialog;
