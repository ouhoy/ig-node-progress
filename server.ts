import * as dotenv from 'dotenv';
import puppeteer, {KnownDevices} from 'puppeteer';
import {URL} from "./model/pages";
import {editBio} from "./view/editPageContent"
import updateProgress from "./controller/progress";
import {logIn} from "./controller/auth";

dotenv.config()

const iPhone = KnownDevices['iPhone 12 Pro Max'];

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

    // This should go to Views folder
    const {progressBarString, progressPercentage} = updateProgress()
    const currentProgress = `${progressBarString}  ${progressPercentage.toFixed(5)}%`;

    await logIn(page, process.env.USER_NAME, process.env.PASSWORD)
    await editBio(page, currentProgress)
    await page.emulate(iPhone);

    console.log("Goodbye!")
    await browser.close();

};


openPage().then();

