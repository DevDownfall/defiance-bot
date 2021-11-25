module.invalidable = true

const functions = require('@functions')
const Helper = require('@helper');
const moment = require("moment");
const { MessageEmbed, MessageAttachment } = require('discord.js')
const Canvas = require('canvas')
const drawMultilineText = require('canvas-multiline-text')

module.exports = {

    x: async(client, member) => {

        // Sticky Roles
        const User = await Helper.selectData(`SELECT * FROM user_roles WHERE server_id = ? AND discord_id = ?`, [ member.guild.id, member.user.id])
        if(User) {
            try {
                var stickyRoles = User.roles;
                var stickyRoles = stickyRoles.split(':');
                stickyRoles.forEach(async function (roles) {
                    if (roles == '') return;
                    await member.guild.members.cache.get(member.user.id).roles.add(roles.toString())
                });
            } catch (err) {
                console.log(`Sticky role error in ${member.guild.id}`)
            }
        }else {
            var bot;
            member.user.bot ? bot = true : bot = false
            let newPayload = { id: null, server_id: member.guild.id, discord_id: member.user.id, username: member.user.username, bot: bot, discriminator: member.user.discriminator, avatar: member.user.avatar}
            await Helper.insertData(`INSERT INTO server_members SET ?`, [ newPayload ])
        }

        // Give the default roles
        const Roles = await Helper.selectData(`SELECT * FROM default_roles WHERE server_id = ?`, [ member.guild.id ])
        if(Roles) {
            if(member.guild.id == '889987978187931668'){ 
                await member.guild.members.cache.get(member.user.id).roles.add(roles.toString())
            }
            try {
                var defaultRoles = Roles.roles;
                var defaultRoles = defaultRoles.split(':');
                defaultRoles.forEach(async function (roles) {
                    if (roles == '') return;
                    await member.guild.members.cache.get(member.user.id).roles.add(roles.toString())
                });
            } catch (err) {
                console.log(err)
                console.log(`Default role error in ${member.guild.id}`)
            } 
        }

        // Grab Server Members
        var tmembers = await member.guild.members.cache
        var bots = []
        var members = []

        tmembers.forEach(m => {
            if (m.user.bot) {
                bots.push(m.user.id)
            }else {
                members.push(m.user.id)
            }
        })

        var totalBots = bots.length
        var totalMembers = members.length

        await Helper.updateData(`UPDATE servers SET server_members = ?, server_bots = ? WHERE server_id = ?`, [ totalMembers, totalBots, member.guild.id ])

        // Update Server Stats
        const Stats = await Helper.selectData(`SELECT * FROM server_stats WHERE server_id = ?`, [member.guild.id])
        if(Stats) {
            if (Stats.stats >= '1') { var Channel = member.guild.channels.cache.get(Stats.stats_c1); Channel.setName(`Members: ${totalMembers}`).catch(function (err) { }) }
            if (Stats.stats >= '2') { var Channel = member.guild.channels.cache.get(Stats.stats_c2); Channel.setName(`Bots: ${totalBots}`).catch(function (err) { }) }
            if (Stats.stats >= '3') { var Channel = member.guild.channels.cache.get(Stats.stats_c3); Channel.setName(`Boosts: ${message.guild.premiumSubscriptionCount}`).catch(function (err) { }) }
            if (Stats.stats >= '4') { var Channel = member.guild.channels.cache.get(Stats.stats_c4); Channel.setName(`Total Users: ${totalMembers + totalBots}`).catch(function (err) { }) }
        }

        const Welcome = await Helper.selectData(`SELECT * FROM welcome_message WHERE server_id = ?`, [ member.guild.id ])
        if(!Welcome) return 
        
        // Check if a welcome channel has been setup
        var welcomeChannel = client.channels.cache.get(Welcome.channel_id)
        if(!welcomeChannel) return

        var Message = Welcome.message;
        var colour = Welcome.colour
        var thumbnailURL = Welcome.thumbnailURL;
        var authorTitle = Welcome.authorTitle;
        var authorURL = Welcome.authorURL;
        var timestamp = Welcome.timestamp;

        if (!colour) var colour = client.embedColour;

        let welcomeEmbed = new MessageEmbed()
            .setColor(colour)
            .setFooter(client.embedFooter)

        // Check for thumbnail URL
        if (thumbnailURL = 'user') {
            welcomeEmbed.setThumbnail(member.user.displayAvatarURL())
        }else if (thumbnailURL){
            welcomeEmbed.setThumbnail(thumbnailURL)
        }

        // Check for timestamp
        if (timestamp == 'true') {
            welcomeEmbed.setTimestamp();
        }

        // Check for author title and URL
        if (authorTitle && authorURL) {
            welcomeEmbed.setAuthor(authorTitle, authorURL)
        } else if (authorTitle && !authorURL) {
            welcomeEmbed.setAuthor(authorTitle)
        }

        const Server = await Helper.selectData(`SELECT * FROM servers WHERE server_id = ?`, [ member.guild.id ])
        // Check for a customized embed message
        if (Message) {
            if (Message == 'default') {
                if(Welcome.card == 'true'){
                    var cardMessage = `Welcome to ${member.guild.name} ${member.user.username}`
                    
                }else {
                    var replacedMessage = `Welcome to ${member.guild.name} <@${member.user.id}>`;
                }
            } else {
                var replacedMessage = Message;
                var replacedMessage = replacedMessage.replace(/{guild-name}/g, member.guild.name);
                var replacedMessage = replacedMessage.replace(/{user-mention}/g, `<@${member.user.id}>`);
                var replacedMessage = replacedMessage.replace(/{user-name}/g, `${member.user.username}`);
                var replacedMessage = replacedMessage.replace(/{user-discriminator}/g, `${member.user.discriminator}`);
                var replacedMessage = replacedMessage.replace(/{user-tag}/g, `${member.user.name}#${member.user.discriminator}`);
                var replacedMessage = replacedMessage.replace(/{new-line}/g, `\n`);
                var replacedMessage = replacedMessage.replace(/{server-count}/g, `${Server.server_members + Server.server_bots}`)
            }
        }

        if(Welcome.embed == 'true'){
            welcomeEmbed.setDescription(replacedMessage);
            welcomeChannel.send(`<@${member.user.id}>`).then(x => x.delete());
            welcomeChannel.send(welcomeEmbed)
        }else if (Welcome.card == 'true'){
            Message ? welcomeCard(replacedMessage) : welcomeCard(cardMessage)
        }else {
            welcomeChannel.send(replacedMessage)
        } 
        
        // Pass the entire Canvas object because you'll need to access its width, as well its context
        const applyText = (canvas, text) => {
            const ctx = canvas.getContext('2d');

            // Declare a base size of the font
            let fontSize = 70;

            do {
                // Assign the font to the context and decrement it so it can be measured again
                ctx.font = `${fontSize -= 2}px sans-serif`;
                // Compare pixel width of the text to the canvas minus the approximate avatar size
            } while (ctx.measureText(text).width > canvas.width - 300);

            // Return the result to use in the actual canvas
            return ctx.font;
        };

        async function welcomeCard(message) {
            
            try {
                const canvas = Canvas.createCanvas(700, 250);
                const ctx = canvas.getContext('2d');

                const background = await Canvas.loadImage('https://beautibal.com/wp-content/uploads/2020/04/grey-background.jpg');
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = '#74037b';
                ctx.strokeRect(0, 0, canvas.width, canvas.height);

                if(!Message) {
                    // Slightly smaller text placed above the member's display name
                    // ctx.font = '28px sans-serif';
                    // ctx.fillStyle = '#000000';
                    // ctx.fillText('Welcome to the server,', canvas.width / 2.5, canvas.height / 3.5);

                    // Add an exclamation point here and below
                    // ctx.font = applyText(canvas, `${member.user.username}!`);
                    // ctx.fillStyle = '#000000';
                    // ctx.fillText(`${member.user.username}!`, canvas.width / 2.5, canvas.height / 1.8);
                    drawMultilineText(
                        ctx,
                        message,
                        {
                            rect: {
                                x: 10,
                                y: 10,
                                width: canvas.width / 2.5,
                                height: canvas.height / 3.5
                            },
                            font: 'Merriweather',
                            verbose: true,
                            lineHeight: 1.4,
                            minFontSize: 15,
                            maxFontSize: 120
                        }
                    )
                }else {
                    // Slightly smaller text placed above the member's display name
                    // ctx.font = applyText(canvas, message);
                    // ctx.fillStyle = '#000000';
                    // ctx.fillText(message, canvas.width / 2.5, canvas.height / 3.5);
                    drawMultilineText(
                        ctx,
                        message,
                        {
                            rect: {
                                x: 275,
                                y: 15,
                                width: canvas.width / 2,
                                height: canvas.height / 3.5
                            },
                            font: 'Merriweather',
                            verbose: true,
                            lineHeight: 1.4,
                            minFontSize: 33,
                            maxFontSize: 33
                        }
                    )

                }

                ctx.beginPath();
                ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();

                const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
                ctx.drawImage(avatar, 25, 25, 200, 200);

                const attachment = new MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

                welcomeChannel.send(attachment);
            }catch (e) {
                console.log(e)
            }
            

        }
    }
}