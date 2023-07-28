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

    console.log(`Navigating to: ${BIO_PAGE}...`)
    await page.goto(BIO_PAGE)
    await page.waitForSelector(selectors.bioTextarea, {timeout: 0});
    await page.locator(selectors.bioTextarea).click();

    const bioElement = await page.$(selectors.bioTextarea)

    const bioValue: string = await (await bioElement.getProperty("value")).jsonValue() as string;


    console.log(`Typing ${progress}%...`)
    await page.keyboard.down('ControlLeft')
    await page.keyboard.press('KeyA')
    await page.keyboard.up('ControlLeft')
    await page.keyboard.press('Backspace');

    // TODO: This should be validated in case there is no bio!

    await page.type(selectors.bioTextarea, `${bioValue.slice(0, bioValue.length - 30)}\n${progress}%`, {delay: 0})
    await page.locator(selectors.submitButton).click();

    console.log("Bio Updated!")
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

    console.log("Goodbye!")
    // await browser.close();

};


openPage().then();

