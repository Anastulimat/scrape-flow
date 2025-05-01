import {useReactFlow} from "@xyflow/react";
import {useCallback} from "react";
import {FlowToExecutionPlan, FlowToExecutionPlanValidationError} from "@/lib/workflow/executionPlan";
import {AppNode} from "@/types/appNode";
import useFlowValidation from "@/components/hooks/useFlowValidation";
import {toast} from "sonner";

// ----------------------------------------------------------------------


const useExecutionPlan = () => {
    const {toObject} = useReactFlow();
    const {setInvalidInputs, clearErrors} = useFlowValidation();

    const handleError = useCallback((error: any) => {
        switch (error.type) {
            case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
                toast.error("The workflow must have an entry point");
                break;

            case FlowToExecutionPlanValidationError.INVALID_INPUTS:
                toast.error("Not all inputs values are set");
                setInvalidInputs(error.invalidElements);
                break;

            default:
                toast.error("Something went wrong.");
                break;
        }
    }, [setInvalidInputs]);

    return useCallback(() => {
        const {nodes, edges} = toObject();
        const {executionPlan, error} = FlowToExecutionPlan(nodes as AppNode[], edges);

        if (error) {
            handleError(error);
            return null;
        }

        clearErrors();
        return executionPlan;
    }, [clearErrors, handleError, toObject]);

}

export default useExecutionPlan;