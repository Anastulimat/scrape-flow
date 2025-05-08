"use client";

import {TaskParam, TaskParamType} from "@/types/task";
import StringParam from "@/app/workflow/_components/nodes/param/StringParam";
import {useReactFlow} from "@xyflow/react";
import {AppNode} from "@/types/appNode";
import {useCallback} from "react";
import BrowserInstanceParam from "@/app/workflow/_components/nodes/param/BrowserInstanceParam";
import SelectParam from "./param/SelectParam";
import CredentialParam from "@/app/workflow/_components/nodes/param/CredentialParam";

// ----------------------------------------------------------------------

const NodeParamField = ({param, nodeId, disabled}: { param: TaskParam, nodeId: string, disabled: boolean }) => {

    const {updateNodeData, getNode} = useReactFlow();
    const node = getNode(nodeId) as AppNode;
    const value = node?.data.inputs?.[param.name];

    const updateNodeParamValue = useCallback((newValue: string) => {
        updateNodeData(nodeId, {
            inputs: {
                ...node?.data.inputs,
                [param.name]: newValue,
            },
        });
    }, [updateNodeData, param.name, node?.data.inputs, nodeId])

    switch (param.type) {
        case TaskParamType.STRING:
            return (
                <StringParam
                    param={param}
                    value={value}
                    updateNodeParamValue={updateNodeParamValue}
                    disabled={disabled}
                />
            );

        case TaskParamType.SELECT:
            return (
                <SelectParam
                    param={param}
                    value={value}
                    updateNodeParamValue={updateNodeParamValue}
                    disabled={disabled}
                />
            );

        case TaskParamType.CREDENTIAL:
            return (
                <CredentialParam
                    param={param}
                    value={value}
                    updateNodeParamValue={updateNodeParamValue}
                    disabled={disabled}
                />
            );

        case TaskParamType.BROWSER_INSTANCE:
            return (
                <BrowserInstanceParam
                    param={param}
                    value={""}
                    updateNodeParamValue={updateNodeParamValue}
                />
            );

        default:
            return (
                <div className="w-full">
                    <p className="text-xs text-muted-foreground">Not implemented</p>
                </div>
            );
    }
};

export default NodeParamField;
