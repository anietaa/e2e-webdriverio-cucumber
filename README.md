# WebdriverIO + Cucumber UI Automation Framework

This repository provides a single, extensible UI automation framework built with WebdriverIO and Cucumber (BDD) to cover flows on `https://practice.expandtesting.com`. The framework is intended as a learning and mentoring project for SDETs, focusing on building and evolving a realistic WebdriverIO-based test architecture. [web:883]

---

## 1. Purpose and Scope

### 1.1 Objectives

This framework is designed to enable the team to:

- Set up and maintain a WebdriverIO + Cucumber stack using WebdriverIO 9 tooling. [web:868]
- Apply Page Object Model (POM) principles for maintainable UI automation.
- Express behavior using BDD-style feature files.
- Integrate reporting (Allure), video recording, and visual comparison.
- Extend a single framework to cover multiple modules of the same application. [web:873]

### 1.2 Application Under Test

- Primary application: `https://practice.expandtesting.com`. [web:883]
- Initial module: Login (`/login`). [web:884]
- Planned modules within this project:
  - Dynamic Table (`/dynamic-table`). [web:885]
  - Cars Showroom (`/cars`). [web:886]

The goal is to complete a compact but realistic framework around these flows.

---

## 2. Technology Stack

- Node.js.
- WebdriverIO 9 (local runner, async mode). [web:868]
- Cucumber.js (BDD). [web:876]
- JavaScript (ES modules, `"type": "module"` in `package.json`).
- Page Object Model (POM).
- Allure reporter (`@wdio/allure-reporter`). [web:868]
- WDIO Visual Service (`@wdio/visual-service`).
- Video recording via `wdio-video-reporter`.
- Spec reporter for console output.

This stack mirrors common modern UI automation setups and is suitable for focused practice. [web:878]

---

## 3. Project Structure

```text
.
├─ features
│  ├─ login.feature                  # Login module scenarios
│  ├─ dynamic-table.feature          # (planned) Dynamic table scenarios
│  ├─ cars.feature                   # (planned) Cars showroom scenarios
│  ├─ pageobjects
│  │  ├─ page.js                     # Base page object (shared helpers)
│  │  ├─ login.page.js               # Login page object
│  │  ├─ secure.page.js              # Post-login/secure area page object
│  │  ├─ dynamic-table.page.js       # (planned) Dynamic table page object
│  │  └─ cars.page.js                # (planned) Cars page object
│  └─ step-definitions
│     ├─ login.steps.js              # Login step definitions
│     ├─ dynamic-table.steps.js      # (planned) Dynamic table step definitions
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
- Basic familiarity with JavaScript, automated testing, and command-line tools. [web:878]

### 4.2 Installation

From the project root:

```bash
npm install
```

This installs:

- WebdriverIO CLI, local runner, Cucumber framework, and spec reporter.
- Allure reporter and WDIO visual service.
- `wdio-video-reporter` for capturing videos. [web:868]

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
- Runs tests in Chrome (`browserName: 'chrome'`) with up to 10 concurrent instances (`maxInstances: 10`). [web:868]
- Uses `baseUrl = https://practice.expandtesting.com`. [web:883]

---

## 5. WebdriverIO Configuration Overview (wdio.conf.js)

The `wdio.conf.js` file controls test discovery, browser setup, timeouts, services, and reporting. [web:868]

### 5.1 Specs and Capabilities

- `specs: ['./features/**/*.feature']`  
  All Cucumber feature files under `features` are included.

- `exclude: []`  
  No exclusions are configured.

- `capabilities: [{ browserName: 'chrome' }]`  
  Chrome is configured as the default browser. Parallelism is controlled via `maxInstances: 10`.

### 5.2 Base URL and Timeouts

- `baseUrl: 'https://practice.expandtesting.com'`  
  Relative paths such as `/login` resolve against this base URL. [web:883]

- `waitforTimeout: 10000` – default timeout for `waitFor*` commands.
- `connectionRetryTimeout: 120000` and `connectionRetryCount: 3` – robustness for driver communication.

### 5.3 Services

- `services: ['visual']`  
  Enables `@wdio/visual-service` for visual comparison use cases. [web:868]

### 5.4 Framework and Cucumber Options

- `framework: 'cucumber'`.
- `cucumberOpts.require: ['./features/step-definitions/*.js']` – location of step definition files. [web:876]
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
  - `disableWebdriverScreenshotsReporting: false`. [web:868]

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
- Purpose: Describe behavior using Gherkin (`Given/When/Then`) in a way that is readable and focused on outcomes. [web:876]

Current focus:

- `login.feature` – scenarios covering login behavior at `/login`. [web:884]

Planned within this project:

- `dynamic-table.feature` – scenarios for dynamic table interactions. [web:885]
- `cars.feature` – scenarios for the cars showroom page. [web:886]

### 6.2 Step Definition Layer

