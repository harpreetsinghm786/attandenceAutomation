import { GreythrPage } from "../pages/greythr.page";
import { BrowserManager } from "../helpers/browserManager";

export async function runAutomationJob (processId: string){
  const { context, page } = await BrowserManager.newContext();
  try {
    console.log(`Starting automation job with processId: ${processId}`);
    let greythrPage = new GreythrPage(page, context);

    await greythrPage.navigateToLoginpage();
    await greythrPage.loginToGreythr();
    await greythrPage.toggleAttendance();
    await context.close();
    await page.close();
    process.exit(1);

    console.log(`Automation job with processId: ${processId} completed successfully`);
  } catch (error) {
    console.error(`Error in automation job with processId: ${processId}`, error);
    await context.close();
    await page.close();
    process.exit(0);
  }
};