import {LaunchBrowserTask} from "@/lib/workflow/task/LaunchBrowser";
import {PageToHtmlTask} from "@/lib/workflow/task/PageToHtml";
import {ExtractTextFromElementTask} from "@/lib/workflow/task/ExtractTextFromElement";
import {TaskType} from "@/types/task";
import {WorkflowTask} from "@/types/workflow";
import {FillInputTask} from "@/lib/workflow/task/FillInput";
import {ClickElementTask} from "@/lib/workflow/task/ClickElement";
import {WaitForElementTask} from "@/lib/workflow/task/WaitForElement";
import {DeliverViaWebhookTask} from "@/lib/workflow/task/DeliverViaWebhook";
import {ExtractDataWithAITask} from "@/lib/workflow/task/ExtractDataWithAI";
import {ReadPropertyFromJsonTask} from "@/lib/workflow/task/ReadPropertyFromJson";
import {WritePropertyToJsonTask} from "@/lib/workflow/task/WritePropertyToJson";
import {NavigateToUrlTask} from "@/lib/workflow/task/NavigateToUrl";
import {ScrollToElementTask} from "@/lib/workflow/task/ScrollToElement";

// ----------------------------------------------------------------------

type Registry = {
    [key in TaskType]: WorkflowTask & { type: key };
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
    FILL_INPUT: FillInputTask,
    CLICK_ELEMENT: ClickElementTask,
    WAIT_FOR_ELEMENT: WaitForElementTask,
    DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
    EXTRACT_DATA_WITH_AI: ExtractDataWithAITask,
    READ_PROPERTY_FROM_JSON: ReadPropertyFromJsonTask,
    WRITE_PROPERTY_TO_JSON: WritePropertyToJsonTask,
    NAVIGATE_TO_URL: NavigateToUrlTask,
    SCROLL_TO_ELEMENT: ScrollToElementTask
};

