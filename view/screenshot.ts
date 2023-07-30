import * as path from "path";
import * as fs from "fs"
import {Page} from "puppeteer";


const takeScreenshot = async (page: Page, ...folder: string[]) => {
    const folderPath: string = path.join(__dirname, ...folder);

    const currentTime = new Date();
    const creationDate = currentTime.toString().slice(0, 24)

    if (!fs.existsSync(folderPath)) {

        fs.mkdirSync(folderPath, {recursive: true});

    }

    await page.screenshot({path: `${folderPath}/${creationDate.replaceAll(":", "-")}.jpg`})
}


export default takeScreenshot;