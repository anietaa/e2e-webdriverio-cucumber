// test/specs/dynamicTableSelectorDebug.e2e.js

describe('Dynamic table selector debug', () => {
  it('should find the table', async () => {
    await browser.url('https://practice.expandtesting.com/dynamic-table');

    const url = await browser.getUrl();
    console.log('URL:', url);

    const tableEl = await $('table.table.table-striped');
    console.log('exists:', await tableEl.isExisting());
    console.log('displayed:', await tableEl.isDisplayed());
  });
});