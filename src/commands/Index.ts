import {ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, Client,} from "discord.js";
import {Command} from "../Command";
import {processOpenAIError} from "../utils/discord";
import {openai,} from "../utils/openai";
import axios from "axios";
import {OPENAI_API_KEY} from "../utils/constants";

export const Answer: Command = {
    name: "index",
    description: "Faire lire ce channel à Kafbot",
    type: ApplicationCommandType.ChatInput,
    options: [
    ],
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const uuid = interaction.user.id;
        interaction.reply("Je lis le channel. Ca va prendre un peu de temps.").catch(console.error);

        try  {
            const apiResponse = await axios.post("https://api.openai.com/v1/chat/completions", {
                model: "gpt-3.5-turbo",
                messages: [
                ],
                max_tokens: 2048,
                temperature: 1.0,
            }, {
                headers: {
                    ContentType: "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`
                }
            })
            let response = apiResponse.data?.choices?.[0]?.message?.content
            if (!response) {
                response = "Je n'ai pas compris votre question."
            }
            interaction
                .followUp({content: `> <@${uuid}> a demandé : ${prompt}\n\n ${response.substring(0, 2000)}`})
                .catch(console.error);
        } catch (e) {
            const response = processOpenAIError(e as any, prompt);
            interaction.followUp({...response}).catch(console.error);
        }
    },
};
