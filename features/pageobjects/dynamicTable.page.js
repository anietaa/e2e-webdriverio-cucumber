// features/pageobjects/dynamicTable.page.js
import Page from './page.js';

class DynamicTablePage extends Page {
  get tableContainer () {
    // use the first table on the page
    return $('table');
  }

  get yellowLabel () {
    return $('#chrome-cpu');
  }

  open () {
    return super.open('/dynamic-table');
  }

  normalizeCpu (value) {
    return value.replace('%', '').trim();
  }

  async dismissBottomAdOverlay () {
    const overlays = await $$(
      'iframe, div[style*="position: fixed"], div[style*="position:fixed"], div[class*="sticky"], div[class*="banner"], div[class*="cookie"]'
    );

    for (const overlay of overlays) {
      try {
        if (await overlay.isDisplayed()) {
          await browser.execute(el => {
            el.style.display = 'none';
          }, overlay);
        }
      } catch (e) {}
    }
  }

  async bringTableIntoView () {
    await this.tableContainer.scrollIntoView();
    await browser.execute(() => window.scrollBy(0, -250));
  }

  async getCpuForProcess (processName) {
    await this.dismissBottomAdOverlay();
    await this.bringTableIntoView();

    await this.tableContainer.waitForDisplayed({
      timeout: 15000,
      timeoutMsg: 'Dynamic table container not visible within 15s',
    });

    const html = await this.tableContainer.getHTML(false);
    console.log('DEBUG table HTML:', html);

    if (!html.includes(processName)) {
      throw new Error(`Process "${processName}" not found in dynamic table HTML`);
    }

    const cpuMatch = html.match(/(\d+(?:\.\d+)?)%/);
    if (!cpuMatch) {
      throw new Error('Could not find a CPU value in dynamic table HTML');
    }

    return this.normalizeCpu(cpuMatch[0]);
  }

  async getYellowLabelCpuValue () {
    await this.yellowLabel.scrollIntoView();
    await this.yellowLabel.waitForDisplayed({
      timeout: 15000,
      timeoutMsg: 'Yellow label not visible within 15s',
    });

    const labelText = await this.yellowLabel.getText();
    console.log('DEBUG yellow label:', JSON.stringify(labelText));

    const match = labelText.match(/(\d+(?:\.\d+)?)%/);
    if (!match) {
      throw new Error(`Could not extract CPU value from label: "${labelText}"`);
    }

    return this.normalizeCpu(match[0]);
  }
}

export default new DynamicTablePage();