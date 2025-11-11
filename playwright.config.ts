import { defineConfig, devices } from '@playwright/test';
import type { TestOptions } from './test-options';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig<TestOptions>({
  timeout: 30000,
  //globalTimeout: 60000,


  expect: {
    timeout: 2000,
    toHaveScreenshot: {
      maxDiffPixels: 50,
    },
  },
  testDir: './e2e-tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  //reporter: 'html',
  //reporter: 'list',
  reporter: [
    ['json', { outputFile: 'test-results/playwright-report.json' }],
    ['junit', { outputFile: 'test-results/playwright-report.xml' }],
    //['allure-playwright'],
    ['html']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:4200/',
    globalsQaUrl: 'https://www.globalsqa.com/demo-site/draganddrop/',
    // baseURL: process.env.DEV === '1' ? 'http://localhost:4200/'
    // : process.env.STAGING === '1' ? 'http://localhost:4201/' : 'http://localhost:4202/',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    //actionTimeout: 5000,
    navigationTimeout: 5000,
    video: {
      mode: 'off',
      size: {
        width: 1920,
        height: 1080,
      },
    },
    screenshot: 'only-on-failure'
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'dev',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:4201/',
       },
      fullyParallel: true,
    },
    {
      name: 'chromium',
      fullyParallel: true,
      timeout: 60000,
    },

    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
      }
    },
    {
      name: 'pageObjectsFullScreen',
      testMatch: 'usePageObject.spec.ts',
      use: {
        viewport: {
          width: 1920,
          height: 1080,
        }
      }
    },
    {
      name: 'mobile',
      testMatch: 'testMobile.spec.ts',
      use: {
        ...devices['Pixel 7'],
      }
    }

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
  },

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
