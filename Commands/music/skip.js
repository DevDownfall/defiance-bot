module.exports = {
    name: "queue",
    category: "music",
    description: "Skip the currently playing song",
    run: async (client, message, args, con, tools) => {
        const functions = require('@functions.js');
        const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
        const { canModifyQueue } = require("../../Utils/Music/CoreUtil");
        const queue = client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;

        queue.playing = true;
        queue.connection.dispatcher.end();
        queue.textChannel.send(`${message.author} ⏭ skipped the song`).catch(console.error);
    }
}