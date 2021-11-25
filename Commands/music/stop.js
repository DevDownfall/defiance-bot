module.exports = {
    name: "stop",
    category: "music",
    description: "Stop playing music",
    run: async (client, message, args, con, tools) => {
        const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
        const { canModifyQueue } = require("../../Utils/Music/CoreUtil");
        const queue = client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;

        const { channel } = message.member.voice;

        queue.songs = [];
        queue.textChannel.send(`⏹ stopped the music!`).catch(console.error);

        try {
            queue.connection.dispatcher.end();
        } catch (error) {
            console.error(error);
            queue.connection.disconnect();
        }
    }
}