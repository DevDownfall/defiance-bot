
const { MessageEmbed } = require("discord.js");
const Helper = require('@helper')

module.exports = {
    name: "ban",
    category: "moderation",
    description: "Bans user from the discord (ADMIN)",
    usage: "<id | mention> <reason>",
    perms: 'Staff',
    run: async (client, message, args, tools) => {

        if (!message.member.hasPermission("BAN_MEMBERS")) {
            message.delete();
            return message.reply("you require the permission \`BAN_MEMBERS\` to use this command.").then(m => m.delete({ timeout: 5000 }));
        } 

        if (message.deletable) message.delete();

        if (!args[1]) { return message.reply("please provide a person to ban.").then(m => m.delete({ timeout: 5000 })); }
        

        const toBan = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!toBan) { return message.reply("couldn't find that member, please try again.").then(m => m.delete({ timeout: 5000 })); }
        if (toBan.id === message.author.id) { return message.reply("you can't ban yourself").then(m => m.delete({ timeout: 5000 })); }
        if (!toBan.bannable) { return message.reply("I can't ban that person due to role hierarchy.").then(m => m.delete({ timeout: 5000 })); }

        let embed = new MessageEmbed()
            .setAuthor(client.embedTitle, client.embedURL)
            .setColor(client.embedColor)
            .setDescription(`
            **User Banned - LOG**
            - Banned User: ${toBan} | ${toBan.id}
            - Banned By:   ${message.member} | ${message.member.id}
            - Ban Reason:  ${args.slice(1).join(" ")}
            `)
            .setFooter(client.embedFooter, client.embedURL)
            .setThumbnail(toBan.user.displayAvatarURL())
            .setTimestamp()

        let confirmEmbed = new MessageEmbed()
            .setColor(client.embedColor)
            .setDescription(`Are you sure that you want to ban ${toBan}?`)
            .setFooter(`This verification becomes invalid after 30s.`)

        const Server = await Helper.selectData(`SELECT * FROM servers WHERE server_id = ?`, [ message.guild.id ])
            var logChannel = message.guild.channels.cache.get(Server.logs_id);

            message.channel.send(confirmEmbed).then(async msg => {
            msg.react('✅').catch(function (err) { });
            msg.react('❌').catch(function (err) { });
            const filter = (reaction, user) => ["✅", "❌"].includes(reaction.emoji.name) && user.id === message.author.id;
            const collector = msg.createReactionCollector(filter, { max: 1, time: 30000 });
            collector.on('end', async collected => {
                var emoji = collected.first().emoji.name;
                if (!emoji) return message.reply(`Times up! Action cancelled.`);
                if (emoji == '✅') {
                    msg.delete();
                    await toBan.send(`You have been banned from ${message.guild.name}\nReason: ${args.slice(1).join(" ")}`).catch(function (err) { message.reply(`couldnt send dm to user`) })
                    toBan.ban({reason: args.slice(1).join(" ")}).catch(function (err) { return message.reply(`system failed to ban user!`)})
                    message.reply(`I've banned ${toBan}`)
                    if (!logChannel) return message.author.send(`We couldn't find a log channel to send the log of the ban! Use the setup to select one!`);
                    logChannel.send(embed).catch(function (err) { message.reply(`failed to send to logs`) });
                }
                if (emoji == '❌') {
                    msg.delete();
                    message.reply(`ban action cancelled`);
                }
            });
        });  
    }
}