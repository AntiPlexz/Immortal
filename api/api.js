const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000; // Render-assigned port
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;

app.use(cors());
app.use(express.json());

// Generate key endpoint (no password)
app.post('/generate', async (req, res) => {
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

// Validate endpoint (no password)
app.post('/validate', (req, res) => {
  res.json({ success: true });
});

// Start server
app.listen(PORT, () => console.log(`Immortal API listening on port ${PORT}`));
