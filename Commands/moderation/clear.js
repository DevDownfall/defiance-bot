module.invalidable = true

const functions = require('@functions');
const { MessageEmbed } = require("discord.js");
const con = require('@database')

module.exports = {
    name: "clear",
    aliases: ["purge", "nuke"],
    category: "moderation",
    description: "Clears the chat (ADMIN)",
    perms: 'Staff',
    run: async (client, message, args, helper, tools) => {


        // Member doesn't have permissions
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("You require the permission \`MANAGE_MESSAGES\`").then(m => m.delete({ timeout: 5000 }));
        } else if (message.author.id != "607430749620011008"){}

        // // Check if args[0] is a number
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("You've specified an invalid number!").then(m => m.delete({ timeout: 5000 }));
        }

        // Maybe the bot can't delete messages
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("Sorry, I don't have permission to delete messages. I require \`MANAGE_MESSAGES\`").then(m => m.delete({ timeout: 5000 }));
        }

        // let deleteAmount;
        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        let User = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
        if(User){
            con.query(`SELECT * FROM servers WHERE server_id = ?`, [message.guild.id], async function(err, rows) {
                let embed = new MessageEmbed()
                .setAuthor(client.embedTitle, client.embedURL)
                .setColor(client.embedColour)
                .setDescription(`
                **Clear Command - LOG**
                - Initiater: ${message.member} | ${message.member.id}
                - Clear Amount: \`${deleteAmount}\`
                `)
                .setFooter(client.footerURL)
                .setTimestamp()
    
                var cLogs = rows[0].chat_logs_id
                var logChannel = message.guild.channels.cache.get(cLogs)
    
                clearArr = []
                
                if (!logChannel) {
                    //message.author.send(`Don't forget to use the setup command to set a chat-logs channel!`)
                } else {
                    logChannel.send(embed)
                }
    
                try {
                    const fetched = await message.channel.messages.fetch({ limit: deleteAmount });
                    const userMessages = fetched.filter(fetchedMsg => !fetchedMsg.pinned && fetchedMsg.author.id == User.id);
                    const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
    
                    // var clearedArr = []
                    // clearedArr.push(content)
                    // console.log(clearedArr)
                    // hastebin(clearedArr, "txt").then(function (r) {
                    //     return logChannel.send(`Your saved log file is ready! ${r}`);
                    // });
    
                    const msgs = await message.channel.bulkDelete(userMessages, notPinned, true)
                    .then(deleted => message.channel.send(`I've deleted \`${deleted.size}\` messages.`))
                    .then(m => m.delete({timeout: 5000}))
                    .catch(err => message.reply(`Something went wrong... ${err}`));;
                } catch (err) {
                    console.error(err);
                }
            })
        }else {
            con.query(`SELECT * FROM servers WHERE server_id = ?`, [message.guild.id], async function(err, rows) {
                let embed = new MessageEmbed()
                .setAuthor(client.embedTitle, client.embedURL)
                .setColor(client.embedColour)
                .setDescription(`
                **Clear Command - LOG**
                - Initiater: ${message.member} | ${message.member.id}
                - Clear Amount: \`${deleteAmount}\`
                `)
                .setFooter(client.footerURL)
                .setTimestamp()
    
                var cLogs = rows[0].chat_logs_id
                var logChannel = message.guild.channels.cache.get(cLogs)
    
                clearArr = []
                
                if (!logChannel) {
                    //message.author.send(`Don't forget to use the setup command to set a chat-logs channel!`)
                } else {
                    logChannel.send(embed)
                }
    
                try {
                    const fetched = await message.channel.messages.fetch({ limit: deleteAmount });
                    const notPinned = fetched.filter(fetchedMsg => !fetchedMsg.pinned);
    
                    // var clearedArr = []
                    // clearedArr.push(content)
                    // console.log(clearedArr)
                    // hastebin(clearedArr, "txt").then(function (r) {
                    //     return logChannel.send(`Your saved log file is ready! ${r}`);
                    // });
    
                    const msgs = await message.channel.bulkDelete(notPinned, true)
                    .then(deleted => message.channel.send(`I've deleted \`${deleted.size}\` messages.`))
                    .then(m => m.delete({timeout: 5000}))
                    .catch(err => message.reply(`Something went wrong... ${err}`));;
                } catch (err) {
                    console.error(err);
                }
            })  
        }
    }
}