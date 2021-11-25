const con = require('@database')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "announce",
    category: "info",
    description: "Create an embed announcement (Admin)",
    perms: "Staff",
    run: async (client, message, args, tools) => {

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            if(message.member.roles.cache.find(r => r.name === "6mans Mod")){}else{ return message.reply("You do not have permission to use this command. Please contact an administrator or 6mans mod.").then(m => m.delete({ timeout: 5000 })); }
        }

        role = '';
        title = '';
        description = '';
        imageurl = '';
        channelid = '';

        async function roleFunc() {
            message.channel.send(`Please specify a role!`).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    collected.first().content.toLowerCase() == 'skip' ? role = '' : role = collected.first().content;
                    msg.delete({ timeout: 500 });
                    titleFunc();
                });
            });
        }

        roleFunc();

        async function titleFunc() {
            message.channel.send(`Please give me a title!`).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    collected.first().content.toLowerCase() == 'skip' ? title = '' : title = collected.first().content;
                    msg.delete({ timeout: 500 });
                    descriptionFunc();
                });
            });
        }

        async function descriptionFunc() {
            message.channel.send(`Please give me a description!`).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    collected.first().content.toLowerCase() == 'skip' ? description = '' : description = collected.first().content;
                    msg.delete({ timeout: 500 });
                    imageurlFunc();
                });
            });
        }

        async function imageurlFunc() {
            message.channel.send(`Please give me a image url!`).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    collected.first().content.toLowerCase() == 'skip' ? imageurl = '' : imageurl = collected.first().content;
                    msg.delete({ timeout: 500 });
                    channelidFunc();
                });
            });
        }

        async function channelidFunc() {
            message.channel.send(`Please give me a channel id!`).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    collected.first().content.toLowerCase() == 'skip' ? channelid = '' : channelid = collected.first().content;
                    msg.delete({ timeout: 500 });
                    done();
                });
            });
        }

        async function done() {
            var embed = new MessageEmbed()
                .setAuthor(`${message.author.username}`, `${message.author.displayAvatarURL()}`)
                .setColor(client.embedColour)

            if (description != '') embed.setDescription(description);
            if (imageurl != '') embed.setImage(imageurl);
            if (title != '') embed.setTitle(title);

            const channel = message.guild.channels.cache.get(channelid);
            if (!channel) return message.reply(`Invalid channel id`);

            if (role != '') {
                if (isNaN(role)) {
                    channel.send(role).then(msg => {
                        msg.delete({ timeout: 300 });
                    }).catch(e => {
                        return message.reply(`Failed to ping role`);
                    })
                } else {
                    channel.send(`<@${role}>`).then(msg => {
                        msg.delete({ timeout: 300 });
                    }).catch(e => {
                        return message.reply(`Failed to ping role`);
                    })
                }
            }

            channel.send(embed).catch(e => {
                if (e) return message.reply(`Failed to send message`);
            });

        }

    }
}