import * as dotenv from 'dotenv';
import puppeteer, {Page} from 'puppeteer';
import updateProgress from "./progress";
import selectors from "./model/elements";
import {URL, BIO_PAGE} from "./model/pages";

dotenv.config()

enum selectAction {
    delete = "delete",
    copy = "copy",
    paste = "paste"
}

interface SelectAllOptions {
    action?: "delete" | "copy" | "paste"
}

const logIn = async (page: Page, userName: string, password: string) => {

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

const selectAll = async (page: Page, options: SelectAllOptions) => {
    await page.keyboard.down('ControlLeft')
    await page.keyboard.press('KeyA')

    if (options.action == selectAction.delete) {
        await page.keyboard.up('ControlLeft');
        await page.keyboard.press('Backspace');
        return
    }
    if (options.action == selectAction.copy) {
        await page.keyboard.press('KeyC');
        await page.keyboard.up('ControlLeft');
        return
    }
    if (options.action == selectAction.paste) {
        await page.keyboard.press('KeyV');
        await page.keyboard.up('ControlLeft');
        return
    }

    await page.keyboard.up('ControlLeft');

}
const updateBio = async (page: Page, content: string) => {

    console.log(`Navigating to: ${BIO_PAGE}...`)
    await page.goto(BIO_PAGE)
    await page.waitForSelector(selectors.bioTextarea, {timeout: 0});
    await page.locator(selectors.bioTextarea).click();

    const bioElement = await page.$(selectors.bioTextarea)
    const bioValue: string = await (await bioElement.getProperty("value")).jsonValue() as string;

    console.log(`Typing ${content}...`)
    await selectAll(page, {action: "delete"})

    await page.type(selectors.bioTextarea, `${bioValue.slice(0, bioValue.length - content.length)}\n${content}`, {delay: 0})
    await page.locator(selectors.submitButton).click();

    console.log("Bio Updated!")
}


const openPage = async (): Promise<void> => {

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

    const {progressBarString, progressPercentage} = updateProgress()
    const currentProgress = `${progressBarString}  ${progressPercentage.toFixed(5)}%`;

    await logIn(page, process.env.USER_NAME, process.env.PASSWORD)
    await updateBio(page, currentProgress)

    console.log("Goodbye!")
    await browser.close();

};


openPage().then();

