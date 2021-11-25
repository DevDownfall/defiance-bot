const ms = require('ms')
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "slowmode",
    aliases: ["sm"],
    category: "moderation",
    description: "Enable slowmode in a channel. (ADMIN)",
    perms: "Staff",
    run: async (client, message, args, tools) => {

        message.delete();

        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            message.delete();
            return message.reply("you require the permission \`MANAGE_MESSAGES\` to use this command.").then(m => m.delete({ timeout: 5000 }));
        }

        var stime = args[0]

        if (!stime) {
            message.delete();
            message.channel.send(`You did not specify the time that you wish to set this channel's slow mode too! ex. 1s, 1m, 1h`).then(m => m.delete({ timeout: 5000 }));
        }

        let reason = args.slice(1).join(" ")
        if (!reason) { reason = "No reason provided"; }

        if (ms(stime) / 1000 > 21600) {
            return message.channel.send(`You've gone passed the max time!`);
        }

        message.channel.send(`Added slowmode to this channel **${stime}** with the reason: **${reason}**`).then(msg => msg.delete({ timeout: 2000 }));
        message.channel.setRateLimitPerUser(ms(stime) / 1000, reason);

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