"use client";

import React from 'react';
import {TaskType} from "@/types/task";
import {TaskRegistry} from "@/lib/workflow/task/Registry";
import {Badge} from "@/components/ui/badge";
import {CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useReactFlow} from "@xyflow/react";
import {AppNode} from '@/types/appNode';
import {CreateFlowNode} from "@/lib/workflow/createFlowNode";

// ----------------------------------------------------------------------


const NodeHeader = ({taskType, nodeId}: { taskType: TaskType, nodeId: string }) => {
    const task = TaskRegistry[taskType];
    const {deleteElements, getNode, addNodes} = useReactFlow();

    return (
        <div className="flex items-center gap-2 p-2">
            <task.icon size={16}/>
            <div className="flex justify-between items-center w-full">
                <p className="text-xs font-bold uppercase text-muted-foreground">
                    {task.label}
                </p>
                <div className="flex gap-1 items-center">
                    {task.isEntryPoint && <Badge>Entry point</Badge>}
                    <Badge className="gap-2 flex items-center text-xs">
                        <CoinsIcon size={16}/>
                        {task.credits}
                    </Badge>
                    {!task.isEntryPoint && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer text-red-400 hover:text-red-500"
                                onClick={() => deleteElements({
                                    nodes: [{id: nodeId}]
                                })}
                            >
                                <TrashIcon size={12}/>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer"
                                onClick={() => {
                                    const node = getNode(nodeId) as AppNode;
                                    const newX = node.position.x;
                                    const newY = node.position.y + node.measured?.height! + 20;
                                    const newNode = CreateFlowNode(
                                        node.data.type,
                                        {
                                            x: newX,
                                            y: newY,
                                        }
                                    );
                                    addNodes([newNode]);
                                }}
                            >
                                <CopyIcon size={12}/>
                            </Button>
                        </>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="drag-handle cursor-grab"
                    >
                        <GripVerticalIcon size={20}/>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default NodeHeader;
