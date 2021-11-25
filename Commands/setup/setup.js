module.invalidable = true

const { MessageEmbed } = require("discord.js");
const functions = require("@functions");
const pagination = require('@pagination');
const con = require('@database')
const Helper = require('@helper')

module.exports = {
    name: "start",
    category: "setup",
    aliases: ['s'],
    description: "Set up the bot for your discord server! (Admin)",
    usage: "",
    run: async (client, message, args, helper, tools) => {
        console.log('hi')
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Only Administrators can do this!`);

        let setupEmbed = new MessageEmbed()
            .setColor(client.embedColour)
            .setTitle(`**Select what you want to setup!**`)
            .setDescription(`
            1️⃣. Change prefix
            2️⃣. Change welcome channel
            3️⃣. Change leave channel
            4️⃣. Change logs channel
            5️⃣. Change chat logs channel
            6️⃣. Change user logs channel
            7️⃣. Change voice logs channel
            8️⃣. Change defualt roles 
            9️⃣. Change ticket category
            🔟. Change report channel
            `)
            //.setFooter("You have 30 seconds to choose!", "https://cdn.discordapp.com/attachments/692189380168777749/767852461842890782/h_a1_6937_6_canada_goose_ethel_oneal_adult.jpg").setColor(client.embedColor).setTimestamp()

            let setupEmbed2 = new MessageEmbed()
            .setColor(client.embedColour)
            .setTitle(`**Select what you want to setup!**`)
            .setDescription(`
            1️⃣. Setup Server Stats 
            2️⃣. Setup Welcome Message
            3️⃣. Setup Leave Message
            `)
            //.setFooter("You have 30 seconds to choose!", "https://cdn.discordapp.com/attachments/692189380168777749/767852461842890782/h_a1_6937_6_canada_goose_ethel_oneal_adult.jpg").setColor(client.embedColor).setTimestamp()
        
        var numEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']; 
        var setupArr = []
        setupArr.push(setupEmbed)
        setupArr.push(setupEmbed2)
        
        pagination(message, setupArr).then(async msg => {
            functions.addEmojis(msg, numEmojis)

            const filter = (reaction, user) => user.id === message.author.id && numEmojis.includes(reaction.emoji.name);

            const collector = msg.createReactionCollector(filter, {max: 1, time: 30000});    
    
            collector.on('end', collected => {                  
                msg.delete({timeout:10000});
                if(collected.first() == undefined){
                    return message.channel.send(`Times up, no emoji specified, cancelling action.`)
                }else{
                    var footerT = msg.embeds[0].footer.text.split(" ")[1]
                    //console.log(footerT)
                    var emoji = collected.first().emoji.name;
                    if(emoji == '1️⃣'){ return footerT == '1' ? change_prefix() : activate_server_stats()                    } 
                    if(emoji == '2️⃣'){ return footerT == '1' ? change_welcome_channel() : activate_welcome_setup()          } 
                    if(emoji == '3️⃣'){ return footerT == '1' ? change_leave_channel() : activate_leave_setup()             } 
                    if(emoji == '4️⃣'){ return footerT == '1' ? change_logs_channel() : message.channel.send("This option is currently under maintenance")               } 
                    if(emoji == '5️⃣'){ return footerT == '1' ? change_chat_logs_channel() : message.channel.send("This option is currently under maintenance")          } 
                    if(emoji == '6️⃣'){ return footerT == '1' ? change_user_logs_channel() : message.channel.send("This option is currently under maintenance")          } 
                    if(emoji == '7️⃣'){ return footerT == '1' ? change_voice_logs_channel() : message.channel.send("This option is currently under maintenance")        } 
                    if(emoji == '8️⃣'){ return footerT == '1' ? change_default_role() : message.channel.send("This option is currently under maintenance")               } 
                    if(emoji == '9️⃣'){ return footerT == '1' ? change_ticket_category() : message.channel.send("This option is currently under maintenance")            } 
                    if(emoji == '🔟'){ return footerT == '1' ? change_report_channel() : message.channel.send("This option is currently under maintenance")             }
                }
            });
        });

        function activate_server_stats(){
            message.channel.send(`You have 5 options! Just say the number you want!\n0: Disabled\n1: Member Count\n2: Member Count + Bot Count\n3: Member Count + Bot Count + Boosts Count\n4: Member Count + Bot Count + Boosts Count + Boosts Tier\n`).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, {max: 1, time: 30000}).then(collected => {
                    msg.delete({timeout:500});
                    var data = collected.first().content
                    if(data == '0' || data == '1' || data == '2' || data == '3' || data == '4'){}else{ return message.channel.send(`${data} is not a valid option!`); }
                    con.query(`UPDATE server_stats SET stats=? WHERE server_id='${message.guild.id}'`, [data]);
                    message.channel.send(`Updating your choice to option ${data}!`);

                    con.query(`SELECT * FROM server_stats WHERE server_id = ?`, [ message.guild.id ], async function(err, rows) {

                        function reset_data(){
                            try { var stats_category = client.channels.cache.find(c => c.name == `📊 Server Stats 📊` && c.type == `category` && c.guild.id == message.guild.id); stats_category.delete(); } catch (err) { }
                            try { var stats_c1 = client.channels.cache.get(rows[0].stats_c1); stats_c1.delete().catch(function(err){}); } catch (err) { }
                            try { var stats_c2 = client.channels.cache.get(rows[0].stats_c2); stats_c2.delete().catch(function(err){}); } catch (err) { }
                            try { var stats_c3 = client.channels.cache.get(rows[0].stats_c3); stats_c3.delete().catch(function(err){}); } catch (err) { }
                            try { var stats_c4 = client.channels.cache.get(rows[0].stats_c4); stats_c4.delete().catch(function(err){}); } catch (err) { }
                        }

                        async function header(){
                            await message.guild.channels.create('📊 Server Stats 📊', { 
                                type: 'category',
                                permissionOverwrites: [
                                    { id: message.guild.id, allow: ['VIEW_CHANNEL'], }
                                ]
                            }).then(channel => {
                                channel.setPosition(0); 
                            })
                        }
                
                        async function channelCreation(s, c){
                            const ssCategory = message.guild.channels.cache.find(channel => channel.name == '📊 Server Stats 📊')
                            var schannel = await message.guild.channels.create(s, {
                                type: 'voice',
                                permissionOverwrites: [
                                    { id: message.guild.id, allow: ['VIEW_CHANNEL'], deny: ['CONNECT'] },
                                ],
                            })
                            await schannel.setParent(ssCategory)
                            con.query(`UPDATE server_stats SET ${c}='${schannel.id}' WHERE server_id='${message.guild.id}'`)
                        }

                        var tmembers = await message.guild.members.fetch(message.guild.members)
                        var bots = []
                        var members = []

                        tmembers.forEach(member => {
                            if (member.user.bot == true) {
                                bots.push(member.user.id)
                            }else {
                                members.push(member.user.id)
                            }
                        })

                        var totalBots = bots.length
                        var totalMembers = members.length

                        if (data == '0') {
                            reset_data();
                        }

                        if(data == '1'){
                            reset_data();
                            await header();
                            await channelCreation(`Members: ${totalMembers}`, `stats_c1`);
                        }

                        if(data == '2'){
                            reset_data();
                            await header();
                            await channelCreation(`Members: ${totalMembers}`, `stats_c1`);
                            await channelCreation(`Bots: ${totalBots}`, `stats_c2`);
                        }

                        if(data == '3'){
                            reset_data();
                            await header();
                            await channelCreation(`Members: ${totalMembers}`, `stats_c1`);
                            await channelCreation(`Bots: ${totalBots}`, `stats_c2`);
                            await channelCreation(`Boosts: ${message.guild.premiumSubscriptionCount}`, `stats_c3`);
                        }      
                        
                        if(data == '4'){
                            reset_data();
                            await header();
                            await channelCreation(`Members: ${totalMembers}`, `stats_c1`);
                            await channelCreation(`Bots: ${totalBots}`, `stats_c2`);
                            await channelCreation(`Boosts: ${message.guild.premiumSubscriptionCount}`, `stats_c3`);
                            await channelCreation(`Total Users: ${totalMembers + totalBots}`, 'stats_c4');
                        }                      

                    })
                });
            });
        }
    }
}