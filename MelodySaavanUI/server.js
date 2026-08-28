const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const compression = require('compression');
const { launchCaptchaHelper } = require('./browserHelper');
const { spawn } = require('child_process');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');

const app = express();
const PORT = process.env.PORT || 3000;

// Disable fingerprinting
app.disable('x-powered-by');

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Response Compression (Gzip / Brotli)
app.use(compression({
  filter: (req, res) => {
    // Avoid compressing streaming binary audio
    if (req.path.startsWith('/api/proxy-download')) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Serve static files with caching headers
app.use(express.static(__dirname, {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// In-memory store for solved CAPTCHA tokens with TTL & size limiting
const MAX_CAPTCHA_STORE_SIZE = 100;
const CAPTCHA_TTL_MS = 5 * 60 * 1000; // 5 minutes
const activeCaptchas = new Map(); // key -> { token, expiresAt }

function cleanExpiredCaptchas() {
  const now = Date.now();
  for (const [key, item] of activeCaptchas.entries()) {
    if (item.expiresAt <= now) {
      activeCaptchas.delete(key);
    }
  }
}

// Periodic cleanup of stale tokens
const cleanupInterval = setInterval(cleanExpiredCaptchas, 60 * 1000);
cleanupInterval.unref();

function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') return '';
  const cleaned = phone.replace(/[^0-9+]/g, '');
  return (cleaned.length >= 10 && cleaned.length <= 16) ? cleaned : '';
}

// Concurrency lock for browser CAPTCHA helper
let isCaptchaHelperActive = false;
let captchaHelperStartTime = 0;
const HELPER_LOCK_TIMEOUT_MS = 180000; // 3 minutes max lock duration

// Endpoint to launch Playwright browser helper for JioSaavn login CAPTCHA
app.get('/api/launch-captcha', (req, res) => {
  const phoneNumber = sanitizePhone(req.query.phoneNumber || req.query.phone || '');
  const now = Date.now();

  // Reset lock if expired
  if (isCaptchaHelperActive && (now - captchaHelperStartTime > HELPER_LOCK_TIMEOUT_MS)) {
    isCaptchaHelperActive = false;
  }

  if (isCaptchaHelperActive) {
    return res.status(429).json({
      success: false,
      message: 'A CAPTCHA verification helper session is already active. Please complete it in the opened browser or wait.'
    });
  }

  if (phoneNumber) {
    activeCaptchas.delete(phoneNumber);
  }

  isCaptchaHelperActive = true;
  captchaHelperStartTime = now;

  launchCaptchaHelper(phoneNumber, PORT)
    .catch(err => {
      console.error('Error in launchCaptchaHelper:', err.message);
    })
    .finally(() => {
      isCaptchaHelperActive = false;
    });

  res.json({ success: true, message: 'Browser helper launched.' });
});

// Endpoint for Playwright script to submit the solved captcha token
app.get('/api/submit-captcha', (req, res) => {
  const phoneNumber = sanitizePhone(req.query.phoneNumber || req.query.phone || '');
  const token = typeof req.query.recaptchaResponse === 'string' ? req.query.recaptchaResponse.trim() : '';

  if (phoneNumber && token && token.length <= 4096) {
    cleanExpiredCaptchas();

    // Prevent memory bloat
    if (activeCaptchas.size >= MAX_CAPTCHA_STORE_SIZE) {
      const oldestKey = activeCaptchas.keys().next().value;
      if (oldestKey) activeCaptchas.delete(oldestKey);
    }

    activeCaptchas.set(phoneNumber, {
      token,
      expiresAt: Date.now() + CAPTCHA_TTL_MS
    });

    console.log(`[CAPTCHA] Saved token for phone: ${phoneNumber}`);
    res.json({ success: true, message: 'Captcha submitted successfully.' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid or missing phoneNumber / recaptchaResponse.' });
  }
});

// Endpoint for frontend to check if captcha has been solved
app.get('/api/check-captcha', (req, res) => {
  const phoneNumber = sanitizePhone(req.query.phoneNumber || req.query.phone || '');

  if (phoneNumber && activeCaptchas.has(phoneNumber)) {
    const entry = activeCaptchas.get(phoneNumber);
    activeCaptchas.delete(phoneNumber); // consume token (one-time use)

    if (entry.expiresAt > Date.now()) {
      return res.json({ success: true, token: entry.token });
    }
  }

  res.json({ success: false });
});

// SSRF validation helper
function isAllowedMediaUrl(urlString) {
  try {
    const parsed = new URL(urlString);
    
    // Only allow HTTP/HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return false;
    }

    const hostname = parsed.hostname.toLowerCase();

    // Disallow localhost / loopback
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '0.0.0.0') {
      return false;
    }

    // Disallow AWS/cloud metadata services
    if (hostname === '169.254.169.254' || hostname.startsWith('169.254.')) {
      return false;
    }

    // Disallow RFC1918 private IPv4 ranges
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
        /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
        /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return false;
    }

    // Allow JioSaavn media CDN domains and trusted origins
    const allowedDomainPatterns = [
      /\.saavncdn\.com$/,
      /\.jiosaavn\.com$/,
      /\.onrender\.com$/,
      /^saavncdn\.com$/,
      /^jiosaavn\.com$/
    ];

    const isMatch = allowedDomainPatterns.some(pattern => pattern.test(hostname));
    return isMatch;
  } catch {
    return false;
  }
}

// Sanitize filename to prevent header injection and directory traversal
function sanitizeFilename(rawName) {
  if (!rawName || typeof rawName !== 'string') {
    return 'song.mp3';
  }
  // Strip path traversal and control characters/newlines
  let clean = rawName.replace(/[/\\?%*:|"<>]/g, '_').replace(/[\r\n\x00-\x1f\x7f]/g, '').trim();
  if (!clean.toLowerCase().endsWith('.mp3')) {
    clean = clean.replace(/\.[^/.]+$/, '') + '.mp3';
  }
  return clean || 'song.mp3';
}

// Proxy endpoint for downloading songs with SSRF protection & on-the-fly MP3 transcoding
app.get('/api/proxy-download', (req, res) => {
  const mediaUrl = req.query.url;
  const fileName = sanitizeFilename(req.query.filename);

  if (!mediaUrl || typeof mediaUrl !== 'string') {
    return res.status(400).send('Missing or invalid url parameter.');
  }

  if (!isAllowedMediaUrl(mediaUrl)) {
    return res.status(403).send('Forbidden: Requested URL domain is not allowed.');
  }

  // Set download headers
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);

  let ffmpegProcess = null;
  let activeUpstreamReq = null;
  let isClosed = false;

  // Cleanup child process and upstream request on client disconnect
  req.on('close', () => {
    isClosed = true;
    if (activeUpstreamReq) {
      try { activeUpstreamReq.destroy(); } catch {}
    }
    if (ffmpegProcess) {
      try { ffmpegProcess.kill('SIGKILL'); } catch {}
    }
  });

  // Fetch with safe redirect handling
  function streamWithRedirects(url, redirectCount = 0) {
    if (isClosed) return;

    if (redirectCount > 5) {
      if (!res.headersSent) {
        return res.status(500).send('Too many redirects.');
      }
      return;
    }

    if (!isAllowedMediaUrl(url)) {
      if (!res.headersSent) {
        return res.status(403).send('Forbidden: Redirect target domain is not allowed.');
      }
      return;
    }

    const client = url.startsWith('https') ? https : http;

    activeUpstreamReq = client.get(url, { timeout: 15000 }, (proxyRes) => {
      if (isClosed) return;

      // Handle HTTP redirects (301, 302, 303, 307, 308)
      if (proxyRes.statusCode >= 300 && proxyRes.statusCode < 400 && proxyRes.headers.location) {
        let redirectUrl = proxyRes.headers.location;
        if (!redirectUrl.startsWith('http')) {
          try {
            const parsedUrl = new URL(url);
            redirectUrl = new URL(redirectUrl, parsedUrl.origin).toString();
          } catch {
            if (!res.headersSent) res.status(400).send('Invalid redirect URL.');
            return;
          }
        }
        return streamWithRedirects(redirectUrl, redirectCount + 1);
      }

      if (proxyRes.statusCode !== 200) {
        if (!res.headersSent) {
          return res.status(proxyRes.statusCode).send('Failed to fetch source audio.');
        }
        return;
      }

      // Spawn ffmpeg to transcode AAC (m4a/mp4) to MP3 on-the-fly
      ffmpegProcess = spawn(ffmpeg.path, [
        '-i', 'pipe:0',          // Input from stdin
        '-f', 'mp3',             // Output format
        '-acodec', 'libmp3lame', // MP3 codec
        '-ab', '320k',           // 320kbps bitrate
        'pipe:1'                 // Output to stdout
      ]);

      proxyRes.pipe(ffmpegProcess.stdin);
      ffmpegProcess.stdout.pipe(res);

      proxyRes.on('error', (err) => {
        console.error('Source audio stream error:', err.message);
        if (ffmpegProcess) {
          try { ffmpegProcess.kill('SIGKILL'); } catch {}
        }
      });

      ffmpegProcess.on('error', (err) => {
        console.error('ffmpeg process error:', err.message);
        if (!res.headersSent) {
          res.status(500).send('ffmpeg conversion failed.');
        }
      });

      ffmpegProcess.stdin.on('error', () => {
        // Handle broken pipe gracefully when client disconnects
      });
    });

    activeUpstreamReq.on('timeout', () => {
      activeUpstreamReq.destroy();
      if (!res.headersSent) {
        res.status(504).send('Upstream gateway timeout.');
      }
    });

    activeUpstreamReq.on('error', (err) => {
      if (isClosed) return;
      console.error('Proxy download error:', err.message);
      if (!res.headersSent) {
        res.status(500).send('Failed to proxy download.');
      }
    });
  }

  streamWithRedirects(mediaUrl);
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(` MelodySaavan server running at http://localhost:${PORT}`);
  console.log(`==================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});
