import {ExecutionEnvironment} from "@/types/executor";
import {ReadPropertyFromJsonTask} from "@/lib/workflow/task/ReadPropertyFromJson";

// ----------------------------------------------------------------------

export async function ReadPropertyFromJsonExecutor(environment: ExecutionEnvironment<typeof ReadPropertyFromJsonTask>): Promise<boolean> {
    try {
        const JsonData = environment.getInput("JSON");
        if (!JsonData) {
            environment.log.error("Input -> JSON not defined");
        }

        const propertyName = environment.getInput("Property name");
        if (!propertyName) {
            environment.log.error("Input -> Property name not defined");
        }


        const json = JSON.parse(JsonData);
        const propertyValue = json[propertyName];
        if (propertyValue === undefined) {
            environment.log.error(`Property "${propertyName}" not found`);
            return false;
        }

        environment.setOutput("Property value", propertyValue);

        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
