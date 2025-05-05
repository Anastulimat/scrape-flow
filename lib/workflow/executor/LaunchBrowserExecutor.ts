import puppeteer from "puppeteer";
import {ExecutionEnvironment} from "@/types/executor";
import {LaunchBrowserTask} from "@/lib/workflow/task/LaunchBrowser";

// ----------------------------------------------------------------------
export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput("Website URL");
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"]
        });
        environment.setBrowser(browser);

        const page = await browser.newPage();
        await page.goto(websiteUrl);
        environment.setPage(page);

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}