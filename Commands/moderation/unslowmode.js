const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "unslowmode",
    aliases: ["usm"],
    category: "moderation",
    description: "Disable slowmode in a channel. (ADMIN)",
    perms: 'Staff',
    run: async (client, message, args, con, tools) => {

        message.delete();

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            message.delete();
            return message.reply("you require the permission \`MANAGE_MESSAGES\` to use this command.").then(m => m.delete({ timeout: 5000 }));
        }

        message.channel.setRateLimitPerUser(0);

        message.reply(`Removed slowmode from this channel!`).then(msg => msg.delete({timeout:2000}));

        let embed = new MessageEmbed()
            .setAuthor(client.embedTitle, client.embedURL)
            .setColor(client.embedColour)
            .setDescription(`
            **Channel Slowmode - LOG**
            - Channel Slowed: ${message.channel} | ${message.channel.id}
            - Slowed By: ${message.member} | ${message.member.id}
            - Reason: ${reason}
            `)
            .setFooter(client.embedFooter, client.embedURL)
            .setThumbnail(message.member.user.displayAvatarURL())
            .setTimestamp()


        var logChannel = message.guild.channels.cache.get(tools.logs_id);
        if (!logChannel) return message.author.send(`We couldn't find a log channel to send the log of the slowmode! Use the setup to select one!`);
        logChannel.send(embed).catch(function (err) { message.reply(`failed to send to logs`) });        

    }
}