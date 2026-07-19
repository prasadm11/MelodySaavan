const express = require('express');
const path = require('path');
const { launchCaptchaHelper } = require('./browserHelper');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// In-memory store for solved CAPTCHA tokens (mapped by phoneNumber)
const activeCaptchas = new Map();

// Endpoint to launch Playwright browser helper for JioSaavn login CAPTCHA
app.get('/api/launch-captcha', (req, res) => {
  const phoneNumber = req.query.phoneNumber || req.query.phone || '';
  
  // Clear any existing captcha for this phone before starting a new helper session
  if (phoneNumber) {
    activeCaptchas.delete(phoneNumber);
  }

  // Launch Playwright in background (don't block the HTTP response)
  launchCaptchaHelper(phoneNumber, PORT).catch(err => {
    console.error('Error in launchCaptchaHelper:', err);
  });

  res.json({ success: true, message: 'Browser helper launched.' });
});

// Endpoint for Playwright script to submit the solved captcha token
app.get('/api/submit-captcha', (req, res) => {
  const phoneNumber = req.query.phoneNumber || req.query.phone || '';
  const token = req.query.recaptchaResponse || '';

  if (phoneNumber && token) {
    activeCaptchas.set(phoneNumber, token);
    console.log(`[CAPTCHA] Saved token for phone: ${phoneNumber}`);
    res.json({ success: true, message: 'Captcha submitted successfully.' });
  } else {
    res.status(400).json({ success: false, message: 'Missing phoneNumber or recaptchaResponse.' });
  }
});

// Endpoint for frontend to check if captcha has been solved
app.get('/api/check-captcha', (req, res) => {
  const phoneNumber = req.query.phoneNumber || req.query.phone || '';

  if (phoneNumber && activeCaptchas.has(phoneNumber)) {
    const token = activeCaptchas.get(phoneNumber);
    activeCaptchas.delete(phoneNumber); // consume token
    res.json({ success: true, token });
  } else {
    res.json({ success: false });
  }
});


// Fallback to index.html for Single Page App routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` MelodySaavan server running at http://localhost:${PORT}`);
  console.log(`==================================================`);
});

