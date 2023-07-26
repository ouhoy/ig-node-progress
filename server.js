"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = require("puppeteer");
// import * as path from "path";
const dotenv = require("dotenv");
dotenv.config();
const progress_1 = require("./progress");
// const imgFolder = path.join(__dirname, 'img');
const url = "https://instagram.com";
const editProfilePage = `https://www.instagram.com/accounts/edit/`;
// Login Credentials
const emailInput = `#loginForm > div > div:nth-child(1) > div > label > input`;
const passwordInput = `#loginForm > div > div:nth-child(2) > div > label > input`;
const loginButton = `#loginForm > div > div:nth-child(3) > button`;
const updateBio = async () => {
    const { progressBar, progressPercentage } = (0, progress_1.default)();
    const currentProgress = `${progressBar.toString().replaceAll(",", " ")}  ${progressPercentage.toFixed(5)}`;
    const browser = await puppeteer_1.default.launch({
        headless: false,
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
        ],
        executablePath: process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer_1.default.executablePath(),
    });
    const page = await browser.newPage();
    await page.goto(url);
    console.log("Waiting...");
    await page.waitForSelector(emailInput, { timeout: 0 });
    console.log("Rendered!");
    // const currentTime = new Date();
    // const creationDate = currentTime.toString().slice(0, 24)
    // await page.screenshot({path: `${imgFolder}/screenshot-${creationDate.replaceAll(":", "-")}.jpg`})
    console.log("Entering Email and Password...");
    await page.locator(emailInput).fill(process.env.USER_NAME);
    await page.locator(passwordInput).fill(process.env.PASSWORD);
    await page.locator(loginButton).click();
    console.log("Logging...");
    page.setDefaultNavigationTimeout(0);
    await page.waitForNavigation();
    console.log("Switching Pages...");
    await page.goto(editProfilePage);
    console.log("At Edit page...");
    console.log("Waiting for selector...");
    await page.waitForSelector(`#pepBio`, { timeout: 0 });
    await page.locator("#pepBio").click();
    console.log("Bio is there");
    await page.evaluateHandle(() => {
        // TODO: This should be validated in case there is no bio!
        const bioText = document.getElementById("pepBio");
        bioText.value = `${bioText.value.slice(0, bioText.value.length - 30)}`;
        return;
    });
    await page.type('textarea[id]', `${currentProgress}%`, { delay: 20 });
    await page.locator("form div[role='button']").click();
    await browser.close();
};
setInterval(function () {
    updateBio().then();
}, 1000 * 60);
//# sourceMappingURL=server.js.map