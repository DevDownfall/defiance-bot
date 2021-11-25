const { MessageEmbed } = require("discord.js");
const Helper = require('@helper')

module.exports = {
    name: "kick",
    category: "moderation",
    description: "Kicks user from the discord (ADMIN)",
    usage: "<id | mention> <reason>",
    perms: 'Staff',
    run: async (client, message, args, tools) => {

        if (!message.member.hasPermission("KICK_MEMBERS")) {
            message.delete();
            return message.reply("you require the permission \`KICK_MEMBERS\` to use this command.");
        }

        if (message.deletable) message.delete();

        if (!args[0]) { return message.reply("please provide a person to kick.")}
        if (!args[1]) { return message.reply("please provide a reason to kick.")}

        const toKick = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!toKick) { return message.reply("couldn't find that member, please try again.")}
        if (toKick.id === message.author.id) { return message.reply("you can't kick yourself")}
        if (!toKick.bannable) { return message.reply("I can't kick that person due to role hierarchy.")}

        let embed = new MessageEmbed()
            .setAuthor(client.embedTitle, client.embedURL)
            .setColor(client.embedColour)
            .setDescription(`
            **User Kicked - LOG**
            - Kicked User:  ${toKick} | ${toKick.id}
            - Kicked By:    ${message.member} | ${message.member.id}
            - Kick Reason:  ${args.slice(1).join(" ")}
            `)
            .setFooter(client.embedFooter, client.embedURL)
            .setThumbnail(toKick.user.displayAvatarURL())
            .setTimestamp()

        const Server = await Helper.selectData(`SELECT * FROM server WHERE server_id = ?`, [ message.guild.id ])

        var logChannel = message.guild.channels.cache.get(Server.logs_id);

        message.delete();
        await toKick.send(`You have been kicked from ${message.guild.name}\nReason: ${args.slice(1).join(" ")}`)
        toKick.kick(args.slice(1).join(" ")).catch(function (err) { return message.reply(`system failed to kick user!`)})
        if (!logChannel) return message.author.send(`We couldn't find a log channel to send the log of the ban! Use the setup to select one!`);
        logChannel.send(embed).catch(function (err) { message.reply(`failed to send to logs`) });
    }
}