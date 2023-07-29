import * as dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import updateProgress from "./progress";
import {logIn} from "./controller/auth";
import {URL} from "./model/pages";
import {updateBio} from "./view/updateBio"

dotenv.config()


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

