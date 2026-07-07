import { BrowserContext, Page } from "playwright-core";
import dotenv from "dotenv";
dotenv.config();

export class GreythrPage {
   private page: Page;
   private context: BrowserContext;

   // locators
   private usernameInput = '#username';
   private passwordInput = '#password';
   private loginButton = 'button[type="submit"]';

   constructor(page: Page, context: BrowserContext) {
      this.page = page;
      this.context = context;
   }

   navigateToLoginpage = async () => {
      try {
         await this.page.goto("https://pipin.greythr.com/v3/portal/ess/home");
         await this.page.waitForLoadState("domcontentloaded");
         await this.page.waitForLoadState("networkidle");
         console.log("Navigated to greythr webpage successfully");
      } catch (error) {
         console.error("Error navigating to greythr webpage", error);
      }
   }

   loginToGreythr = async () => {
      try {
         await this.page.fill(this.usernameInput, process.env.GREYTHR_USERNAME || "");
         await this.page.fill(this.passwordInput, process.env.GREYTHR_PASSWORD || "");
         await this.page.click(this.loginButton);
         await this.page.waitForLoadState("domcontentloaded");
         await this.page.waitForLoadState("networkidle");
         console.log("Logged in to greythr successfully");
      } catch (error) {
         console.error("Error logging in to greythr", error);
      }
   }

   async toggleAttendance() {
      try{
         const attendanceButton = this.page
            .locator('.btn-container')
            .getByRole('button', { name: /Sign In|Sign Out/ });
         await attendanceButton.waitFor({ state: 'visible' });
         const action = (await attendanceButton.textContent())?.trim();
         console.log(`Current attendance state: ${action}`);
         await attendanceButton.click();
         return action;
      } catch (error) {
         await this.page.screenshot({ path: '/tmp/debug.png', fullPage: true });
         console.log('Page content check:', await this.page.content());
         console.error("Error toggling attendance", error);
      }
   }
}