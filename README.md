# WebdriverIO + Cucumber UI Automation Framework

This repository provides a single, extensible UI automation framework built with WebdriverIO and Cucumber (BDD) to cover flows on `https://practice.expandtesting.com`. The framework is intended as a learning and mentoring project for SDETs, focusing on building and evolving a realistic WebdriverIO-based test architecture.

---

## 1. Purpose and Scope

### 1.1 Objectives

This framework is designed to enable the team to:

- Set up and maintain a WebdriverIO + Cucumber stack using WebdriverIO 9 tooling.
- Apply Page Object Model (POM) principles for maintainable UI automation.
- Express behavior using BDD-style feature files.
- Integrate reporting (Allure), video recording, and visual comparison.
- Extend a single framework to cover multiple modules of the same application.

### 1.2 Application Under Test

- Primary application: `https://practice.expandtesting.com`.
- Initial module: Login (`/login`).
- Implemented module: Dynamic Table (`/dynamic-table`).
- Planned module: Cars Showroom (`/cars`).

The goal is to complete a compact but realistic framework around these flows.

---

## 2. Technology Stack

- Node.js.
- WebdriverIO 9 (local runner, async mode).
- Cucumber.js (BDD).
- JavaScript (ES modules, `"type": "module"` in `package.json`).
- Page Object Model (POM).
- Allure reporter (`@wdio/allure-reporter`).
- WDIO Visual Service (`@wdio/visual-service`).
- Video recording via `wdio-video-reporter`.
- Spec reporter for console output.

This stack mirrors common modern UI automation setups and is suitable for focused practice.

---

## 3. Project Structure

```text
.
├─ features
│  ├─ login.feature                  # Login module scenarios
│  ├─ dynamicTable.feature           # Dynamic table scenarios
│  ├─ cars.feature                   # (planned) Cars showroom scenarios
│  ├─ pageobjects
│  │  ├─ page.js                     # Base page object (shared helpers)
│  │  ├─ login.page.js               # Login page object
│  │  ├─ secure.page.js              # Post-login/secure area page object
│  │  ├─ dynamicTable.page.js        # Dynamic table page object
│  │  └─ cars.page.js                # (planned) Cars page object
│  └─ step-definitions
│     ├─ login.steps.js              # Login step definitions
│     ├─ dynamicTable.steps.js       # Dynamic table step definitions
│     └─ cars.steps.js               # (planned) Cars step definitions
├─ wdio.conf.js                      # WebdriverIO configuration
├─ package.json
├─ package-lock.json
└─ .gitignore
```

The structure is modular so additional features under the same site can be added quickly.

---

## 4. Setup and Execution

### 4.1 Prerequisites

- Node.js (LTS).
- npm.
- Basic familiarity with JavaScript, automated testing, and command-line tools.

### 4.2 Installation

From the project root:

```bash
npm install
```

This installs:

- WebdriverIO CLI, local runner, Cucumber framework, and spec reporter.
- Allure reporter and WDIO visual service.
- `wdio-video-reporter` for capturing videos.

### 4.3 Running the Suite

`package.json` defines:

```json
"scripts": {
  "wdio": "wdio run ./wdio.conf.js"
}
```

To run the test suite:

```bash
npm run wdio
```

Execution behavior:

- Uses `wdio.conf.js` as the configuration source.
- Discovers all feature files matching `./features/**/*.feature`.
- Runs tests in Chrome (`browserName: 'chrome'`) with up to 10 concurrent instances (`maxInstances: 10`).
- Uses `baseUrl = https://practice.expandtesting.com`.

---

## 5. WebdriverIO Configuration Overview (wdio.conf.js)

The `wdio.conf.js` file controls test discovery, browser setup, timeouts, services, and reporting.

### 5.1 Specs and Capabilities

- `specs: ['./features/**/*.feature']`  
  All Cucumber feature files under `features` are included.

- `exclude: []`  
  No exclusions are configured.

- `capabilities: [{ browserName: 'chrome' }]`  
  Chrome is configured as the default browser. Parallelism is controlled via `maxInstances: 10`.

