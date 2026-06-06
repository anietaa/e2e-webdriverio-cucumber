// features/step-definitions/dynamicTable.steps.js
import { Given, When, Then } from '@wdio/cucumber-framework';
import DynamicTablePage from '../pageobjects/dynamicTable.page.js';

let chromeCpuFromTable;
let chromeCpuFromLabel;

Given('I am on the dynamic table page', async () => {
  await DynamicTablePage.open();
});

When('I read the CPU value for the Chrome process from the table', async () => {
  chromeCpuFromTable = await DynamicTablePage.getCpuForProcess('Chrome');
  console.log('Chrome CPU from table:', chromeCpuFromTable);
});

When('I read the CPU value from the yellow label', async () => {
  chromeCpuFromLabel = await DynamicTablePage.getYellowLabelCpuValue();
  console.log('Chrome CPU from yellow label:', chromeCpuFromLabel);
});

Then('the CPU value in the table should match the yellow label value', async () => {
  const tableValue = parseFloat(chromeCpuFromTable);
  const labelValue = parseFloat(chromeCpuFromLabel);

  const diff = Math.abs(tableValue - labelValue);
  const tolerance = 1.0; // allow up to 1 unit difference

  if (Number.isNaN(tableValue) || Number.isNaN(labelValue)) {
    throw new Error(
      `Invalid CPU values: table=${chromeCpuFromTable}, label=${chromeCpuFromLabel}`
    );
  }

  if (diff > tolerance) {
    throw new Error(
      `CPU mismatch beyond tolerance: table=${tableValue}, label=${labelValue}, diff=${diff}`
    );
  }

  console.log(
    `CPU values within tolerance: table=${tableValue}, label=${labelValue}, diff=${diff}`
  );
});