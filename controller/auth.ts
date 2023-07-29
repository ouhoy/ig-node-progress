import {Page} from "puppeteer";
import selectors from "../model/elements";

export const logIn = async (page: Page, userName: string, password: string) => {

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