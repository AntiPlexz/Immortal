try {
  const res = await fetch(`${process.env.API_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });

  const data = await res.json();

  if (data.success) {
    message.channel.send(`✅ New key: ${data.key}`);
  } else {
    message.channel.send(`❌ Failed to generate key`);
  }
} catch (err) {
  console.error("Error generating key:", err);
  message.channel.send("❌ Error: Could not contact the API.");
}