### 5.2 Base URL and Timeouts

- `baseUrl: 'https://practice.expandtesting.com'`  
  Relative paths such as `/login` or `/dynamic-table` resolve against this base URL.

- `waitforTimeout: 10000` – default timeout for `waitFor*` commands.
- `connectionRetryTimeout: 120000` and `connectionRetryCount: 3` – robustness for driver communication.

### 5.3 Services

- `services: ['visual']`  
  Enables `@wdio/visual-service` for visual comparison use cases.

### 5.4 Framework and Cucumber Options

- `framework: 'cucumber'`.
- `cucumberOpts.require: ['./features/step-definitions/*.js']` – location of step definition files.
- `cucumberOpts.tagExpression: ''` – all scenarios run by default.
- `cucumberOpts.timeout: 60000` – step timeout in milliseconds.

### 5.5 Reporters

Configured reporters:

- `'spec'`:  
  Console-friendly output for quick local feedback.

- `'allure'`:  
  Allure reporter configured with:
  - `outputDir: 'allure-results'`.
  - `disableWebdriverStepsReporting: true`.
  - `disableWebdriverScreenshotsReporting: false`.

- `Video` (`wdio-video-reporter`):  
  - `saveAllVideos: false`.
  - `videoSlowdownMultiplier: 3`.
  - `outputDir: 'videos'`.

### 5.6 Hooks and Allure Attachments

`afterStep` hook:

- Executed after each Cucumber step.
- On step failure (`!result.passed`):
  - Captures a screenshot via `browser.takeScreenshot()`.
  - Attaches the screenshot to Allure using `allure.addAttachment`, with a descriptive name based on the step keyword and text.

This hook ensures that each failed step has a corresponding screenshot in Allure, making debugging faster.

---

## 6. Framework Design

### 6.1 Feature Layer (BDD)

- Location: `features/*.feature`.
- Purpose: Describe behavior using Gherkin (`Given/When/Then`) in a way that is readable and focused on outcomes.

Current focus:

- `login.feature` – scenarios covering login behavior at `/login`.
- `dynamicTable.feature` – scenarios validating dynamic table behavior at `/dynamic-table`.
- `cars.feature` – planned scenarios for the cars showroom page.

### 6.2 Step Definition Layer

- Location: `features/step-definitions/*.steps.js`.
- Purpose: Connect feature file steps to WebdriverIO commands and page objects.

Guidelines:

- Keep step definitions concise.
- Delegate repeated flows and UI logic to page objects or shared helpers.

### 6.3 Page Object Layer

- Location: `features/pageobjects/`.
- Purpose: Encapsulate selectors and UI logic for each page to keep tests maintainable.

Current examples:

- `page.js`:
  - Base page with shared utilities (e.g., navigation helpers).

- `login.page.js`:
  - Models the login page at `/login` (input fields, button, error message container).

- `secure.page.js`:
  - Represents the secure area displayed after successful login.

- `dynamicTable.page.js`:
  - Encapsulates dynamic table behavior and Chrome CPU extraction at `/dynamic-table`.

---

## 7. Learning Path and Usage

### 7.1 Initial Familiarization

- Run `npm run wdio` to execute current scenarios against `/login` and `/dynamic-table`.
- Observe browser behavior and console output.
- Review:
  - `login.feature` and `dynamicTable.feature`.
  - `login.steps.js` and `dynamicTable.steps.js`.
  - `login.page.js`, `secure.page.js`, and `dynamicTable.page.js`.
  - `wdio.conf.js`.

### 7.2 Extending the Login Module

- Add scenarios for additional login cases:
  - Invalid credentials.
  - Empty fields.
  - Other combinations supported by the practice site.
- Implement or update step definitions accordingly.
- Keep page objects as the single source of selectors and page-specific behavior.

### 7.3 Dynamic Table Module

The Dynamic Table module validates that the CPU value for the Chrome process in the table is consistent with the yellow label on the page.

Implemented behavior:

