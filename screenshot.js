"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const takeScreenshot = async (folder, page) => {
    const folderPath = path.join(__dirname, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
    await page.screenshot({ path: folderPath });
};
exports.default = takeScreenshot;
//# sourceMappingURL=screenshot.js.map