import {ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, Client,} from "discord.js";
import {Command} from "../Command";
import {processOpenAIError} from "../utils/discord";
import {getGptAnswer,} from "../utils/openai";

export const Answer: Command = {
    name: "answer",
    description: "Répond à une question",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "prompt",
            description: "Posez moi une question",
            required: true,
        }
    ],
    run: async (client: Client, interaction: ChatInputCommandInteraction) => {
        const uuid = interaction.user.id;
        const prompt = interaction.options.getString("prompt");

        if (prompt == null) {
            await interaction.reply("Prompt must exist.");
            return;
        }

        await interaction.deferReply();

        try {
            const content = await getGptAnswer(prompt, interaction.user.username);

            interaction
                .followUp({content})
                .catch(console.error);
        } catch (e) {
            const response = processOpenAIError(e as any, prompt);
            interaction.followUp({...response}).catch(console.error);
        }
    },
};
