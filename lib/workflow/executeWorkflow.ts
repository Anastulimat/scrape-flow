import "server-only";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {ExecutionPhaseStatus, WorkflowExecutionStatus} from "@/types/workflow";
import {ExecutionPhase} from "@prisma/client";
import {AppNode} from "@/types/appNode";
import {TaskRegistry} from "@/lib/workflow/task/Registry";
import {ExecutorRegistry} from "@/lib/workflow/executor/registry";
import {Environment, ExecutionEnvironment} from "@/types/executor";
import {TaskParamType} from "@/types/task";
import {Browser, Page} from "puppeteer";
import {Edge} from "@xyflow/react";
import {LogCollector} from "@/types/log";
import {createLogCollector} from "@/lib/log";

// ----------------------------------------------------------------------

export async function ExecuteWorkflow(executionId: string, nextRunAt?: Date) {
    const execution = await prisma.workflowExecution.findUnique({
        where: {
            id: executionId
        },
        include: {
            workflow: true,
            phases: true
        }
    });

    if (!execution) {
        throw new Error("Execution not found");
    }

    const edges = JSON.parse(execution.definition).edges as Edge[];

    // set up the execution env
    const environment: Environment = {phases: {}};

    // initialize workflow execution
    await initializeWorkflowExecution(executionId, execution.workflowId, nextRunAt)

    // initialize phases status
    await initializePhaseStatuses(execution);

    let creditsConsumed = 0;
    let executionFailed = false;
    for (const phase of execution.phases) {
        // execute phase
        const phaseExecution = await executeWorkflowPhase(phase, environment, edges, execution.userId);
        creditsConsumed += phaseExecution.creditsConsumed;
        if (!phaseExecution.success) {
            executionFailed = true;
            break;
        }
    }

    // finalize execution
    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);

    // clean up env
    await cleanUpEnvironment(environment);

    revalidatePath("/workflow/runs");
}

async function initializeWorkflowExecution(executionId: string, workflowId: string, nextRunAt?: Date) {
    await prisma.workflowExecution.update({
        where: {
            id: executionId
        },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING,
        }
    });

    await prisma.workflow.update({
        where: {
            id: workflowId
        },
        data: {
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId,
            ...(nextRunAt && {nextRunAt}),
        }
    })
}

async function initializePhaseStatuses(execution: any) {
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id),
            }
        },
        data: {
            status: ExecutionPhaseStatus.PENDING,
        }
    });
}

async function finalizeWorkflowExecution(executionId: string, workflowId: string, executionFailed: boolean, creditsConsumed: number) {
    const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED;

    await prisma.workflowExecution.update({
        where: {
            id: executionId
        },
        data: {
            status: finalStatus,
            completeAt: new Date(),
            creditsConsumed
        }
    });

    await prisma.workflow.update({
        where: {
            id: workflowId,
            lastRunId: executionId,
        },
        data: {
            lastRunStatus: finalStatus,
        }
    }).catch(err => {
        // Ignore the error
        // this means that we have triggered other runs for this workflow while an execution was running

        // We are using an empty catch block because we don't want the error to propagate to other functions
    });
}

async function executeWorkflowPhase(
    phase: ExecutionPhase,
    environment: Environment,
    edges: Edge[],
    userId: string,
) {
    const logCollector = createLogCollector();
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode;
    setUpEnvironmentForPhase(node, environment, edges);

    // Update phase status
    await prisma.executionPhase.update({
        where: {
            id: phase.id
        },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt,
            inputs: JSON.stringify(environment.phases[node.id].inputs),
        }
    });

    const creditsRequired = TaskRegistry[node.data.type].credits;

    // decrement use balance (with required credits)
    let success = await decrementCredits(userId, creditsRequired, logCollector);
    const creditsConsumed = success ? creditsRequired : 0;
    if (success) {
        // We can execute the phase if the credits are enough
        success = await executePhase(phase, node, environment, logCollector);
    }

    const outputs = environment.phases[node.id].outputs;
    await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed);
    return {success, creditsConsumed};
}

async function finalizePhase(phaseId: string, success: boolean, outputs: any, logCollector: LogCollector, creditsConsumed: number) {
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

    await prisma.executionPhase.update({
        where: {
            id: phaseId
        },
        data: {
            status: finalStatus,
            completeAt: new Date(),
            outputs: JSON.stringify(outputs),
            creditsConsumed,
            logs: {
                createMany: {
                    data: logCollector.getAll().map((log) => ({
                        message: log.message,
                        timestamp: log.timestamp,
                        logLevel: log.level
                    }))
                }
            }

        }
    })
}

async function executePhase(phase: ExecutionPhase, node: AppNode, environment: Environment, logCollector: LogCollector): Promise<boolean> {
    const runFn = ExecutorRegistry[node.data.type];
    if (!runFn) {
        logCollector.error(`No executor found for the type ${node.data.type}`);
        // No executor found for the task type
        return false;
    }
    const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector);
    return await runFn(executionEnvironment);
}

function setUpEnvironmentForPhase(node: AppNode, environment: Environment, edges: Edge[]) {
    environment.phases[node.id] = {inputs: {}, outputs: {}};
    const inputs = TaskRegistry[node.data.type].inputs;

    for (const input of inputs) {
        if (input.type === TaskParamType.BROWSER_INSTANCE) {
            continue;
        }
        const inputValue = node.data.inputs[input.name];
        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }

        // Get input value from outputs in the environment
        const connectedEdges = edges.find((edge) => edge.target === node.id && edge.targetHandle === input.name);

        if (!connectedEdges) {
            console.error("Missing edge for input", input.name, "in node", node.id);
            continue;
        }

        const outputValue = environment.phases[connectedEdges.source].outputs[connectedEdges.sourceHandle!];
        environment.phases[node.id].inputs[input.name] = outputValue;
    }
}

function createExecutionEnvironment(node: AppNode, environment: Environment, logCollector: LogCollector): ExecutionEnvironment<any> {
    return {
        getInput: (name: string) => environment.phases[node.id]?.inputs[name],
        setOutput: (name: string, value: string) => {
            environment.phases[node.id].outputs[name] = value;
        },

        getBrowser: () => environment.browser,
        setBrowser: (browser: Browser) => environment.browser = browser,

        getPage: () => environment.page,
        setPage: (page: Page) => environment.page = page,

        log: logCollector
    }
}

async function cleanUpEnvironment(environment: Environment) {
    if (environment.browser) {
        await environment.browser
            .close()
            .catch(err => console.error("Cannot close browser, reason:", err));
    }
}

async function decrementCredits(userId: string, amount: number, logCollector: LogCollector) {
    try {
        await prisma.userBalance.update({
            where: {
                userId, credits: {gte: amount}
            },
            data: {
                credits: {decrement: amount}
            }
        });
        return true;
    } catch (error) {
        logCollector.error("Insufficient balance");
        return false;
    }
}
