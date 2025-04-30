import {Workflow} from "@prisma/client";
import {
    addEdge,
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    Edge, getOutgoers,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import NodeComponent from "@/app/workflow/_components/nodes/NodeComponent";
import React, {useCallback, useEffect} from "react";
import {CreateFlowNode} from "@/lib/workflow/createFlowNode";
import {TaskType} from "@/types/task";
import {AppNode} from "@/types/appNode";
import DeletableEdge from "@/app/workflow/_components/edges/DeletableEdge";
import {TaskRegistry} from "@/lib/workflow/task/Registry";
import {toast} from "sonner";

// ----------------------------------------------------------------------

const nodeTypes = {
    FlowScrapeNode: NodeComponent,
};

const edgeTypes = {
    default: DeletableEdge,
}

const snapGrid: [number, number] = [10, 10];
const fitViewOptions = {
    padding: 1
};
// ----------------------------------------------------------------------

const FlowEditor = ({workflow}: { workflow: Workflow }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const {setViewport, screenToFlowPosition, updateNodeData} = useReactFlow();


    useEffect(() => {
        try {
            const flow = JSON.parse(workflow.definition);
            if (!flow) return;

            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);

            if (!flow.viewport) return;

            const {x = 0, y = 0, zoom = 1} = flow.viewport;
            setViewport({x, y, zoom});


        } catch (error) {
            console.error(error);
        }
    }, [workflow.definition, setEdges, setNodes, setViewport]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        // @ts-ignore
        event.dataTransfer.dropEffect = "move";
    }, []);

    const onDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        // @ts-ignore
        const taskType = event.dataTransfer.getData("application/reactflow");
        if (typeof taskType === undefined || !taskType) return;

        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY
        });

        const newNode = CreateFlowNode(taskType as TaskType, position);
        setNodes((nodes) => nodes.concat(newNode));
    }, [setNodes, screenToFlowPosition]);

    const onConnect = useCallback((connection: Connection) => {
        setEdges((edges) => addEdge({...connection, animated: true}, edges));

        if (!connection.targetHandle) return;

        // Remove input value if is present on the connection
        const node = nodes.find(node => node.id === connection.target);
        if (!node) return;

        const nodeInputs = node.data.inputs;
        updateNodeData(node.id, {
            inputs: {
                ...nodeInputs,
                [connection.targetHandle]: "",
            },
        });
    }, [nodes, setEdges, updateNodeData]);

    const isValidConnection = useCallback((connection: Edge | Connection) => {
        // No self-connections allowed
        if (connection.source === connection.target) return false;

        // Same taskParam type connection
        const sourceNode = nodes.find(node => node.id === connection.source);
        const targetNode = nodes.find(node => node.id === connection.target);
        if (!sourceNode || !targetNode) {
            toast.error("Invalid connection: source or target node not found", {
                id: "invalid-connection",
            });
            console.error("Invalid connection: source or target node not found");
            return false;
        }

        const sourceTask = TaskRegistry[sourceNode.data.type];
        const tagetTask = TaskRegistry[targetNode.data.type];

        const output = sourceTask.outputs.find((output) => output.name === connection.sourceHandle);
        const input = tagetTask.inputs.find((input) => input.name === connection.targetHandle);

        if (input?.type !== output?.type) {
            toast.error("Invalid connection: input and output types are not the same", {
                id: "invalid-connection",
            });
            console.error("Invalid connection: input and output types are not the same");
            return false;
        }

        const hasCycle = (node: AppNode, visited = new Set()) => {
            if(visited.has(node.id)) return false;
            visited.add(node.id);

            for(const outgoer of getOutgoers(node, nodes, edges)) {
                if(outgoer.id === connection.source) return true;
                if(hasCycle(outgoer, visited)) return true;
            }
        };

        const detectedCycle = hasCycle(targetNode);

        return !detectedCycle;


    }, [edges, nodes]);

    return (
        <main className="h-full w-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                snapToGrid
                snapGrid={snapGrid}
                fitView
                fitViewOptions={fitViewOptions}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
            >
                <Controls position="top-left" fitViewOptions={fitViewOptions}/>
                <Background variant={BackgroundVariant.Dots} gap={12} size={1}/>
            </ReactFlow>
        </main>
    );
};

export default FlowEditor;
