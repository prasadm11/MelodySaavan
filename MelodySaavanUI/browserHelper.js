const { chromium } = require('playwright');
const path = require('path');

async function launchCaptchaHelper(phoneNumber = '', appPort = 3000) {
    console.log(`Starting CAPTCHA helper for phone: ${phoneNumber || 'Not provided'}`);
    
    // Launch Chrome using standard launch to avoid profile locking/session sharing conflicts
    const browser = await chromium.launch({
        headless: false,
        channel: 'chrome',
        args: ['--start-maximized']
    });

    const context = await browser.newContext({
        viewport: null
    });

    const page = await context.newPage();

    // Disable navigation timeout to prevent crashes on slow connections
    page.setDefaultNavigationTimeout(0);
    page.setDefaultTimeout(0);

    await page.goto('https://www.jiosaavn.com/login', {
        waitUntil: 'domcontentloaded'
    });

    console.log('✅ JioSaavn login page loaded.');
    console.log('👉 Complete the CAPTCHA manually inside the opened browser window...');

    // If phone number is pre-provided, we can try to fill it in the JioSaavn input field to save time
    if (phoneNumber && /^\d{10}$/.test(phoneNumber)) {
        try {
            // Find phone input on JioSaavn login page and fill it
            const phoneInputSelector = 'input[type="tel"], input[name="phone"], #phone';
            await page.waitForSelector(phoneInputSelector, { timeout: 5000 });
            await page.fill(phoneInputSelector, phoneNumber);
            console.log(`Pre-filled phone number: ${phoneNumber}`);
        } catch (e) {
            console.log('Could not pre-fill phone number:', e.message);
        }
    }

    let token = null;
    let detectedPhone = phoneNumber;

    // Loop until CAPTCHA is solved and token is extracted
    while (!token) {
        try {
            // Keep phone detection
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
                    if (typeof grecaptcha === 'undefined')
                        return null;

                    // Try common widget ids
                    for (let i = 0; i < 10; i++) {
                        try {
                            const response = grecaptcha.getResponse(i);
                            if (response && response.length > 0) {
                                return response;
                            }
                        } catch { }
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
                console.log(token);
                console.log("========================================\n");
                break;
            }

            process.stdout.write(".");

            await page.waitForTimeout(1000);

        } catch (err) {
            console.log(err.message);
            await page.waitForTimeout(1000);
        }
    }

    if (token) {
        // Submit the token to the server's check endpoint so the original window gets notified
        const submitUrl = `http://localhost:${appPort}/api/submit-captcha?recaptchaResponse=${encodeURIComponent(token)}` + (detectedPhone ? `&phoneNumber=${encodeURIComponent(detectedPhone)}` : '');
        console.log(`Submitting token to server: ${submitUrl}`);
        try {
            await page.goto(submitUrl);
            
            // Keep browser open so the user can see the success message
            console.log('CAPTCHA token submitted. Keep browser open for user reference...');
            await new Promise(resolve => page.on('close', resolve));
        } catch (e) {
            console.log('Browser page was closed:', e.message);
        }
    }

    // Only close browser programmatically if we didn't solve the CAPTCHA (aborted/closed early)
    if (!token) {
        try {
            await browser.close();
        } catch (e) {
            // Already closed
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
