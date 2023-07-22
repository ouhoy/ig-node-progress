import puppeteer from 'puppeteer';
import * as path from "path";
import * as fs from "fs";

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


    await page.screenshot({path: `./img/screenshot.jpg`})


    await browser.close();
})();