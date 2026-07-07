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
        await this.page.waitForSelector(this.usernameInput, { timeout: 30000 });
        console.log("Navigated to greythr webpage successfully");
    } catch (error) {
        console.error("Error navigating to greythr webpage", error);
        throw error;
    }
}

loginToGreythr = async () => {
    try {
         console.log('Filling username...');
        await this.page.fill(this.usernameInput, process.env.GREYTHR_USERNAME || "");
           console.log('Username filled, filling password...');
        await this.page.fill(this.passwordInput, process.env.GREYTHR_PASSWORD || "");
           console.log('clicked on the login');
        await this.page.click(this.loginButton);
        console.log("Logged in to greythr successfully");
    } catch (error) {
        console.error("Error logging in to greythr", error);
        throw error;
    }
}

   async toggleAttendance() {
    console.log('Looking for attendance button...');
    console.log('Current URL:', this.page.url());
    
    const attendanceButton = this.page
        .locator('.btn-container')
        .getByRole('button', { name: /Sign In|Sign Out/ });
    
    try {
        await attendanceButton.waitFor({ state: 'visible', timeout: 15000 });
    } catch (err) {
        console.error('Button never became visible. Current URL:', this.page.url());
        await this.page.screenshot({ path: '/tmp/debug-timeout.png', fullPage: true });
        const html = await this.page.content();
        console.log('Page HTML snippet:', html.slice(0, 2000));
        throw err;
    }
    
    const action = (await attendanceButton.textContent())?.trim();
    console.log(`Current attendance state: ${action}`);
    await attendanceButton.click();
    return action;
}
}