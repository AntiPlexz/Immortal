const res = await fetch(`${process.env.API_URL}/generate`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: "{}"
});

const data = await res.json();
if (data.success) {
  message.channel.send(`✅ New key: ${data.key}`);
} else {
  message.channel.send(`❌ Failed to generate key`);
}
