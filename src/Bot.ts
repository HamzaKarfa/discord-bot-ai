import {DISCORD_BOT_CLIENT_ID, DISCORD_BOT_TOKEN} from "./utils/constants";

import {Client, Partials} from "discord.js";
import ready from "./listeners/ready";
//import interactionCreate from "./listeners/interactionCreate";
import messageCreate from "./listeners/messageCreate";

// Scopes required:
// bot: Send Messages, Attach Files, Use Slash Commands
console.log("Use this link to add the bot to your server!");
console.log(
    `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_BOT_CLIENT_ID}&permissions=2147518464&scope=bot`
);

const client = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildMessageTyping",
        "GuildMessageReactions",
        "DirectMessages",
        "DirectMessageTyping",
        "DirectMessageReactions",
        "MessageContent",
    ],
    partials: [Partials.Channel]
});

ready(client);
messageCreate(client);

client.login(DISCORD_BOT_TOKEN);
