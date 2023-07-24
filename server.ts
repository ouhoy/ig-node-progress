import puppeteer from 'puppeteer';
import * as path from "path";

import * as dotenv from 'dotenv';

dotenv.config()

import updateProgress from "./progress";

const currentProgress = `${updateProgress.progressBar.toString().replaceAll(",", " ")}  ${updateProgress.progressPercentage.toFixed(5)}`;

// const imgFolder = path.join(__dirname, 'img');
const url = "https://instagram.com";
const editProfilePage = `https://www.instagram.com/accounts/edit/`;

// Login Credentials
const emailInput: string = `#loginForm > div > div:nth-child(1) > div > label > input`
const passwordInput: string = `#loginForm > div > div:nth-child(2) > div > label > input`;
const loginButton: string = `#loginForm > div > div:nth-child(3) > button`;


(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url);

    console.log("Waiting...")
    await page.waitForSelector(emailInput, {timeout: 5_000});
    console.log("Rendered!")


    const currentTime = new Date();
    const creationDate = currentTime.toString().slice(0, 24)

    // await page.screenshot({path: `${imgFolder}/screenshot-${creationDate.replaceAll(":", "-")}.jpg`})

    console.log("Entering Email and Password...")
    await page.locator(emailInput).fill(process.env.USER_NAME);
    await page.locator(passwordInput).fill(process.env.PASSWORD);


    await page.locator(loginButton).click();
    console.log("Logging...")

    // await page.waitForSelector(`iframe`, {timeout: 30_000});
    page.setDefaultNavigationTimeout(0);
    await page.waitForNavigation()

    console.log("Switching Pages...")
    await page.goto(editProfilePage)

    // console.log("We there rn!")

    await page.locator("#pepBio").click();

    console.log("Bio is there")


    await page.evaluateHandle(() => {
        const bioText = (<HTMLInputElement>document.getElementById("pepBio"));
        bioText.value = `${bioText.value} \n`;

        return
    });

    await page.type('textarea[id]', `${currentProgress}%`, {delay: 20})
    await page.locator("form div[role='button']").click();

    await browser.close();
})();