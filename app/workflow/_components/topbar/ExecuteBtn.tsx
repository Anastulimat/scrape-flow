"use client";

import {Button} from "@/components/ui/button";
import {PlayIcon} from "lucide-react";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";


// ----------------------------------------------------------------------

const ExecuteBtn = ({workflowId}: { workflowId: string }) => {

    const generate = useExecutionPlan();

    return (
        <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
                const plan = generate();
                console.log("--- Plan ---");
                console.table(plan);
            }}
        >
            <PlayIcon size={16} className="stroke-orange-400"/>
            Execute
        </Button>
    );
};

export default ExecuteBtn;