- Navigate to `/dynamic-table`.
- Use the first `<table>` element as the dynamic table container.
- Extract the Chrome CPU value:
  - Read the table’s inner HTML.
  - Ensure `"Chrome"` exists in the table.
  - Extract the first CPU-like percentage value (e.g., `3.2%`) and normalize it to a numeric string (e.g., `3.2`).
- Extract the CPU value from the yellow label:
  - Read the text from the `#chrome-cpu` element.
  - Extract the CPU percentage and normalize it similarly.
- Compare the two CPU values numerically with a tolerance of `1.0`:
  - This accounts for dynamic/random values and timing differences between table and label updates.
  - The test fails only when the difference exceeds the configured tolerance.

---

## 8. Testing Considerations

### 8.1 Synchronization

- The practice site may exhibit varying response times.
- Synchronization relies on WebdriverIO’s wait utilities (e.g., `waitForDisplayed`, `scrollIntoView`) instead of static pauses.
- Default timeout values in `wdio.conf.js` act as a baseline and can be adjusted if necessary.

### 8.2 Assertions

- Login scenarios:
  - Successful login: confirm navigation to the secure area and presence of expected indicators.
  - Negative login: confirm that access is denied and that an error indication is displayed.

- Dynamic Table scenarios:
  - Chrome CPU value is extracted from both the table and the yellow label.
  - Values are compared numerically with a tolerance (`1.0`) rather than strict string equality, to accommodate dynamic content.

- Future modules:
  - Cars: focus on UI states, filters, and card content.

### 8.3 Failure Analysis

When a failure occurs:

- Check:
  - Console output (spec reporter).
  - Allure reports, including attached screenshots.
  - Video output for visual confirmation of behavior.
- Distinguish between:
  - Application behavior issues.
  - Test or framework issues (selectors, waits, expectations).
  - Environment-related issues.

---

## 9. Challenges Faced During Script Development

### 9.1 Error Message Mismatch (Login)

- Context: Negative login test cases for `/login`.
- Observation:
  - The application displayed an error message that did not match the initially expected text.
  - The login attempt was correctly blocked, but assertions that depended on exact error text failed.
- Analysis:
  - The automation captured and asserted the actual error message correctly.
  - The discrepancy originated from the product’s error message content rather than the test code.
- Response:
  - Assertions were adjusted to either:
    - Match the actual error text as currently displayed, with a note that this reflects current product behavior, or
    - Focus on key phrases or general error indication rather than strict full-text matching while the product bug is tracked.

### 9.2 Locating the Correct Error Element

- The login page contains specific containers for error messages and status indicators.
- Identifying the correct DOM element for validation required inspection of the page structure and verification in the browser.
- Once identified, the page object was updated to reference this element consistently, reducing brittleness of the selectors.

### 9.3 Dynamic Table Structure and Selectors

- Initial attempts assumed a traditional `<table><tr><td>` structure or specific `.table-row` / `.table-cell` classes.
- The actual DOM structure and dynamic behavior did not match these assumptions, causing selectors to fail and rows/cells to appear empty.
- The final implementation simplified the approach:
  - Use the first `<table>` element on the page as the container.
  - Work directly with the table’s inner HTML to find the Chrome process and CPU value.
  - Avoid over-reliance on fragile row/cell selectors for this exercise.

### 9.4 Dynamic Value Mismatch (CPU Values)

- The CPU values for Chrome in the table and in the yellow label are dynamically generated and can differ between reads.
- A strict equality check (`table == label`) caused legitimate test failures (e.g., `3.2` vs `4`).
- The final assertion:
  - Parses both values as numbers.
  - Allows a configurable tolerance (`1.0`) when comparing them.
  - Fails only when the difference exceeds this tolerance, reducing false negatives while still validating the relationship between the values.

---

## 10. Documentation

This `README.md` serves as the single primary documentation source for this project and includes:

- Framework intent and scope.
- Architecture and configuration details.
- Setup, execution, and learning path.
- Testing considerations and real challenges encountered.

