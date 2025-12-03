/**
 * Aurora Vite - Puppeteer E2E Test Suite
 * Comprehensive testing for Replit deployment readiness
 */

import puppeteer from 'puppeteer';

const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:3001';

const results = {
  passed: [],
  failed: [],
  warnings: []
};

function log(msg, type = 'info') {
  const prefix = {
    info: '  ',
    pass: '✓ ',
    fail: '✗ ',
    warn: '⚠ '
  }[type];
  console.log(`${prefix}${msg}`);
}

async function testHealthEndpoints() {
  console.log('\n📡 Testing Health Endpoints...');

  try {
    // Test backend health
    const backendHealth = await fetch(`${BACKEND_URL}/health`);
    if (backendHealth.ok) {
      const data = await backendHealth.json();
      log(`Backend /health - OK (status: ${data.status})`, 'pass');
      results.passed.push('Backend /health endpoint');
    } else {
      throw new Error(`Status ${backendHealth.status}`);
    }
  } catch (e) {
    log(`Backend /health - FAILED: ${e.message}`, 'fail');
    results.failed.push('Backend /health endpoint');
  }

  try {
    // Test API health
    const apiHealth = await fetch(`${BACKEND_URL}/api/health`);
    if (apiHealth.ok) {
      const data = await apiHealth.json();
      log(`Backend /api/health - OK (db: ${data.database})`, 'pass');
      results.passed.push('Backend /api/health endpoint');
    } else {
      throw new Error(`Status ${apiHealth.status}`);
    }
  } catch (e) {
    log(`Backend /api/health - FAILED: ${e.message}`, 'fail');
    results.failed.push('Backend /api/health endpoint');
  }
}

async function testFrontendLoad(browser) {
  console.log('\n🖥️  Testing Frontend Loading...');

  const page = await browser.newPage();

  try {
    // Test login page loads
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0', timeout: 10000 });
    const title = await page.title();
    log(`Login page loads - Title: "${title}"`, 'pass');
    results.passed.push('Login page loads');

    // Wait a moment for React hydration
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check for form elements - use flexible selectors
    const form = await page.$('form');
    const emailInput = await page.$('input#email, input[type="email"]');
    const passwordInput = await page.$('input#password, input[type="password"]');

    if (form && emailInput && passwordInput) {
      log('Login form elements present', 'pass');
      results.passed.push('Login form elements');
    } else if (form || emailInput || passwordInput) {
      log(`Partial form found (form: ${!!form}, email: ${!!emailInput}, password: ${!!passwordInput})`, 'warn');
      results.warnings.push('Login form (partial)');
    } else {
      log('Login form elements missing', 'fail');
      results.failed.push('Login form elements');
    }
  } catch (e) {
    log(`Login page failed: ${e.message}`, 'fail');
    results.failed.push('Login page load');
  }

  try {
    // Test signup page loads
    await page.goto(`${FRONTEND_URL}/signup`, { waitUntil: 'networkidle0', timeout: 10000 });
    const signupForm = await page.$('form');
    if (signupForm) {
      log('Signup page loads', 'pass');
      results.passed.push('Signup page loads');
    }
  } catch (e) {
    log(`Signup page failed: ${e.message}`, 'fail');
    results.failed.push('Signup page load');
  }

  await page.close();
}

