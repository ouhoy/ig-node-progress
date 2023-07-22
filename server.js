"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
const path = require("path");
const imgFolder = path.join(__dirname, 'img');
const url = "https://instagram.com";
const emailInput = `#loginForm > div > div:nth-child(1) > div > label > input`;
(async () => {
    const browser = await puppeteer_1.default.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    console.log("Waiting...");
    await page.waitForSelector(emailInput, { timeout: 5000 });
    console.log("Rendered!");
    await page.screenshot({ path: `./img/screenshot.jpg` });
    await browser.close();
})();
//# sourceMappingURL=server.js.map