import puppeteer from 'puppeteer';
import * as path from "path";


const imgFolder = path.join(__dirname, 'img');


const url = "https://instagram.com";

const emailInput = `#loginForm > div > div:nth-child(1) > div > label > input`;

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(url);

    console.log("Waiting...")
    await page.waitForSelector(emailInput, {timeout: 5_000});
    console.log("Rendered!")


    const currentTime = new Date();
    const creationDate = currentTime.toString().slice(0, 24)
    await page.screenshot({path: `${imgFolder}/screenshot-${creationDate.replaceAll(":", "-")}.jpg`})

    await browser.close();
})();