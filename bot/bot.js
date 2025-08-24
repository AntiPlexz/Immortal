const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,                 // Required for guild info
        GatewayIntentBits.GuildMessages,          // To receive messages
        GatewayIntentBits.MessageContent          // To read message content
    ]
});
