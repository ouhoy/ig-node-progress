import {Page} from "puppeteer";

enum selectAction {
    delete = "delete",
    copy = "copy",
    paste = "paste"
}

interface SelectAllOptions {
    action?: "delete" | "copy" | "paste"
}

export const selectAll = async (page: Page, options: SelectAllOptions) => {
    await page.keyboard.down('ControlLeft')
    await page.keyboard.press('KeyA')

    if (options.action == selectAction.delete) {
        await page.keyboard.up('ControlLeft');
        await page.keyboard.press('Backspace');
        return
    }
    if (options.action == selectAction.copy) {
        await page.keyboard.press('KeyC');
        await page.keyboard.up('ControlLeft');
        return
    }
    if (options.action == selectAction.paste) {
        await page.keyboard.press('KeyV');
        await page.keyboard.up('ControlLeft');
        return
    }

    await page.keyboard.up('ControlLeft');

}

