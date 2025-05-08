import puppeteer from "puppeteer";
import {ExecutionEnvironment} from "@/types/executor";
import {LaunchBrowserTask} from "@/lib/workflow/task/LaunchBrowser";

// ----------------------------------------------------------------------

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput("Website URL");
        const browser = await puppeteer.launch({
            headless: false,
            args: ["--no-sandbox"]
        });
        environment.setBrowser(browser);
        environment.log.info("Browser started successfully");

        const page = await browser.newPage();
        await page.goto(websiteUrl);
        environment.setPage(page);
        environment.log.info(`Navigated to ${websiteUrl}`);

        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
