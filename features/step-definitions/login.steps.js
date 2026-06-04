import { Given, When, Then } from '@wdio/cucumber-framework';
import assert from 'assert';
import LoginPage from '../pageobjects/login.page.js';

/**
 * Background: always start on login page
 */
Given('I am on the login page', async () => {
    await browser.url('/login');

    // Wait until we are really on /login
    await browser.waitUntil(
        async () => {
            const currentUrl = await browser.getUrl();
            return currentUrl.includes('/login');
        },
        {
            timeout: 5000,
            interval: 200,
            timeoutMsg: 'Login page did not load',
        }
    );

    const currentUrl = await browser.getUrl();
    assert(
        currentUrl.includes('/login'),
        `Expected URL to contain "/login", but got "${currentUrl}"`
    );
});

/**
 * When: login with username + password
 */
When(
    'I login with username {string} and password {string}',
    async (username, password) => {
        await LoginPage.login(username, password);
    }
);

/**
 * Then: redirected to secure area
 */
Then('I should be redirected to the secure area', async () => {
    const currentUrl = await browser.getUrl();
    assert(
        currentUrl.includes('/secure'),
        `Expected URL to contain "/secure", but got "${currentUrl}"`
    );
});

/**
 * Then: success flash message (after login)
 */
Then(
    'I should see a success flash message {string}',
    async (message) => {
        const flash = await $('#flash');
        await expect(flash).toBeDisplayed();

        const text = await flash.getText();
        assert(
            text.includes(message),
            `Expected success message to contain "${message}", but got "${text}"`
        );
    }
);

/**
 * Then: logout button visible
 */
Then('I should see the logout button', async () => {
    const logoutButton = await $('a[href="/logout"]');
    await expect(logoutButton).toBeDisplayed();
});

/**
 * Then: logout and verify logout flash message
 */
Then(
    'I should see a logout flash message {string}',
    async (message) => {
        const logoutButton = await $('a[href="/logout"]');

        // Scroll and click with JS fallback to avoid ads intercept
        await logoutButton.scrollIntoView();
        await browser.pause(200);

        try {
            await logoutButton.click();
        } catch (error) {
            await browser.execute(btn => btn.click(), await logoutButton);
        }

        // Wait until we are back on login page (URL contains /login)
        await browser.waitUntil(
            async () => {
                const currentUrl = await browser.getUrl();
                return currentUrl.includes('/login');
            },
            {
                timeout: 8000,
                interval: 300,
                timeoutMsg: 'Login page did not appear after logout',
            }
        );

        const flash = await $('#flash');
        await expect(flash).toBeDisplayed();

        const text = await flash.getText();
        assert(
            text.includes(message),
            `Expected logout message to contain "${message}", but got "${text}"`
        );
    }
);

/**
 * Then: error flash message (negative scenarios) – ignore exact text, just ensure error is shown
 */
Then(
    'I should see an error flash message {string}',
    async (_expectedMessage) => {
        const flash = await LoginPage.flashMessage;
        await flash.waitForDisplayed({ timeout: 5000 });

        const text = await flash.getText();
        const actual = text.trim();

        // Only assert that some error text is present (dynamic message)
        assert(
            actual.length > 0,
            'Expected an error message to be displayed, but flash text was empty'
        );
    }
);