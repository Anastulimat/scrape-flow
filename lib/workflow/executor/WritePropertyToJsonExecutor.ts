import {ExecutionEnvironment} from "@/types/executor";
import {WritePropertyToJsonTask} from "@/lib/workflow/task/WritePropertyToJson";

// ----------------------------------------------------------------------

export async function WritePropertyToJsonExecutor(environment: ExecutionEnvironment<typeof WritePropertyToJsonTask>): Promise<boolean> {
    try {
        const JsonData = environment.getInput("JSON");
        if (!JsonData) {
            environment.log.error("Input -> JSON not defined");
        }

        const propertyName = environment.getInput("Property name");
        if (!propertyName) {
            environment.log.error("Input -> Property name not defined");
        }

        const propertyValue = environment.getInput("Property value");
        if (!propertyValue) {
            environment.log.error("Input -> Property value not defined");
        }


        const json = JSON.parse(JsonData);
        json[propertyName] = propertyValue;

        environment.setOutput("Updated JSON", JSON.stringify(json));

        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
