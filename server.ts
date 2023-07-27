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

    await page.waitForNavigation({timeout: 0})
    console.log("Logged In")
}

const updateBio = async (progress: string, page: Page) => {

    await page.goto(BIO_PAGE)
    await page.waitForSelector(selectors.bioTextarea, {timeout: 0});
    await page.locator(selectors.bioTextarea).click();


    await page.evaluateHandle(() => {

        // TODO: This should be validated in case there is no bio!
        const bioText = (<HTMLInputElement>document.getElementById(selectors.bioTextarea));
        bioText.value = `${bioText.value.slice(0, bioText.value.length - 30)}`;

        return
    });

    await page.type(selectors.bioTextarea, `${progress}%`, {delay: 20})
    await page.locator(selectors.submitButton).click();

}

const openPage = async (): Promise<void> => {
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

    await logIn(process.env.USER_NAME, process.env.PASSWORD, page)
    await updateBio(currentProgress, page)

    await browser.close();

};



openPage().then();

