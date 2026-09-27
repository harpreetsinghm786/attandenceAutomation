"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreythrPage = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class GreythrPage {
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
            await this.page.goto("https://pipin.greythr.com");
            await this.page.waitForSelector(this.usernameInput, { timeout: 30000 });
            console.log("Navigated to greythr webpage successfully");
        }
        catch (error) {
            console.error("Error navigating to greythr webpage", error);
            throw error;
        }
    };
    loginToGreythr = async () => {
        try {
            console.log('Filling username...');
            await this.page.fill(this.usernameInput, process.env.GREYTHR_USERNAME);
            console.log('Username filled, filling password...');
            await this.page.fill(this.passwordInput, process.env.GREYTHR_PASSWORD);
            await this.page.click(this.loginButton);
            console.log('clicked on the login');
            console.log('waiting for dashboard to hydrate...');
            console.log("clicked on the login");
            console.log("Current URL after login:", this.page.url());

            console.log("waiting for dashboard to hydrate...");

            await this.page.waitForTimeout(5000);

            console.log("URL after 5 sec:", this.page.url());

            await this.page.screenshot({
                path: "greythr-after-login.png",
                fullPage: true,
            });

            console.log(
                "btn-container count:",
                await this.page.locator(".btn-container").count()
            );

            console.log(
                "body text:",
                (await this.page.locator("body").innerText()).slice(0, 3000)
            );

            // Let the OAuth redirect chain fully resolve, then wait for real hydrated content
            await this.page.waitForSelector('.btn-container', { timeout: 60000, state: 'attached' });
            console.log('.btn-container found, waiting for hydration...');
            await this.page.waitForTimeout(1000); // let Stencil finish hydrating attributes/handlers
            console.log("Logged in to greythr successfully");
        }
        catch (error) {
            console.error("Error logging in to greythr", error);

            console.log("Final URL:", this.page.url());

            try {
                await this.page.screenshot({
                    path: "greythr-login-failed.png",
                    fullPage: true,
                });

                console.log(
                    "Final page text:",
                    (await this.page.locator("body").innerText()).slice(0, 5000)
                );
            } catch (debugError) {
                console.error("Could not capture debug information:", debugError);
            }

            throw error;
        }
    };
    async toggleAttendance() {
        console.log('Looking for attendance button...');
        console.log('Current URL:', this.page.url());
        const attendanceButton = this.page
            .locator('.btn-container')
            .getByRole('button', { name: /Sign In|Sign Out/ });
        try {
            await attendanceButton.waitFor({ state: 'visible', timeout: 30000 });
        }
        catch (err) {
            console.error('Button never became visible. Current URL:', this.page.url());
            const html = await this.page.content();
            console.log('Page HTML snippet:', html.slice(0, 2000));
            throw err;
        }
        const action = (await attendanceButton.textContent())?.trim();
        console.log(`Current attendance state: ${action}`);
        await attendanceButton.click();
        await this.page.waitForLoadState('networkidle');
        return action?.toLowerCase() === "sign in";
    }
}
exports.GreythrPage = GreythrPage;
//# sourceMappingURL=greythr.page.js.map