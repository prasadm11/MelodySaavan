const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const { launchCaptchaHelper } = require('./browserHelper');
const { spawn } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

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


// Proxy endpoint for downloading songs to bypass CORS restrictions
app.get('/api/proxy-download', (req, res) => {
  const mediaUrl = req.query.url;
  let fileName = req.query.filename || 'song.mp3';

  if (!mediaUrl) {
    return res.status(400).send('Missing url parameter.');
  }

  // Ensure filename ends in .mp3 since we convert to mp3
  if (!fileName.toLowerCase().endsWith('.mp3')) {
    fileName = fileName.replace(/\.[^/.]+$/, '') + '.mp3';
  }

  // Set download headers for MP3
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
  
  let ffmpegProcess = null;

  // Cleanup child process on request close
  req.on('close', () => {
    if (ffmpegProcess) {
      ffmpegProcess.kill();
    }
  });

  // Recursive function to fetch and follow HTTP/HTTPS redirects
  function streamWithRedirects(url, redirectCount = 0) {
    if (redirectCount > 5) {
      return res.status(500).send('Too many redirects.');
    }

    const client = url.startsWith('https') ? https : http;

    client.get(url, (proxyRes) => {
      // Check for HTTP redirects (301, 302, 303, 307, 308)
      if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
        let redirectUrl = proxyRes.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const parsedUrl = new URL(url);
          redirectUrl = parsedUrl.origin + redirectUrl;
        }
        return streamWithRedirects(redirectUrl, redirectCount + 1);
      }

      // Check for successful response
      if (proxyRes.statusCode !== 200) {
        return res.status(proxyRes.statusCode).send('Failed to fetch source audio.');
      }

      // Spawn ffmpeg to transcode AAC (m4a/mp4) to MP3 on-the-fly
      ffmpegProcess = spawn(ffmpeg.path, [
        '-i', 'pipe:0',          // Input from stdin
        '-f', 'mp3',             // Output format
        '-acodec', 'libmp3lame',    // MP3 codec
        '-ab', '320k',           // High quality 320kbps bitrate
        'pipe:1'                 // Output to stdout
      ]);

      // Pipe source stream to ffmpeg stdin
      proxyRes.pipe(ffmpegProcess.stdin);

      // Pipe ffmpeg stdout to response
      ffmpegProcess.stdout.pipe(res);

      ffmpegProcess.on('error', (err) => {
        console.error('ffmpeg spawn error:', err);
        if (!res.headersSent) {
          res.status(500).send('ffmpeg conversion failed.');
        }
      });
    }).on('error', (err) => {
      console.error('Proxy download error:', err);
      if (!res.headersSent) {
        res.status(500).send('Failed to proxy download.');
      }
    });
  }

  streamWithRedirects(mediaUrl);
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

