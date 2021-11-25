module.exports = {
    name: "queue",
    category: "music",
    description: "Show the music queue and now playing.",
    run: async (client, message, args, con, tools) => {
        const functions = require('@functions');
        const { MessageEmbed, splitMessage, escapeMarkdown } = require("discord.js");
        const { canModifyQueue } = require("../../Utils/Music/CoreUtil");
        const queue = client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;

        const description = queue.songs.map((song, index) => `${index + 1}. ${escapeMarkdown(song.title)}`);


        let queueEmbed = new MessageEmbed()
            .setTitle(`${functions.embedTitle} - Music Queue`)
            .setDescription(description)
            .setColor(tools.default_color);

        const splitDescription = splitMessage(description, {
            maxLength: 2048,
            char: "\n",
            prepend: "",
            append: ""
        });

        splitDescription.forEach(async (m) => {
            queueEmbed.setDescription(m);
            message.channel.send(queueEmbed);
        });
    }
}