- Location: `features/step-definitions/*.steps.js`.
- Purpose: Connect feature file steps to WebdriverIO commands and page objects. [web:876]

Guidelines:

- Keep step definitions concise.
- Delegate repeated flows and UI logic to page objects or shared helpers.

### 6.3 Page Object Layer

- Location: `features/pageobjects/`.
- Purpose: Encapsulate selectors and UI logic for each page to keep tests maintainable. [web:873]

Current examples:

- `page.js`:
  - Base page with shared utilities (e.g., navigation helpers).

- `login.page.js`:
  - Models the login page at `/login` (input fields, button, error message container). [web:884]

- `secure.page.js`:
  - Represents the secure area displayed after successful login.

Planned within this project:

- `dynamic-table.page.js`:
  - Encapsulates dynamic table structure and operations. [web:885]

- `cars.page.js`:
  - Encapsulates cars showroom elements such as cards, filters, and details. [web:886]

---

## 7. Learning Path and Usage

### 7.1 Initial Familiarization

- Run `npm run wdio` to execute current scenarios against `/login`. [web:884]
- Observe browser behavior and console output.
- Review:
  - `login.feature`.
  - `login.steps.js`.
  - `login.page.js` and `secure.page.js`.
  - `wdio.conf.js`.

### 7.2 Extending the Login Module

- Add scenarios for additional login cases:
  - Invalid credentials.
  - Empty fields.
  - Other combinations supported by the practice site. [web:884]
- Implement or update step definitions accordingly.
- Keep page objects as the single source of selectors and page-specific behavior.

### 7.3 Adding New Modules

Within this project scope:

- Explore `/dynamic-table` and `/cars` on the practice site. [web:885][web:886]
- For each module:
  - Introduce a feature file.
  - Create a dedicated page object.
  - Add step definitions.
- Optionally, introduce Cucumber tags per module for targeted runs.

---

## 8. Testing Considerations

### 8.1 Synchronization

- The practice site may exhibit varying response times. [web:873]
- Synchronization should rely on WebdriverIO’s wait utilities (e.g., `waitForDisplayed`, `waitUntil`) instead of static pauses.
- Default timeout values in `wdio.conf.js` act as a baseline and can be adjusted if necessary. [web:868]

### 8.2 Assertions

- Login scenarios:
  - Successful login: confirm navigation to the secure area and presence of expected indicators. [web:884]
  - Negative login: confirm that access is denied and that an error indication is displayed.

- Future modules (within this project):
  - Dynamic Table: focus on visible table data, sorting, filtering, and value checks. [web:885]
  - Cars: focus on UI states, filters, and card content. [web:886]

### 8.3 Failure Analysis

When a failure occurs:

- Check:
  - Console output (spec reporter).
  - Allure reports, including attached screenshots.
  - Video output for visual confirmation of behavior.
- Distinguish between:
  - Application behavior issues.
  - Test or framework issues (selectors, waits, expectations).
  - Environment-related issues. [web:873]

---

## 9. Challenges Faced During Script Development

The following challenges were observed while developing the current scripts. Recording them provides context and clarity for anyone reviewing or extending the framework.

### 9.1 Error Message Mismatch (Product Bug)

- Context: Negative login test cases for `/login`. [web:884]
- Observation:
  - The application displayed an error message that did not match the initially expected text.
  - The login attempt was correctly blocked, but assertions that depended on exact error text failed.
- Analysis:
  - The automation captured and asserted the actual error message correctly.
  - The discrepancy originated from the product’s error message content rather than the test code.
  - This was classified as a product bug with respect to message consistency.
- Response:
  - Assertions were adjusted to either:
    - Match the actual error text as currently displayed, with a note that this reflects current product behavior, or
    - Focus on key phrases or general error indication rather than strict full-text matching while the product bug is tracked.
  - This behavior is documented so similar failures are recognized as product-related rather than framework defects.

### 9.2 Locating the Correct Error Element

- The login page contains specific containers for error messages and status indicators.
- Identifying the correct DOM element for validation required inspection of the page structure and verification in the browser.
- Once identified, the page object was updated to reference this element consistently, reducing brittleness of the selectors.

### 9.3 Aligning Tests with Actual UI Behavior

- Initial expectations for error handling and messaging were partly assumption-based.
- During execution, some expectations had to be adjusted to reflect actual UI behavior observed on `https://practice.expandtesting.com`. [web:883]
- This underscored the need to confirm behavior directly in the UI before finalizing assertions, especially when working with demo/practice sites.

---

## 10. Documentation

This `README.md` serves as the single primary documentation source for this project and includes:

- Framework intent and scope.
- Architecture and configuration details.
- Setup, execution, and learning path.
- Testing considerations and real challenges encountered.

Any further documentation (if needed) should be consistent with this file and referenced from here to keep information centralized. [web:879]
