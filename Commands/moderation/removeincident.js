const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let functions = require('@functions')
const Helper = require('@helper')

module.exports = {
    name: "removeincident",
    aliases: ["ri"],
    category: "moderation",
    description: "Remove a warn from a user (ADMIN)",
    usage: "removewarn",
    perms: 'Staff',
    run: async (client, message, args, tools) => {

        // let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
        // if(!wUser) return message.reply("Could not find specified user.");

        // await getWarns(wUser.id, message.guild.id) // Get warn num

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            if(message.member.roles.cache.find(r => r.name === "Moderator")){
            }else{
                return message.channel.send("You do not have permission to use this command. Please contact an administrator or moderator.")
                .then(m => m.delete({ timeout: 5000 }));
            }
        }

        var id = args[0]
        if(isNaN(id)) return message.reply('please provide a number')
        const incident = await Helper.selectData(`SELECT * FROM user_incidents WHERE id = ?`, [ id])
        if(!incident) return message.reply('incident does not exist!')

        //if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("The specified user cannot be warned");
        // var rwarns = await getWarns(wUser.id, message.guild.id);

        // if (rwarns == 'not exists') { return message.channel.send("This user does not have any warns. :thumbsup:")}
        // if (rwarns == 0 ){ return message.channel.send("This user does not have any warns. :thumbsup:") }
        // con.query(`UPDATE warned_users SET total_warns='${rwarns - 1}' WHERE discord_id='${wUser.id}' AND server_id='${message.guild.id}'`)
        await Helper.deleteData(`DELETE FROM user_incidents WHERE id = ?`, [ id])
        message.channel.send("A warning has been removed from this user!")
    }
}
