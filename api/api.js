const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;

app.use(cors());
app.use(express.json());

app.post('/generate', (req, res) => {
  const auth = req.headers['authorization'] || req.headers['Authorization'];
  if (auth !== ADMIN_TOKEN) return res.status(403).json({ success: false, message: "Unauthorized" });

  const key = Math.random().toString(36).substring(2, 10).toUpperCase();

  // Send key to Discord webhook
  fetch(DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: `New key: ${key}` })
  });

  res.json({ success: true, key });
});

app.post('/validate', (req, res) => {
  // For demo, just return success
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Immortal API listening on port ${PORT}`));
