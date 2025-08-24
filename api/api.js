const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000; // Use Render-assigned port
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

app.use(cors());
app.use(express.json());

// Function to check authorization header
function checkAuth(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'] || '';
  return authHeader.trim() === ADMIN_TOKEN;
}

// Generate key endpoint
app.post('/generate', async (req, res) => {
  if (!checkAuth(req)) return res.status(403).json({ success: false, message: "Unauthorized" });

  const key = Math.random().toString(36).substring(2, 10).toUpperCase();

  // Send key to Discord webhook if provided
  if (DISCORD_WEBHOOK) {
    try {
      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `New key: ${key}` })
      });
    } catch (err) {
      console.error('Failed to send to Discord webhook:', err);
    }
  }

  res.json({ success: true, key });
});

// Validate key endpoint
app.post('/validate', (req, res) => {
  if (!checkAuth(req)) return res.status(403).json({ success: false, message: "Unauthorized" });
  res.json({ success: true });
});

// Start server on Render-assigned port
app.listen(PORT, () => console.log(`Immortal API listening on port ${PORT}`));
