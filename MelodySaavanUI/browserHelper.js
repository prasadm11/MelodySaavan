const { chromium } = require('playwright');
const path = require('path');

const MAX_WAIT_TIME_MS = 180000; // 3 minutes maximum waiting time for CAPTCHA solve

async function launchCaptchaHelper(phoneNumber = '', appPort = 3000) {
    console.log(`Starting CAPTCHA helper for phone: ${phoneNumber || 'Not provided'}`);
    
    let browser = null;
    try {
        browser = await chromium.launch({
            headless: false,
            channel: 'chrome',
            args: ['--start-maximized']
        });
    } catch (err) {
        console.warn('Could not launch Chrome channel, falling back to default chromium build:', err.message);
        try {
            browser = await chromium.launch({
                headless: false,
                args: ['--start-maximized']
            });
        } catch (fallbackErr) {
            console.error('Failed to launch Playwright browser:', fallbackErr.message);
            return;
        }
    }

    try {
        const context = await browser.newContext({
            viewport: null
        });

        const page = await context.newPage();

        // Reasonable timeouts to prevent permanent hangs
        page.setDefaultNavigationTimeout(30000);
        page.setDefaultTimeout(10000);

        await page.goto('https://www.jiosaavn.com/login', {
            waitUntil: 'domcontentloaded'
        });

        console.log('✅ JioSaavn login page loaded.');
        console.log('👉 Complete the CAPTCHA manually inside the opened browser window...');

        // If phone number is pre-provided, pre-fill it in the JioSaavn input field to save time
        if (phoneNumber && /^\+?[0-9]{10,15}$/.test(phoneNumber)) {
            try {
                const phoneInputSelector = 'input[type="tel"], input[name="phone"], #phone';
                await page.waitForSelector(phoneInputSelector, { timeout: 4000 });
                await page.fill(phoneInputSelector, phoneNumber);
                console.log(`Pre-filled phone number: ${phoneNumber}`);
            } catch (e) {
                // Silently continue if selector not found immediately
            }
        }

        let token = null;
        let detectedPhone = phoneNumber;
        const startTime = Date.now();

        // Loop until CAPTCHA is solved, token extracted, window closed, or timeout reached
        while (!token) {
            // Check timeout
            if (Date.now() - startTime > MAX_WAIT_TIME_MS) {
                console.log('\n⌛ CAPTCHA helper timed out after 3 minutes.');
                break;
            }

            // Check if page/browser was closed by user
            if (page.isClosed() || !browser.isConnected()) {
                console.log('\n🛑 Browser page was closed by user.');
                break;
            }

            try {
                if (!detectedPhone) {
                    detectedPhone = await page.evaluate(() => {
                        const inputs = Array.from(document.querySelectorAll('input'));
                        for (const input of inputs) {
                            const val = input.value.replace(/\D/g, '');
                            if (val.length === 10) {
                                return val;
                            }
                        }
                        return '';
                    }).catch(() => '');
                }

                token = await page.evaluate(() => {
                    try {
                        if (typeof grecaptcha === 'undefined') return null;

                        // Try common widget ids
                        for (let i = 0; i < 10; i++) {
                            try {
                                const response = grecaptcha.getResponse(i);
                                if (response && response.length > 0) {
                                    return response;
                                }
                            } catch {}
                        }

                        // If widget id is stored globally
                        if (window.recaptchaWidgetId !== undefined) {
                            const response = grecaptcha.getResponse(window.recaptchaWidgetId);
                            if (response && response.length > 0) {
                                return response;
                            }
                        }

                        return null;
                    } catch {
                        return null;
                    }
                });

                if (token) {
                    console.log("\n========================================");
                    console.log("✅ CAPTCHA RESPONSE FOUND");
                    console.log("========================================\n");
                    break;
                }

                await page.waitForTimeout(1000);

            } catch (err) {
                if (page.isClosed() || !browser.isConnected()) break;
                await page.waitForTimeout(1000);
            }
        }

        if (token) {
            // Submit the token to the server's check endpoint
            const submitUrl = `http://localhost:${appPort}/api/submit-captcha?recaptchaResponse=${encodeURIComponent(token)}` + (detectedPhone ? `&phoneNumber=${encodeURIComponent(detectedPhone)}` : '');
            console.log(`Submitting token to server: ${submitUrl}`);
            try {
                await page.goto(submitUrl, { timeout: 10000 });
                console.log('CAPTCHA token submitted successfully.');
                
                // Wait briefly for confirmation or until user closes page
                await Promise.race([
                    new Promise(resolve => page.on('close', resolve)),
                    page.waitForTimeout(5000)
                ]);
            } catch (e) {
                // Page might have closed
            }
        }
    } catch (error) {
        console.error('Error during CAPTCHA helper session:', error.message);
    } finally {
        if (browser && browser.isConnected()) {
            try {
                await browser.close();
            } catch {}
        }
    }
}

module.exports = { launchCaptchaHelper };

// Allow executing directly from terminal for testing: node browserHelper.js <phone>
if (require.main === module) {
    const args = process.argv.slice(2);
    const phone = args[0] || '';
    launchCaptchaHelper(phone).catch(err => console.error('Error running helper:', err));
}
