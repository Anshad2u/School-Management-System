/**
 * Termux Browser Automation Framework
 * Uses puppeteer-core to connect to existing Chromium CDP session on port 9222
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// CDP endpoint for existing Chromium in Termux
const CDP_ENDPOINT = 'http://127.0.0.1:9222';

// Directory structure for outputs (relative to project root)
const DIRS = {
  screenshots: path.join(process.cwd(), 'screenshots'),
  logs: path.join(process.cwd(), 'logs'),
  reports: path.join(process.cwd(), 'reports')
};

// Browser instance and page reference
let browser = null;
let page = null;

// Data collection for reporting
const sessionData = {
  consoleLogs: [],
  pageErrors: [],
  failedRequests: [],
  timestamps: {}
};

/**
 * Ensure output directories exist
 */
function ensureDirs() {
  Object.values(DIRS).forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Connect to existing Chromium CDP session
 * @returns {Promise<Object} Puppeteer browser instance
 */
async function connectToBrowser() {
  ensureDirs();
  
  try {
    // Connect to existing browser via CDP
    browser = await puppeteer.connect({
      browserURL: CDP_ENDPOINT
    });
    
    // Create new page/tab
    page = await browser.newPage();
    
    // Setup listeners for console logs
    page.on('console', (msg) => {
      sessionData.consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    });
    
    // Setup listeners for page errors
    page.on('pageerror', (err) => {
      sessionData.pageErrors.push({
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
    });
    
    // Setup listeners for failed requests
    page.on('requestfailed', (req) => {
      sessionData.failedRequests.push({
        url: req.url(),
        failure: req.failure(),
        timestamp: new Date().toISOString()
      });
    });
    
    // Setup listeners for navigation
    page.on('framenavigated', (frame) => {
      if (frame.isMainFrame()) {
        sessionData.timestamps[`nav_${Date.now()}`] = frame.url();
      }
    });
    
    sessionData.timestamps.connect = new Date().toISOString();
    console.log('Connected to browser via CDP');
    return browser;
  } catch (error) {
    throw new Error(`Failed to connect to CDP: ${error.message}`);
  }
}

/**
 * Open a URL in the browser
 * @param {string} url - URL to navigate to
 * @param {Object} options - Navigation options
 * @returns {Promise<void}
 */
async function openPage(url, options = {}) {
  if (!page) {
    throw new Error('Browser not connected. Call connectToBrowser() first.');
  }
  
  const defaultOptions = {
    waitUntil: 'networkidle2',
    timeout: 30000
  };
  
  try {
    await page.goto(url, { ...defaultOptions, ...options });
    sessionData.timestamps[`navigate_${url}`] = new Date().toISOString();
    console.log(`Opened: ${url}`);
  } catch (error) {
    throw new Error(`Failed to open ${url}: ${error.message}`);
  }
}

/**
 * Perform login with credentials
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - Email value
 * @param {string} credentials.password - Password value
 * @param {Object} selectors - CSS selectors for login form
 */
async function login(credentials, selectors = {}) {
  const { email, password } = credentials;
  const {
    emailSelector = 'input[type="email"]',
    passwordSelector = 'input[type="password"]',
    submitSelector = 'button[type="submit"]'
  } = selectors;
  
  try {
    await page.type(emailSelector, email);
    await page.type(passwordSelector, password);
    await page.click(submitSelector);
    
    // Wait for navigation/login to complete
    await new Promise(r => setTimeout(r, 3000));
    sessionData.timestamps.login = new Date().toISOString();
    console.log('Login completed');
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
}

/**
 * Capture console logs from the page
 * @returns {Array} Array of console log entries
 */
function captureConsoleLogs() {
  return sessionData.consoleLogs;
}

/**
 * Capture page errors
 * @returns {Array} Array of page error entries
 */
function captureErrors() {
  return sessionData.pageErrors;
}

/**
 * Capture failed network requests
 * @returns {Array} Array of failed request entries
 */
function captureFailedRequests() {
  return sessionData.failedRequests;
}

/**
 * Take screenshot of current page
 * @param {string} name - Screenshot filename (without extension)
 * @returns {Promise<string} Path to saved screenshot
 */
async function takeScreenshot(name) {
  if (!page) {
    throw new Error('Browser not connected.');
  }
  
  const filename = `${name}_${Date.now()}.png`;
  const filepath = path.join(DIRS.screenshots, filename);
  
  try {
    await page.screenshot({ 
      path: filepath,
      fullPage: true 
    });
    console.log(`Screenshot saved: ${filepath}`);
    return filepath;
  } catch (error) {
    throw new Error(`Failed to take screenshot: ${error.message}`);
  }
}

/**
 * Generate comprehensive report
 * @param {string} name - Report name
 * @returns {Object} Report object
 */
function generateReport(name = 'automation_report') {
  const report = {
    name,
    timestamp: new Date().toISOString(),
    summary: {
      consoleLogsCount: sessionData.consoleLogs.length,
      errorsCount: sessionData.pageErrors.length,
      failedRequestsCount: sessionData.failedRequests.length
    },
    data: {
      consoleLogs: sessionData.consoleLogs,
      errors: sessionData.pageErrors,
      failedRequests: sessionData.failedRequests
    },
    timestamps: sessionData.timestamps
  };
  
  // Save report as JSON
  const filename = `${name}_${Date.now()}.json`;
  const filepath = path.join(DIRS.reports, filename);
  fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
  console.log(`Report saved: ${filepath}`);
  
  return report;
}

/**
 * Save logs to files
 * @param {string} prefix - File prefix for log files
 */
function saveLogs(prefix = 'session') {
  const timestamp = Date.now();
  
  // Save console logs
  if (sessionData.consoleLogs.length > 0) {
    const logPath = path.join(DIRS.logs, `${prefix}_console_${timestamp}.json`);
    fs.writeFileSync(logPath, JSON.stringify(sessionData.consoleLogs, null, 2));
    console.log(`Console logs saved: ${logPath}`);
  }
  
  // Save errors
  if (sessionData.pageErrors.length > 0) {
    const errorPath = path.join(DIRS.logs, `${prefix}_errors_${timestamp}.json`);
    fs.writeFileSync(errorPath, JSON.stringify(sessionData.pageErrors, null, 2));
    console.log(`Errors saved: ${errorPath}`);
  }
  
  // Save failed requests
  if (sessionData.failedRequests.length > 0) {
    const failedPath = path.join(DIRS.logs, `${prefix}_failed_${timestamp}.json`);
    fs.writeFileSync(failedPath, JSON.stringify(sessionData.failedRequests, null, 2));
    console.log(`Failed requests saved: ${failedPath}`);
  }
}

/**
 * Close browser connection
 */
async function closeBrowser() {
  if (browser) {
    await browser.disconnect();
    browser = null;
    page = null;
    console.log('Browser disconnected');
  }
}

// Export all functions
module.exports = {
  connectToBrowser,
  openPage,
  login,
  captureConsoleLogs,
  captureErrors,
  captureFailedRequests,
  takeScreenshot,
  generateReport,
  saveLogs,
  closeBrowser,
  CDP_ENDPOINT
};