import * as path from "path";
import * as fs from "fs"
import {Page} from "puppeteer";


const takeScreenshot = async (folder: string, page: Page) => {
    const folderPath: string = path.join(__dirname, folder);

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    await page.screenshot({path: folderPath})
}


export default takeScreenshot;