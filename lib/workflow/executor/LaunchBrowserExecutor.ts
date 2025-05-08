import puppeteer from "puppeteer";
import {ExecutionEnvironment} from "@/types/executor";
import {LaunchBrowserTask} from "@/lib/workflow/task/LaunchBrowser";
//import {exec} from "child_process";
//import {waitFor} from "@/lib/helper/waitFor";

// ----------------------------------------------------------------------
//
// ----------------------------------------------------------------------
/*

const chromeExecutable = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const openDevtools = async (page:any, client: any) => {
    // get current frameId
    const frameId = page.mainFrame()._id;
    // get URL for devtools from scraping browser
    const { url: inspectUrl } = await client.send('Page.inspect', { frameId });
    // open devtools URL in local chrome
    exec(`"${chromeExecutable}" "${inspectUrl}"`, error => {
        if (error)
            throw new Error('Unable to open devtools: ' + error);
    });
    // wait for devtools ui to load
    await waitFor(5000);
};
*/

export async function LaunchBrowserExecutor(environment: ExecutionEnvironment<typeof LaunchBrowserTask>): Promise<boolean> {
    try {
        const websiteUrl = environment.getInput("Website URL");

        // const browser = await puppeteer.connect({
        //     browserWSEndpoint: BROWSER_WS
        // });

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
            ],
        });

        environment.log.info("Browser started successfully");
        environment.setBrowser(browser);
        const page = await browser.newPage();

        // const client = await page.createCDPSession();
        // await openDevtools(page, client);

        await page.goto(websiteUrl);
        environment.setPage(page);
        environment.log.info(`Navigated to ${websiteUrl}`);


        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
