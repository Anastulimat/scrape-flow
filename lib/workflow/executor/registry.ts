import {LaunchBrowserExecutor} from "@/lib/workflow/executor/LaunchBrowserExecutor";
import {PageToHtmlExecutor} from "@/lib/workflow/executor/PageToHtmlExecutor";
import {ExtractTextFromElementExecutor} from "@/lib/workflow/executor/ExtractTextFromElementExecutor";
import {TaskType} from "@/types/task";
import {ExecutionEnvironment} from "@/types/executor";
import {WorkflowTask} from "@/types/workflow";
import {FillInputExecutor} from "@/lib/workflow/executor/FillInputExecutor";
import {ClickElementExecutor} from "@/lib/workflow/executor/ClickElementExecutor";
import {WaitForElementExecutor} from "@/lib/workflow/executor/WaitForElementExecutor";
import {DeliverViaWebhookExecutor} from "@/lib/workflow/executor/DeliverViaWebhookExecutor";
import {ExtractDataWithAiExecutor} from "@/lib/workflow/executor/ExtractDataWithAiExecutor";
import {ReadPropertyFromJsonExecutor} from "@/lib/workflow/executor/ReadPropertyFromJsonExecutor";
import {WritePropertyToJsonExecutor} from "@/lib/workflow/executor/WritePropertyToJsonExecutor";
import {NavigateToUrlExecutor} from "@/lib/workflow/executor/NavigateToUrlExecutor";
import {ScrollToElementExecutor} from "@/lib/workflow/executor/ScrollToElementExecutor";

// ----------------------------------------------------------------------

type ExecutorFn<T extends WorkflowTask> = (environment: ExecutionEnvironment<T>) => Promise<boolean>;

type RegistryType = {
    [key in TaskType]: ExecutorFn<WorkflowTask & { type: key }>;
}

export const ExecutorRegistry: RegistryType = {
    LAUNCH_BROWSER: LaunchBrowserExecutor,
    PAGE_TO_HTML: PageToHtmlExecutor,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecutor,
    FILL_INPUT: FillInputExecutor,
    CLICK_ELEMENT: ClickElementExecutor,
    WAIT_FOR_ELEMENT: WaitForElementExecutor,
    DELIVER_VIA_WEBHOOK: DeliverViaWebhookExecutor,
    EXTRACT_DATA_WITH_AI: ExtractDataWithAiExecutor,
    READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonExecutor,
    WRITE_PROPERTY_TO_JSON: WritePropertyToJsonExecutor,
    NAVIGATE_TO_URL: NavigateToUrlExecutor,
    SCROLL_TO_ELEMENT: ScrollToElementExecutor
};