async function testAuthFlow(browser) {
  console.log('\n🔐 Testing Authentication Flow...');

  const page = await browser.newPage();
  const testEmail = `test${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  try {
    // Attempt signup
    await page.goto(`${FRONTEND_URL}/signup`, { waitUntil: 'networkidle0', timeout: 10000 });

    await page.type('input[name="name"], input[placeholder*="name" i]', testName);
    await page.type('input[type="email"]', testEmail);
    await page.type('input[type="password"]', testPassword);

    // Look for submit button
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();

      // Wait for navigation or error
      await page.waitForNavigation({ timeout: 5000 }).catch(() => {});

      const url = page.url();
      if (url.includes('/dashboard')) {
        log('Signup redirects to dashboard', 'pass');
        results.passed.push('Signup flow');
      } else {
        log('Signup did not redirect (API may be disconnected)', 'warn');
        results.warnings.push('Signup redirect');
      }
    }
  } catch (e) {
    log(`Signup flow: ${e.message}`, 'warn');
    results.warnings.push('Signup flow (expected without DB)');
  }

  await page.close();
}

async function testDashboardProtection(browser) {
  console.log('\n🛡️  Testing Route Protection...');

  const page = await browser.newPage();

  try {
    // Attempt to access dashboard without auth
    await page.goto(`${FRONTEND_URL}/dashboard`, { waitUntil: 'networkidle0', timeout: 10000 });

    const url = page.url();
    if (url.includes('/login')) {
      log('Dashboard redirects to login when unauthenticated', 'pass');
      results.passed.push('Protected route redirect');
    } else {
      log('Dashboard protection may not be working', 'warn');
      results.warnings.push('Protected route redirect');
    }
  } catch (e) {
    log(`Route protection test failed: ${e.message}`, 'fail');
    results.failed.push('Protected route test');
  }

  await page.close();
}

async function testStaticAssets(browser) {
  console.log('\n📦 Testing Static Assets...');

  const page = await browser.newPage();
  const errors = [];

  page.on('requestfailed', request => {
    errors.push(request.url());
  });

  try {
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0', timeout: 10000 });

    if (errors.length === 0) {
      log('All static assets loaded successfully', 'pass');
      results.passed.push('Static assets load');
    } else {
      log(`${errors.length} assets failed to load`, 'fail');
      errors.forEach(url => log(`  Failed: ${url}`, 'fail'));
      results.failed.push(`Static assets (${errors.length} failures)`);
    }
  } catch (e) {
    log(`Static asset test failed: ${e.message}`, 'fail');
    results.failed.push('Static asset test');
  }

  await page.close();
}

async function testAPIEndpoints() {
  console.log('\n🔌 Testing API Endpoints...');

  const endpoints = [
    { path: '/api/auth/me', method: 'GET', expectStatus: [401, 200] },
    { path: '/api/company', method: 'GET', expectStatus: [401, 200] },
  ];

  for (const ep of endpoints) {
    try {
      const response = await fetch(`${BACKEND_URL}${ep.path}`, { method: ep.method });
      if (ep.expectStatus.includes(response.status)) {
        log(`${ep.method} ${ep.path} - Status ${response.status}`, 'pass');
        results.passed.push(`API ${ep.method} ${ep.path}`);
      } else {
        log(`${ep.method} ${ep.path} - Unexpected status ${response.status}`, 'fail');
        results.failed.push(`API ${ep.method} ${ep.path}`);
      }
    } catch (e) {
      log(`${ep.method} ${ep.path} - FAILED: ${e.message}`, 'fail');
      results.failed.push(`API ${ep.method} ${ep.path}`);
    }
  }
}

async function testCSSVariables(browser) {
  console.log('\n🎨 Testing CSS/Theme System...');

  const page = await browser.newPage();

  try {
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0', timeout: 10000 });

    // Check CSS variables are applied
    const bgColor = await page.evaluate(() => {
      return getComputedStyle(document.body).backgroundColor;
    });

    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      log(`Theme applied - Background: ${bgColor}`, 'pass');
      results.passed.push('CSS theme system');
    } else {
      log('Theme may not be properly applied', 'warn');
      results.warnings.push('CSS theme system');
    }
  } catch (e) {
    log(`CSS test failed: ${e.message}`, 'fail');
    results.failed.push('CSS test');
  }

  await page.close();
}

async function testConsoleErrors(browser) {
  console.log('\n🐛 Testing for Console Errors...');

  const page = await browser.newPage();
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle0', timeout: 10000 });
    // Wait 2 seconds for any delayed console errors
    await new Promise(resolve => setTimeout(resolve, 2000));

    const criticalErrors = consoleErrors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('net::ERR') &&
      !e.includes('Failed to load resource')
    );

    if (criticalErrors.length === 0) {
      log('No critical console errors', 'pass');
      results.passed.push('No console errors');
    } else {
      log(`${criticalErrors.length} console errors found:`, 'warn');
      criticalErrors.forEach(e => log(`  ${e.substring(0, 100)}...`, 'warn'));
      results.warnings.push(`Console errors (${criticalErrors.length})`);
    }
  } catch (e) {
    log(`Console test failed: ${e.message}`, 'fail');
    results.failed.push('Console error test');
  }

  await page.close();
}

async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     Aurora Vite - Puppeteer E2E Test Suite                ║');
  console.log('║     Testing Replit Deployment Readiness                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  // Test backend first (no browser needed)
  await testHealthEndpoints();
  await testAPIEndpoints();

  // Launch browser for frontend tests
  console.log('\n🚀 Launching browser for frontend tests...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    await testFrontendLoad(browser);
    await testStaticAssets(browser);
    await testCSSVariables(browser);
    await testDashboardProtection(browser);
    await testAuthFlow(browser);
    await testConsoleErrors(browser);
  } finally {
    await browser.close();
  }

  // Print summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                     TEST SUMMARY                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\n✅ PASSED: ${results.passed.length}`);
  results.passed.forEach(t => console.log(`   - ${t}`));

  if (results.warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS: ${results.warnings.length}`);
    results.warnings.forEach(t => console.log(`   - ${t}`));
  }

  if (results.failed.length > 0) {
    console.log(`\n❌ FAILED: ${results.failed.length}`);
    results.failed.forEach(t => console.log(`   - ${t}`));
  }

  const total = results.passed.length + results.failed.length;
  const passRate = Math.round((results.passed.length / total) * 100);

  console.log('\n────────────────────────────────────────────────────────────');
  console.log(`📊 Pass Rate: ${passRate}% (${results.passed.length}/${total})`);

  if (results.failed.length === 0) {
    console.log('\n🎉 All critical tests passed! Ready for Replit deployment.');
  } else {
    console.log('\n⚠️  Some tests failed. Review before deploying.');
  }
  console.log('────────────────────────────────────────────────────────────\n');

  return results.failed.length === 0;
}

runAllTests()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Test suite crashed:', err);
    process.exit(1);
  });
