"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAutomationJob = runAutomationJob;
const greythr_page_1 = require("../pages/greythr.page");
const browserManager_1 = require("../helpers/browserManager");
const notification_1 = require("../helpers/notification");
async function runAutomationJob(processId) {
    const { context, page } = await browserManager_1.BrowserManager.newContext();
    try {
        console.log(`Starting automation job with processId: ${processId}`);
        let greythrPage = new greythr_page_1.GreythrPage(page, context);
        await greythrPage.navigateToLoginpage();
        await greythrPage.loginToGreythr();
        const isSignedIn = await greythrPage.toggleAttendance();
        await (0, notification_1.sendTelegramNotification)(`✅ Attendance marked successfully \nAction: ${isSignedIn ? "Logged In" : "Logged Out"}`);
        console.log(`Automation job with processId: ${processId} completed successfully`);
    }
    catch (error) {
        console.error(`Error in automation job with processId: ${processId}`, error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error in automation job with processId: ${processId}`, error);
        try {
            await (0, notification_1.sendTelegramNotification)(`❌ Attendance marking failed\nError: ${errorMessage}`);
        }
        catch (telegramError) {
            console.error("Failed to send Telegram notification:", telegramError);
        }
        throw error;
    }
    finally {
        await context.close();
    }
}
;
//# sourceMappingURL=automation.runner.js.map