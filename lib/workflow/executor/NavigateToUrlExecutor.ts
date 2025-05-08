import {ExecutionEnvironment} from "@/types/executor";
import {NavigateToUrlTask} from "@/lib/workflow/task/NavigateToUrl";

// ----------------------------------------------------------------------

export async function NavigateToUrlExecutor(environment: ExecutionEnvironment<typeof NavigateToUrlTask>): Promise<boolean> {
    try {
        const url = environment.getInput("URL");
        if (!url) {
            environment.log.error("Input -> url not defined");
        }

        await environment.getPage()!.goto(url);
        environment.log.info(`Navigated to ${url}`);

        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
