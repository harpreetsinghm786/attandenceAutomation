import dotenv from "dotenv";
dotenv.config();
export class GreythrPage {
    page;
    context;
    // locators
    usernameInput = '#username';
    passwordInput = '#password';
    loginButton = 'button[type="submit"]';
    constructor(page, context) {
        this.page = page;
        this.context = context;
    }
    navigateToLoginpage = async () => {
        try {
            await this.page.goto("https://pipin.greythr.com/v3/portal/ess/home");
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForLoadState("networkidle");
            console.log("Navigated to greythr webpage successfully");
        }
        catch (error) {
            console.error("Error navigating to greythr webpage", error);
        }
    };
    loginToGreythr = async () => {
        try {
            console.log("Attempting to log in to greythr...", process.env.GREYTHR_USERNAME, process.env.GREYTHR_PASSWORD);
            await this.page.fill(this.usernameInput, process.env.GREYTHR_USERNAME || "");
            await this.page.fill(this.passwordInput, process.env.GREYTHR_PASSWORD || "");
            await this.page.click(this.loginButton);
            await this.page.waitForLoadState("domcontentloaded");
            await this.page.waitForLoadState("networkidle");
            console.log("Logged in to greythr successfully");
        }
        catch (error) {
            console.error("Error logging in to greythr", error);
        }
    };
    async toggleAttendance() {
        const attendanceButton = this.page
            .locator('.btn-container')
            .getByRole('button', { name: /Sign In|Sign Out/ });
        await attendanceButton.waitFor({ state: 'visible' });
        const action = (await attendanceButton.textContent())?.trim();
        console.log(`Current attendance state: ${action}`);
        await attendanceButton.click();
        return action;
    }
}
//# sourceMappingURL=greythr.page.js.map