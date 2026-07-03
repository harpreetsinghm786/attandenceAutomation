// src/core/browserManager.ts
import { chromium, firefox, webkit } from "playwright";
export class BrowserManager {
    static browser = null;
    static browserType = process.env.BROWSER || "chromium";
    static headless = (() => {
        if (process.argv.includes("--headed"))
            return false;
        if (process.argv.includes("--headless"))
            return true;
        return process.env.HEADLESS !== "false";
    })();
    /** Launch the browser if not already launched */
    static async getBrowser() {
        if (!this.browser) {
            switch (this.browserType) {
                case "firefox":
                    this.browser = await firefox.launch({ headless: this.headless });
                    break;
                case "webkit":
                    this.browser = await webkit.launch({ headless: this.headless });
                    break;
                default:
                    this.browser = await chromium.launch({
                        channel: "chrome",
                        headless: this.headless,
                        args: [
                            "--no-sandbox",
                            "--disable-setuid-sandbox",
                            "--disable-gpu",
                            "--disable-blink-features=AutomationControlled",
                            "--disable-web-security",
                            "--disable-site-isolation-trials",
                            "--disable-features=IsolateOrigins,site-per-process",
                            "--disable-infobars",
                            "--start-maximized"
                        ],
                    });
            }
        }
        return this.browser;
    }
    static async newContext() {
        const browser = await this.getBrowser();
        const context = await browser.newContext({
            ignoreHTTPSErrors: true,
            javaScriptEnabled: true,
            // Headless-safe real Chrome UA
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            // Important: headless Chrome hides elements in tiny viewport
            viewport: { width: 1600, height: 900 },
        });
        // Set global timeouts to match playwright.config.ts defaults
        context.setDefaultTimeout(120_000);
        context.setDefaultNavigationTimeout(120_000);
        const page = await context.newPage();
        return { context, page };
    }
}
//# sourceMappingURL=browserManager.js.map