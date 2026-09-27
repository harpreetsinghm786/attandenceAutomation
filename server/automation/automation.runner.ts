import { GreythrPage } from "../pages/greythr.page";
import { BrowserManager } from "../helpers/browserManager";
import { sendTelegramNotification } from "../helpers/notification";

export async function runAutomationJob (processId: string){
  const { context, page } = await BrowserManager.newContext();
  try {
    console.log(`Starting automation job with processId: ${processId}`);
    let greythrPage = new GreythrPage(page, context);
    
    await greythrPage.navigateToLoginpage();
    await greythrPage.loginToGreythr();
    const isSignedIn = await greythrPage.toggleAttendance();
    await sendTelegramNotification(`✅ Attendance marked successfully \nAction: ${isSignedIn?"Logged In":"Logged Out"}`);
    console.log(`Automation job with processId: ${processId} completed successfully`);
  } catch (error) {
    console.error(`Error in automation job with processId: ${processId}`, error);
    const errorMessage =
    error instanceof Error ? error.message : String(error);

    console.error(
      `Error in automation job with processId: ${processId}`,
      error
    );

    try {
      await sendTelegramNotification(
        `❌ Attendance marking failed\nError: ${errorMessage}`
      );
    } catch (telegramError) {
      console.error("Failed to send Telegram notification:", telegramError);
    }

    throw error;
  }finally{
    await context.close();
  }
};