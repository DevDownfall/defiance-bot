const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let functions = require('@functions')
const Helper = require('@helper')

module.exports = {
    name: "warn",
    aliases: ["w"],
    category: "moderation",
    description: "Warn a user (ADMIN)",
    usage: "warn",
    perms: 'Staff',
    run: async (client, message, args) => {

        async function getWarns(id, serverid){
            return new Promise(async(resolve, reject) => {
                const warns = await Helper.selectData(`SELECT * FROM warned_users WHERE discord_id=? AND server_id=?`, [ id, serverid ])
                if(warns){
                    resolve(warns.total_warns);
                }else{
                    resolve('not exists');
                }
            });
        }

        // if(!message.member.hasPermission("KICK_MEMBERS"))  {
        //     if(message.member.roles.cache.find(r => r.name === "Moderator")){}else{ return message.reply("You do not have permission to use this command. Please contact an moderator").then(m => m.delete({ timeout: 5000 })); }
        // }
        let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
        if(!wUser) return message.reply("Could not find specified user.");

        //if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("The specified user cannot be warned");
        var reason = args.slice(1).join(" ")
        if(!reason){ var reason = 'No reason specified' }

        if(await getWarns(wUser.id, message.guild.id) == 'not exists'){
            var payload = {
                id: null,
                server_id: message.guild.id,
                discord_id: wUser.id,
                total_warns: '1'
            }
            await Helper.insertData(`INSERT INTO warned_users SET ?`, payload)
        }else{
            const warnings = await getWarns(wUser.id, message.guild.id)
            await Helper.updateData(`UPDATE warned_users SET total_warns=total_warns+1 WHERE discord_id = ? AND server_id = ?`, [ wUser.id, message.guild.id ])
        }

        var wpayload = {
            id: null, 
            server_id: message.guild.id, 
            discord_id: wUser.id,
            type: 'warning',
            reason: reason,
            time: null
        }

        // Log the warning incident into the database
        await Helper.insertData(`INSERT INTO user_incidents SET ? `, [ wpayload ])

        let warnEmbed = new MessageEmbed()
        .setAuthor(client.embedTitle, client.embedURL)
        .setColor(client.embedColour)
        .setDescription(`
        **User Warned - LOG**
        - Warned User: ${wUser} | ${wUser.id}
        - Warned By:   ${message.author} | ${message.author.id}
        - Warn Reason:  ${reason}
        - Total Warns: ${await getWarns(wUser.id, message.guild.id)}
        `)
        .setFooter(client.embedFooter)
        .setThumbnail(wUser.user.displayAvatarURL())
        .setTimestamp()

        message.reply('Specified user has been warned')

        const Server = await Helper.selectData(`SELECT * FROM servers WHERE server_id = ?`, [ message.guild.id ])
        const channel = Server.logs_id
        let warnchannel = message.guild.channels.cache.get(channel);
        if(!warnchannel) return message.reply("Couldn't find channel logs channel use setup command to set one!");
        warnchannel.send(warnEmbed);

        wUser.send(`You have been warned in ${message.guild.name} for: **${reason}**`)
    }
}
