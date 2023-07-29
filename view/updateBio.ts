import {Page} from "puppeteer";
import {BIO_PAGE} from "../model/pages";
import selectors from "../model/elements";
import {selectAll} from "../controller/pageMethods";

export const updateBio = async (page: Page, content: string) => {

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