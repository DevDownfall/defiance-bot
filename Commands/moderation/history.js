const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let functions = require('@functions')
const Helper = require('@helper')

module.exports = {
    name: "history",
    aliases: ["h"],
    category: "moderation",
    description: "Shows the history of a user (ADMIN)",
    usage: "history <@user>",
    perms: 'Staff',
    run: async (client, message, args, tools) => {

        if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.reply("You do not have permission to perform this action!");
        let hUser = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0])
        if(!hUser) return message.reply("Could not find specified user.");

        let embed = new MessageEmbed()
            .setColor(client.embedColour)
            .setTitle(`Incident History`)
            .setDescription(`User: ${hUser}`)

        const History = await Helper.selectAll(`SELECT * FROM user_incidents WHERE server_id = ? AND discord_id = ?`, [ message.guild.id, hUser.id ])
        if(!History) return message.channel.send('There are no incidents for this user')
        var number = 1;
        History.forEach(function (incidents) { 
            embed.addField(` ${number++}. Incident Type: ${incidents.type}, Incident ID: ${incidents.id}`, `Reason: ${incidents.reason}`, true)
        })
        message.channel.send(embed)
    }
}