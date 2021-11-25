const { MessageAttachment } = require("discord.js");
const Canvas = require('canvas')
var ProgressBar = require('progress');
const canvacord = require('canvacord')

module.exports = {
    name: "say",
    category: "dev",
    description: "Displays the users current level and xp",
    usage: "<id | mention> <reason>",
    run: async (client, message, args, helper, tools) => {
        message.delete();
        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.reply("You don't have the required permissions to use this command.").then(m => m.delete(5000));
            
            message.channel.send(args.join(" "));
    }
}