import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto("https://playwright.dev/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

// Print used browser version information.
test('print browser version', async ({ page, browserName }) => {
  const browser = await page.context().browser();
  const version = await browser.version();
  console.log(`The version of used ${browserName} is ${version}`);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('print latest browser versions from release notes', async ({ browserName, page }) => {
  // Navigate to the Playwright.dev page.
  await page.goto('https://playwright.dev/');
  
  let latestChromiumVersion = null;
  let latestFirefoxVersion = null;
  let latestWebkitVersion = null;

  // Check if the browser is mobile Chromium or mobile Safari.
  const isMobileChromium = await page.evaluate(() => navigator.userAgent.includes('Android'));
  console.log(`Is mobile Chromium: ${isMobileChromium}`);
  const isMobileSafari = await page.evaluate(() => navigator.userAgent.includes('Mobile'));
  console.log(`Is mobile Safari: ${isMobileSafari}`);

  if (isMobileChromium || isMobileSafari) { 
      const mobileChromiumVersion = await page.evaluate(() => navigator.userAgent.match(/Chrome\/(\d+\.\d+\.\d+\.\d+)/)?.[1]);
      console.log(`Mobile Chromium version is ${mobileChromiumVersion}`);
      const mobileSafariVersion = await page.evaluate(() => navigator.userAgent.match(/Version\/(\d+\.\d+)/)?.[1]);
      console.log(`Mobile Safari version is ${mobileSafariVersion}`);
      await page.getByLabel('Toggle navigation bar').click();
      await page.getByRole('link', { name: 'Docs' }).click();
      await page.getByLabel('Toggle navigation bar').click();
      await page.getByRole('link', { name: 'Release Notes' }).click();
    } else if (browserName === 'chromium' || browserName === 'firefox') {
      // Click on the Docs link.
      await page.click('text=Docs');
      // Click on the Release Notes link.
      await page.click('text=Release Notes');
    } else if (browserName === 'webkit' && !isMobileSafari) {
      await page.click('text=Docs');
      await page.click('text=Release Notes');
    }
  
  // Wait for the page to load.
  await page.waitForLoadState('networkidle');

  // Page is https://playwright.dev/docs/release-notes. Get the first occurrence of browser versions for Chromium, Mozilla Firefox, and WebKit.
  const productList = await page.$$('ul li');
  for (const product of productList) {
    const text = await product.textContent();
    if (text && text.includes('Chromium')) {
      latestChromiumVersion = text.match(/\d+\.\d+\.\d+\.\d+/)?.[0];
      //console.log(`Chromium version: ${latestChromiumVersion}`);
    } else if (text && text.includes('Firefox')) {
      latestFirefoxVersion = text.match(/\d+\.\d+\.\d+/)?.[0];
      //console.log(`Firefox version: ${latestFirefoxVersion}`);
    } else if (text && text.includes('WebKit')) {
      latestWebkitVersion = text.match(/\d+\.\d+/)?.[0];
      //console.log(`WebKit version: ${latestWebkitVersion}`);
    }
    if (latestChromiumVersion && latestFirefoxVersion && latestWebkitVersion) {
      break;
    }
  }

  // Print out the latest versions in https://playwright.dev/docs/release-notes.
  console.log(`The latest versions in https://playwright.dev/docs/release-notes are:`);
  console.log(`The latest Chromium version is ${latestChromiumVersion}`);
  console.log(`The latest Firefox version is ${latestFirefoxVersion}`);
  console.log(`The latest WebKit version is ${latestWebkitVersion}`);
});