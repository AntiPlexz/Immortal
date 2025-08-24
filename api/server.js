const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let keys = {};
const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "SUPER_SECRET_123";

app.post("/generate", async (req, res) => {
  const token = req.headers["authorization"];
  if (token !== ADMIN_TOKEN) return res.status(403).json({ error: "Forbidden" });

  const key = Math.random().toString(36).substr(2, 8).toUpperCase();
  const expires = Date.now() + 1000 * 60 * 60;
  keys[key] = { expires };

  await fetch(DISCORD_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [{
        title: "🔑 New Key Generated",
        description: `Here is your key: **${key}**`,
        color: 0x00ff00,
        footer: { text: "Valid for 1 hour" }
      }]
    })
  });

  res.json({ success: true, key });
});

app.get("/validate", (req, res) => {
  const { key } = req.query;
  if (keys[key] && Date.now() < keys[key].expires) res.json({ valid: true });
  else res.json({ valid: false });
});

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Immortal API running on port ${PORT}`));
