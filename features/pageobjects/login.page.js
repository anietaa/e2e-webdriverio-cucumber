import { $ } from '@wdio/globals';
import Page from './page.js';

class LoginPage extends Page {
    get inputUsername () {
        return $('#username');
    }

    get inputPassword () {
        return $('#password');
    }

    // Actual Login button
    get btnSubmit () {
        return $('#submit-login');
    }

    // Error / info flash on the login page
    get flashMessage () {
        return $('#flash');
    }

    /**
     * Perform login with given username and password.
     * Handles ads that might overlay the login button.
     */
    async login (username, password) {
        // Ensure inputs are visible
        await this.inputUsername.waitForDisplayed({ timeout: 5000 });
        await this.inputPassword.waitForDisplayed({ timeout: 5000 });

        // Set username/password
        await this.inputUsername.clearValue();
        await this.inputUsername.setValue(username);

        await this.inputPassword.clearValue();
        await this.inputPassword.setValue(password);

        // Scroll the button into view (avoid overlays)
        await this.btnSubmit.scrollIntoView();
        await browser.pause(200);

        try {
            // Try normal click first
            await this.btnSubmit.click();
        } catch (error) {
            // Fallback if an ad iframe intercepts the click
            await browser.execute((btn) => btn.click(), await this.btnSubmit);
        }
    }

    open () {
        return super.open('/login');
    }
}

export default new LoginPage();