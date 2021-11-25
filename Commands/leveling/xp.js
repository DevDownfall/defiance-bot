const { MessageAttachment } = require("discord.js");
const canvacord = require('canvacord')
const levels = require('../../Utils/levels.js')

module.exports = {
    name: "xp",
    category: "leveling",
    description: "Add/Remove xp from a user",
    usage: "<id | mention> <xp>",
    run: async (client, message, args, helper, tools) => {

        // if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('you are not permitted to use this command!')

        let choice = args[0]
        let person = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let xp = args[1]

        if(!person) message.reply('please specify a user')
        if(!xp) message.reply('please specify an amount of xp')

        const user = await helper.selectData(`SELECT * FROM user_levels WHERE discord_id = ? AND server_id = ?`, [ person.id, message.guild.id ])
        await helper.updateData(`UPDATE user_levels SET xp = ? WHERE server_id = ? AND discord_id = ?`, [ xp, message.guild.id, person.id ])
        message.channel.send(`You have changed the xp level for ${person}. Their total xp is now ${xp}`)
    }
}