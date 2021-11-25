const { MessageEmbed } = require("discord.js");
const Helper = require('@helper')
const con = require('@database')

module.exports = {
    name: "reaction-roles",
    category: "setup",
    description: "Setup reaction roles (Admin)",
    aliases: ['rr'],
    perms: "Admin",
    usage: "",
    id: 'pc2',
    run: async (client, message, args, tools) => {

        message.delete();

        var qEmbed = new MessageEmbed()
            .setTitle(`Reaction Roles`)
            .setColor(client.embedColor)

        var command = args[0];
        if(!command) return message.reply(`sorry, please specify an action, whether you want to add, remove, or clear.`)
 
        if (command.toLowerCase() == 'add' || command.toLowerCase() == 'remove' || command.toLowerCase() == 'clear') {

            if (command.toLowerCase() == 'add') {
                addReaction_channelSelection();
            }

            if (command.toLowerCase() == 'remove') {
                removeReaction_channelSelect();
            }

            if (command.toLowerCase() == 'clear') {
                message.reply(`sorry, clear is not yet ready!`);
            }

        } else {
            message.reply(`sorry, please specify an action, whether you want to add, remove, or clear.`)
        }

        async function removeReaction_channelSelect() {
            message.channel.send(qEmbed.setDescription(`What channel is the message in?\nEx: \`#role-reactions\` or \`730275346678677599\``).setFooter(`Type \`cancel\` if you wish to cancel this action.`)).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    var channelID = collected.first().content; msg.delete({ timeout: 500 });
                    if (channelID.startsWith('<#') && channelID.endsWith('>')) {
                        var channelID = channelID.replace(`<#`, ''); var channelID = channelID.replace('>', '');
                    }
                    if (channelID.toLowerCase() == 'cancel') return;
                    if (!message.guild.channels.cache.get(channelID)) {
                        message.reply(`Invalid channel id please try again!`).then(msg => msg.delete({ timeout: 8000 }));
                        return removeReaction_channelSelect();
                    }
                    return removeReaction_messageSelection(channelID);
                });
            });
        }

        async function removeReaction_messageSelection(channelID) {
            message.channel.send(qEmbed.setDescription(`What's the message id?\nEx: \`730275346678677599\``).setFooter(`Type \`cancel\` if you wish to \`cancel\` this action.`)).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    var messageID = collected.first().content; msg.delete({ timeout: 500 });
                    if (messageID.toLowerCase() == 'cancel') return;
                    var c = message.guild.channels.cache.get(channelID);
                    if (!c.messages.fetch(messageID)) {
                        message.reply(`Invalid message id please try again!`).then(msg => msg.delete({ timeout: 8000 }));
                        return removeReaction_messageSelection(channelID);
                    }
                    return removeReaction_emojiSelection(channelID, messageID);
                });
            });
        }

        async function removeReaction_emojiSelection(channelID, messageID) {
            message.channel.send(qEmbed.setDescription(`What's the emoji, custom emoji, or emoji id?\nEx: 💎 or \`730275346678677599\``).setFooter(`Type \`cancel\` if you wish to cancel this action.`)).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    var emoji = collected.first().content; msg.delete({ timeout: 500 });
                    if (emoji.toLowerCase() == 'cancel') return;
                    if (emoji.startsWith('<:') && emoji.endsWith('>')) {
                        var emoji = emoji.replace('>', ''); var emoji = emoji.split(':'); var emoji = emoji[2];
                    }
                    return removeReaction_final(channelID, messageID, emoji);
                });
            });
        }

        async function removeReaction_final(channelID, messageID, emoji) {
            let remove_complete_embed = new MessageEmbed()
                .setTitle(`Removed Reaction Role`)
                .setColor(client.embedColor)
                .setDescription(`Successfully removed the reaction role from your specified message!`)

            con.query(`SELECT * FROM reaction_roles WHERE server_id=? AND channel_id=? AND message_id=? AND emoji=?`, [message.guild.id, channelID, messageID, emoji], function (err, rows) {
                if (err) return message.reply(`There was an error locating your reaction roles\nErr: ${err}`);
                if (rows && rows.length) {
                    con.query(`DELETE FROM reaction_roles WHERE server_id=? AND channel_id=? and message_id=? AND emoji=?`, [message.guild.id, channelID, messageID, emoji], function (err) {
                        if(err) return message.reply(`There was an error removing your reaction roles\nErr: ${err}`);
                    });
                    message.channel.send(remove_complete_embed);
                } else {
                    message.reply(`Hm, seems like I couldnt find a role reaction with your inputs.`)
                }
            });
        }

        async function addReaction_channelSelection() {
            message.channel.send(qEmbed.setDescription(`What channel is the message in?\nEx: \`#role-reactions\` or \`730275346678677599\``).setFooter(`Type \`cancel\` if you wish to cancel this action.`)).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    var channelID = collected.first().content; msg.delete({ timeout: 500 });
                    if (channelID.toLowerCase() == 'cancel') return;
                    if (channelID.startsWith('<#') && channelID.endsWith('>')) {
                        var channelID = channelID.replace(`<#`, ''); var channelID = channelID.replace('>', '');
                    }
                    if (!message.guild.channels.cache.get(channelID)) {
                        message.reply(`Invalid channel id please try again!`).then(msg => msg.delete({ timeout: 8000 }));
                        return addReaction_channelSelection();
                    }
                    return addReaction_messageSelection(channelID);
                });
            });
        }

        async function addReaction_messageSelection(channelID) {
            message.channel.send(qEmbed.setDescription(`What's the message id?\nEx: \`730275346678677599\``).setFooter(`Type \`cancel\` if you wish to \`cancel\` this action.`)).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    var messageID = collected.first().content; msg.delete({ timeout: 500 });
                    if (messageID.toLowerCase() == 'cancel') return;
                    var c = message.guild.channels.cache.get(channelID);
                    if (!c.messages.fetch(messageID)) {
                        message.reply(`Invalid message id please try again!`).then(msg => msg.delete({ timeout: 8000 }));
                        return addReaction_messageSelection(channelID);
                    }
                    return addReaction_emojiSelection(channelID, messageID);
                });
            });
        }

        async function addReaction_emojiSelection(channelID, messageID) {
            message.channel.send(qEmbed.setDescription(`What's the emoji, custom emoji, or emoji id?\nEx: 💎 or \`730275346678677599\``).setFooter(`Type \`cancel\` if you wish to cancel this action.`)).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    var emoji = collected.first().content; msg.delete({ timeout: 500 });
                    if (emoji.toLowerCase() == 'cancel') return;
                    if (emoji.startsWith('<:') && emoji.endsWith('>')) {
                        var emoji = emoji.replace('>', ''); var emoji = emoji.split(':'); var emoji = emoji[2];
                    }
                    return addReaction_roleSelection(channelID, messageID, emoji);
                });
            });
        }

        async function addReaction_roleSelection(channelID, messageID, emoji) {
            message.channel.send(qEmbed.setDescription(`What's the @role or role id?\nEx: \`@role\` or \`730275346678677599\``).setFooter(`Type \`cancel\` if you wish to cancel this action.`)).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    var role = collected.first().content; msg.delete({ timeout: 500 });
                    if (role.toLowerCase() == 'cancel') return;
                    if (role.startsWith('<@&') && role.endsWith('>')) {
                        var role = role.replace('<@&', ''); var role = role.replace('>', '');
                    }
                    if (isNaN(role) == true || !message.guild.roles.cache.get(role)) {
                        message.reply(`Invalid role please try again!`).then(msg => msg.delete({ timeout: 8000 }));
                        return addReaction_roleSelection(channelID, messageID, emoji);
                    }
                    return addReaction_final(channelID, messageID, emoji, role);
                });
            });
        }

        async function addReaction_final(channelID, messageID, emoji, role) {
            con.query(`SELECT * FROM reaction_roles WHERE server_id=? AND channel_id=? AND message_id=? AND emoji=?`, [message.guild.id, channelID, messageID, emoji], function (err, rows) {
                if (err) return message.reply(`There was an error locating your reaction roles\nErr: ${err}`)
                if (rows && rows.length) {
                    message.reply(`Hm, seems like this is a duplicate reaction role or there is already a role set to that reaction. Cancelling action.`);
                } else {

                    let added_complete_embed = new MessageEmbed()
                        .setTitle(`Added Reaction Role`)
                        .setColor(client.embedColor)
                        .setDescription(`Successfully added the reaction role to your specified message!`)

                    var addReaction_payload = {
                        id: null,
                        server_id: message.guild.id,
                        channel_id: channelID,
                        message_id: messageID,
                        emoji: emoji,
                        role_id: role
                    }
                    con.query(`INSERT INTO reaction_roles SET ?`, addReaction_payload, async function (err) {
                        if (err) return message.reply(`There was an error adding your reaction role!\nErr: ${err}`);
                        message.guild.channels.cache.get(channelID).messages.fetch(messageID).then(async m => {
                            await m.react(emoji);
                        }).catch(e => {
                            message.reply(`There was an error adding reaction to the message you specified\nErr: ${err}`);
                        });
                        return message.channel.send(added_complete_embed);
                    });
                }
            });
        }

    }
}