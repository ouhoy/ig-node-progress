import * as dotenv from 'dotenv';
import puppeteer, {Page} from 'puppeteer';
import updateProgress from "./progress";
import selectors from "./model/elements";
import {URL, BIO_PAGE} from "./model/pages";

dotenv.config()


const logIn = async (userName: string, password: string, page: Page) => {

    await page.waitForSelector(selectors.emailInput, {timeout: 0});
    console.log("Entering Email...")
    await page.locator(selectors.emailInput).fill(userName);
    console.log("Entering Password...")
    await page.locator(selectors.passwordInput).fill(password);
    console.log("Logging...")
    await page.locator(selectors.loginButton).click();

    //TODO: Check for page refresh/reload to indicate success login
}


const updateBio = async (): Promise<void> => {
    const {progressBar, progressPercentage} = updateProgress()

    const currentProgress = `${progressBar.toString().replaceAll(",", " ")}  ${progressPercentage.toFixed(5)}`;

    const browser = await puppeteer.launch({
        headless: false,
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath:
            process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
    });
    const page = await browser.newPage();
    await page.goto(URL);

    console.log(currentProgress)
    await logIn(process.env.USER_NAME, process.env.PASSWORD, page)


    page.setDefaultNavigationTimeout(0);
    await page.waitForNavigation()

    console.log("Switching Pages...")
    await page.goto(BIO_PAGE)

    console.log("At Edit page...")
    console.log("Waiting for selector...")


    await page.waitForSelector(`#pepBio`, {timeout: 0});
    await page.locator("#pepBio").click();

    console.log("Bio is there")


    await page.evaluateHandle(() => {

        // TODO: This should be validated in case there is no bio!
        const bioText = (<HTMLInputElement>document.getElementById("pepBio"));
        bioText.value = `${bioText.value.slice(0, bioText.value.length - 30)}`;

        return
    });

    await page.type('textarea[id]', `${currentProgress}%`, {delay: 20})
    await page.locator("form div[role='button']").click();

    await browser.close();

};


updateBio().then();

