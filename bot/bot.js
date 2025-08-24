const { Client, GatewayIntentBits } = require("discord.js");
const fetch = require("node-fetch");

// Helper function
async function callApi(endpoint, body = {}) {
  try {
    const res = await fetch(`${process.env.API_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    return data;
  } catch (err) {
    console.error(`Error calling ${endpoint}:`, err);
    return { success: false, error: "ImmortalBot ❌ Error: Could not contact the API. So try harder next time bitch." };
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Command: !generate
  if (message.content === "!generate") {
    const generateData = await callApi("generate");
    if (generateData.success) {
      message.channel.send(`ImmortalBot ✅ New key: \`${generateData.key}\``);
    } else {
      message.channel.send(generateData.error || "ImmortalBot ❌ Failed to generate key");
    }
  }

  // Command: !validate <key>
  if (message.content.startsWith("!validate")) {
    const keyToValidate = message.content.split(" ")[1]; // grab key after command
    if (!keyToValidate) {
      return message.channel.send("ImmortalBot ❌ Please provide a key to validate.");
    }

    const validateData = await callApi("validate", { key: keyToValidate });
    if (validateData.success) {
      message.channel.send("ImmortalBot ✅ Key is valid!");
    } else {
      message.channel.send(validateData.error || "ImmortalBot ❌ Key is invalid.");
    }
  }
});

client.login(process.env.BOT_TOKEN);
