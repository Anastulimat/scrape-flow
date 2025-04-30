import prisma from "@/lib/prisma";
import {auth} from "@clerk/nextjs/server";
import Editor from "@/app/workflow/_components/Editor";

// ----------------------------------------------------------------------

const WorkflowEditor = async ({params}: { params: { workflowId: string } }) => {
    const {workflowId} = params;

    const {userId} = auth();
    if (!userId) {
        return <div>Unauthenticated</div>;
    }


    const workflow = await prisma.workflow.findUnique({
        where: {
            id: workflowId,
            userId
        },
    });

    if (!workflow) {
        return <div>Workflow not found</div>;
    }


    return (
        <Editor workflow={workflow} />
    );
};

export default WorkflowEditor;
