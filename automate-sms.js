/**
 * Example Automation for Gem Stone Salafi School Management System
 * Demonstrates using the browser automation framework
 */

const {
  connectToBrowser,
  openPage,
  login,
  captureConsoleLogs,
  captureErrors,
  captureFailedRequests,
  takeScreenshot,
  generateReport,
  saveLogs,
  closeBrowser
} = require('./src/lib/browser-automation.js');

async function runAutomation() {
  console.log('=== Starting SMS Automation ===\n');
  
  try {
    // Step 1: Connect to existing Chromium
    console.log('1. Connecting to browser...');
    await connectToBrowser();
    console.log('   ✓ Connected to CDP endpoint\n');
    
    // Step 2: Open homepage
    console.log('2. Opening homepage...');
    await openPage('https://my-sms-beta.vercel.app/');
    console.log('   ✓ Homepage loaded\n');
    
    // Step 3: Take screenshot
    console.log('3. Taking screenshot...');
    const screenshotPath = await takeScreenshot('sms_homepage');
    console.log(`   ✓ Saved: ${screenshotPath}\n`);
    
    // Step 4: Capture console logs
    console.log('4. Inspecting console...');
    const logs = captureConsoleLogs();
    console.log(`   ✓ Found ${logs.length} console messages`);
    logs.slice(0, 3).forEach(log => {
      console.log(`   - [${log.type}] ${log.text.substring(0, 50)}...`);
    });
    console.log();
    
    // Step 5: Check for errors
    console.log('5. Checking for page errors...');
    const errors = captureErrors();
    if (errors.length === 0) {
      console.log('   ✓ No page errors detected\n');
    } else {
      console.log(`   ! Found ${errors.length} errors`);
      errors.forEach(err => console.log(`   - ${err.message}\n`));
    }
    
    // Step 6: Check for failed requests
    console.log('6. Checking for failed requests...');
    const failed = captureFailedRequests();
    if (failed.length === 0) {
      console.log('   ✓ No failed requests\n');
    } else {
      console.log(`   ! Found ${failed.length} failed requests`);
      failed.forEach(req => console.log(`   - ${req.url}: ${req.failure?.errorText}\n`));
    }
    
    // Step 7: Save logs
    console.log('7. Saving logs...');
    saveLogs('sms_inspection');
    console.log('   ✓ Logs saved\n');
    
    // Step 8: Generate report
    console.log('8. Generating report...');
    const report = generateReport('sms_inspection');
    console.log('   ✓ Report generated\n');
    
    // Print summary
    console.log('=== Automation Summary ===');
    console.log(`Console logs: ${report.summary.consoleLogsCount}`);
    console.log(`Page errors: ${report.summary.errorsCount}`);
    console.log(`Failed requests: ${report.summary.failedRequestsCount}`);
    console.log(`Screenshot: ${screenshotPath}`);
    console.log(`Report: reports/${report.name}.json\n`);
    
  } catch (error) {
    console.error('Automation failed:', error.message);
  } finally {
    await closeBrowser();
    console.log('Browser disconnected.');
  }
}

// Run the automation
runAutomation();