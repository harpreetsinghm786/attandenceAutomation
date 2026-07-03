"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAutomationJob = runAutomationJob;
const greythr_page_1 = require("../pages/greythr.page");
const browserManager_1 = require("../helpers/browserManager");
async function runAutomationJob(processId) {
    const { context, page } = await browserManager_1.BrowserManager.newContext();
    try {
        console.log(`Starting automation job with processId: ${processId}`);
        let greythrPage = new greythr_page_1.GreythrPage(page, context);
        await greythrPage.navigateToLoginpage();
        await greythrPage.loginToGreythr();
        await greythrPage.toggleAttendance();
        await context.close();
        await page.close();
        process.exit(1);
        console.log(`Automation job with processId: ${processId} completed successfully`);
    }
    catch (error) {
        console.error(`Error in automation job with processId: ${processId}`, error);
        await context.close();
        await page.close();
        process.exit(0);
    }
}
;
//# sourceMappingURL=automation.runner.js.map