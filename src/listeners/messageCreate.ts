import {ChannelType, Client, Collection, Message, MessageType,} from "discord.js";
import {LOG_ERRORS} from "../utils/constants";
import {getGptAnswer} from "../utils/openai";
import {AxiosError} from "axios";

export default (client: Client): void => {
    client.on("messageCreate", async (message) => {
        try {
            if (message.author.bot) return;
            if (message.content.includes("@here") || message.content.includes("@everyone")) return;

            const isGael = message.author.id === "314590573543555075";
            const isPedro = message.author.id === "372680964436131841";
            const isDM = message.channel.type === ChannelType.DM;
            const hasBeenMentioned = message.mentions.has(client.user!.id);

            if ((isDM && !isGael && !isPedro) || (!isDM && !hasBeenMentioned)) return;

            //await message.react("🤖");
            // @ts-ignore

            message.channel.sendTyping();

            // @ts-ignore
            const previousMessagesCollection: Collection<string, Message> = await message.channel.messages.fetch({limit: 10});

            if (previousMessagesCollection.size > 1 && previousMessagesCollection.first()?.content === "<@1081322411410063463>") {
                // @ts-ignore
                previousMessagesCollection.at(1).content = previousMessagesCollection.first()?.content + " " + previousMessagesCollection.at(1).content;
                // @ts-ignore
                previousMessagesCollection.delete(previousMessagesCollection.firstKey());
            }
            const previousMessages = previousMessagesCollection
                .reverse()
                .map((m) => m.author.username + ": " + m.content);

            console.log(previousMessages);

            let content = await getGptAnswer(previousMessages);

            for(let chunk of content.match(/[\s\S]{1,1995}/g) || []) {
                await message.reply(chunk);
            }

        } catch (error) {
            if (LOG_ERRORS) {
                console.log(error instanceof AxiosError
                    ? error.message + " " + JSON.stringify(error.response?.data)
                    : error
                );
            }
            await message.reply("Désolé, une erreur a eu lieu. Sans doute que les 10 derniers messages sont trop longs.");
        }
    });
};