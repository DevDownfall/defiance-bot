module.invalidable = true

const helper = require('@helper')
const levelElos = require('../Utils/levels.js')
const Canvas = require('canvas')
const { MessageEmbed } = require('discord.js')
const Functions = require('@functions')

module.exports = {

    x: async function (client, message) {
        console.log('fart')

        let eArr = ['👍', '👎']
        if(message.channel.id == '863539969306132500'){
            if(message.author.bot) return
            if(!message.embeds[0].url) return message.reply('an error has occured, contact an admin!')
            if(message.attachments[0] || message.embeds[0].url) {
                console.log('poopy')
                let payload = { id: null, discord_id: message.author.id, message_id: message.id, upvotes: 0, downvotes: 0, sent: true }

                const Sent = await helper.selectData(`SELECT * FROM defiance_clips WHERE discord_id = ?`, [ message.author.id ])
                if(Sent) {
                    message.channel.send('You have already submitted a clip!')
                    return message.delete()
                }
                await helper.insertData(`INSERT INTO defiance_clips SET ?`, [ payload ])
                Functions.addEmojis(message, eArr)
            }else {
                console.log('no attachment || link embed')
            }
        }
        
        const Data = await helper.selectData(`SELECT * FROM servers WHERE server_id = ?`, [ message.guild.id ])
        if(!Data) return client.emit('guildCreate', message.guild)

        var tools = {
            prefix: Data.prefix, logs_id: Data.logs_id, sixmans_prefix: '='
        }

        const Level = await helper.selectData(`SELECT * FROM user_levels WHERE server_id = ? AND discord_id = ?`, [ message.guild.id, message.author.id ])
        if(Level) {
            var expArray = [3, 4, 5, 6, 7]
            var randExp = expArray[Math.floor(Math.random() * expArray.length)];

            var xp = Level.xp
            var level = Level.level
            var fexp = xp + randExp

            // User Levelling

            // > Greater than 
            // < Less than
            if(fexp < levelElos.level2) {
                level = 1
            }
            if(fexp >= levelElos.level1 && fexp < levelElos.level3) {
                level = 2
            }
            if(fexp >= levelElos.level2 && fexp < levelElos.level4){
                level = 3
            } 
            if(fexp >= levelElos.level3 && fexp < levelElos.level5) {
                level = 4
            }
            if(fexp >= levelElos.level4 && fexp < levelElos.level6) {
                level = 5
            }
            if(fexp >= levelElos.level5 && fexp < levelElos.level7) {
                level = 6
            }
            if(fexp >= levelElos.level6 && fexp < levelElos.level8) {
                level = 7
            }
            if(fexp >= levelElos.level7 && fexp < levelElos.level9){
                level = 8
            } 
            if(fexp >= levelElos.level8 && fexp < levelElos.level10) {
                level = 9
            }
            if(fexp >= levelElos.level9 && fexp < levelElos.level11) {
                level = 10
            }
            if(fexp >= levelElos.level10 && fexp < levelElos.level12) {
                level = 11
            }
            if(fexp >= levelElos.level11 && fexp < levelElos.level13) {
                level = 12
            }
            if(fexp >= levelElos.level12 && fexp < levelElos.level14) {
                level = 13
            }
            if(fexp >= levelElos.level13 && fexp < levelElos.level15) {
                level = 14
            }
            if(fexp >= levelElos.level15 && fexp < levelElos.level16) {
                level = 15
            }
            if(fexp >= levelElos.level16 && fexp < levelElos.level17) {
                level = 16
            }
            if(fexp >= levelElos.level17 && fexp < levelElos.level18) {
                level = 17
            }
            if(fexp >= levelElos.level18 && fexp < levelElos.level19) {
                level = 18
            }
            if(fexp >= levelElos.level19 && fexp < levelElos.level20) {
                level = 19
            }
            if(fexp >= levelElos.level20 && fexp < levelElos.level21) {
                level = 20
            }
            if(fexp >= levelElos.level21 && fexp < levelElos.level22) {
                level = 21
            }
            if(fexp >= levelElos.level22 && fexp < levelElos.level23) {
                level = 22
            }
            if(fexp >= levelElos.level23 && fexp < levelElos.level24) {
                level = 23
            }
            if(fexp >= levelElos.level24 && fexp < levelElos.level25) {
                level = 24
            }
            if(fexp >= levelElos.level25 && fexp < levelElos.level26) {
                level = 25
            }
            if(fexp >= levelElos.level26 && fexp < levelElos.level27) {
                level = 26
            }
            if(fexp >= levelElos.level27 && fexp < levelElos.level28) {
                level = 27
            }
            if(fexp >= levelElos.level28 && fexp < levelElos.level29) {
                level = 28
            }
            if(fexp >= levelElos.level29 && fexp < levelElos.level30) {
                level = 29
            }
            if(fexp >= levelElos.level29 && fexp < levelElos.level30) {
                level = 30
            }
            await helper.updateData(`UPDATE user_levels SET xp='${fexp}' WHERE server_id = ? AND discord_id = ?`, [ message.guild.id, message.author.id])
            await helper.updateData(`UPDATE user_levels SET level='${level}' WHERE server_id = ? AND discord_id = ?`, [ message.guild.id, message.author.id])

        } else {
            var payload = { id: null, server_id: message.guild.id, discord_id: message.author.id, discord_name: message.author.username }
            await helper.insertData(`INSERT INTO user_levels SET ?`, [payload])
        }



        const tickets = await helper.selectAll(`SELECT * FROM modmail_tickets`)
        if(!tickets) {
            return
        }else {
            tickets.forEach(c => {
                if(c.channel_id == message.channel.id){
                    poop(c)
                }
            });
        }
        

        async function poop(DB){
            const Server = client.guilds.cache.get('862469337231392819')
            const ticketChannel = Server.channels.cache.get(DB.channel_id)
            const User2 = Server.members.cache.get(DB.user_id)
            if(message.channel.id == ticketChannel.id){
                
    
                if(message.content !== DB.last_message){
                    if(message.author.bot) return
                    if(message.content == 'closedm'){
                        await helper.deleteData(`DELETE FROM modmail_tickets WHERE channel_id = ?`, [ DB.channel_id ])
                        ticketChannel.delete()
    
                        let closeEmbed = new MessageEmbed()
                        .setTitle('**Closed Ticket')
                        .setDescription(`Your modmail ticket has been closed!`)
    
                        return User2.send(closeEmbed)
                    }else {
                        await helper.updateData(`UPDATE modmail_tickets SET last_message = ? WHERE user_id = ?`, [ message.content, User2.id])
                        await helper.updateData(`UPDATE modmail_tickets SET msg_author = ? WHERE user_id = ?`, [ message.author.username, User2.id])
                        await helper.updateData(`UPDATE modmail_tickets SET msg_type = ?`, [ 'ticket' ])
                        try{
                            User2.send(`**${message.author.username}:** ${message.content}`)
                        }catch(e){
                            console.log(e)
                        }
                    }
                }
            }else {
                console.log('no channel')
            }
        }

        
        if (message.content === `<@!${client.user.id}>` || message.content === `<@${client.user.id}>`) message.reply(`hey there! The current prefix for this guild is \`${tools.prefix}\` incase you forgot!`);
        
        if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`) || message.content.startsWith(tools.prefix) || message.content.startsWith(tools.sixmans_prefix)) {
            if (message.content.startsWith(`<@!${client.user.id}>`)) var length = 4 + client.user.id.length;
            if (message.content.startsWith(`<@${client.user.id}>`)) var length = 3 + client.user.id.length;
            if (message.content.startsWith(tools.prefix)) var length = 0 + tools.prefix.length;
            if (message.content.startsWith(tools.sixmans_prefix)) var length = 0 + tools.sixmans_prefix.length

            var args = message.content.slice(length).trim().split(/ +/g);
            var cmd = args.shift().toLowerCase();
            if (cmd.length === 0) return;

            command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
            sixmans_command = client.sixmans_commands.get(cmd) || client.sixmans_commands.get(client.sixmans_aliases.get(cmd))

            if(message.content.startsWith(tools.prefix)) {
                if(!command) return
                command.run(client, message, args, helper, tools)
            }else if (message.content.startsWith(tools.sixmans_prefix)) {
                if(!sixmans_command) return
                sixmans_command.sixmans(client, message, args, helper, tools)
            }else {
                console.log('no command')
            }
        }
    },

    DM: async function(client, message){

        const modmailTicket = await helper.selectData(`SELECT * FROM modmail_tickets WHERE user_id = ? AND server_id = ?`, [ message.author.id, '862469337231392819'])
        if(modmailTicket){
            const Server = await helper.selectData(`SELECT * FROM servers WHERE server_id= ?`, [ '862469337231392819' ])
            let Guild = client.guilds.cache.get(Server.server_id)
            const User = Guild.members.cache.get(message.author.id)
            const DB = await helper.selectData(`SELECT * FROM modmail_tickets WHERE user_id = ? AND server_id = ?`, [ User.id, '862469337231392819' ])
            if(DB){
                try{
                    Initiate()
                }catch(e){
                    console.log(e)
                }
            }

            async function Initiate(){
                const Server = client.guilds.cache.get('862469337231392819')
                const ticketChannel = Server.channels.cache.get(DB.channel_id)

                if(message.content !== DB.last_message){
                    await helper.updateData(`UPDATE modmail_tickets SET last_message = ? WHERE user_id = ?`, [ message.content, User.id])
                    await helper.updateData(`UPDATE modmail_tickets SET msg_type = ?`, [ 'dm'])
                    ticketChannel.send(`**${DB.username}:** ${message.content}`)
                }
            }
        }else {
            // // Create Staff Ticket
            let Guild = client.guilds.cache.get('862469337231392819')
            
            if(message.author.bot) return
            if(!message.author.bot){
                try{
                    const down = '607430749620011008'
                    const ticketChannel = await Guild.channels.create(`ticket-${message.author.username}#${message.author.discriminator}`, {
                        type: 'text',
                        parent: '863292906466443274',
                        permissionOverwrites: [
                            { id: Guild.id, deny: ['VIEW_CHANNEL'] },
                            { id: down, allow: ['VIEW_CHANNEL']}
                        ]
                    }).then(async(tchannel) => {
                        tchannel.send(`${message.author.username} has created a ticket!`)
                        tchannel.send(`<@607430749620011008>`)
                        let payload = { id: null, server_id: Guild.id, user_id: message.author.id, username: message.author.username, channel_id: tchannel.id, last_message: '', msg_author: message.author.username}
                        await helper.insertData(`INSERT INTO modmail_tickets SET ?`, [ payload ])
                    })
                }catch(e){
                    console.log(e)
                }
            }
            const Person = Guild.members.cache.get(message.author.id)
            Person.send(`You have just opened a ticket in **${Guild.name}**. You will be able to contact staff by using this DM conversation.`)
        } 
    }

}


