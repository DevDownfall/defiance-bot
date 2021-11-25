module.invalidable = true

const { MessageEmbed } = require('discord.js')
const ms = require('ms')
const con = require('@database')

module.exports = {
    name: "guildinfo",
    category: "info",
    description: "Show guild info",
    run: async (client, message, args, tools) => {

        if(message.guild.iconURL()){
            let sicon = message.guild.iconURL().split("/")
            if (sicon[5].startsWith('a_')) {
                var url = message.guild.iconURL().replace('.webp', '.gif')
            } else {
                var url = message.guild.iconURL();
            }
        }else{
            var url = 'https://kyanitepublishing.com/wp-content/uploads/2019/03/discord-512.png'
        }

        var tmembers = await message.guild.members.fetch(message.guild.members)
        var bots = []
        var members = []
        var online = []
        var dnd = []
        var offline = []

        tmembers.forEach(member => {
            if (member.user.bot == true) {
                bots.push(member.user.id)
            }else {
                members.push(member.user.id)
            }

            if (member.user.presence.status == 'online') online.push(member.user.id)
            if (member.user.presence.status == 'dnd') dnd.push(member.user.id)
            if (member.user.presence.status == 'offline') offline.push(member.user.id)
        })

        const textChannels = message.guild.channels.cache.filter(c => c.type === 'text');
        const voiceChannels = message.guild.channels.cache.filter(c => c.type === 'voice');
        const totalChannels = textChannels.size + voiceChannels.size;
        var serverCreated = message.guild.createdAt.toString();
        var serverCreated = serverCreated.split(' ');
        var totalMembers = members.length
        var totalBots = bots.length
        

        con.query('SELECT * FROM servers WHERE server_id = ?', [ message.guild.id ], function(err, rows) {
            var prefix = rows[0].prefix

            let serverembed = new MessageEmbed()
            .setColor(client.embedColour)
            .setThumbnail(url)
            /* General Info */
            .setDescription(`** General **
            **-> Name: **${message.guild.name}
            **-> ID: ** ${message.guild.id}
            **-> Owner:**  ${message.guild.owner}
            **-> Region:** ${message.guild.region}
            **-> Boost Tier:** ${message.guild.premiumTier}
            **-> Time Created: ** ${message.guild.createdAt}
            **-> Server Prefix: **${prefix}
            
            Statistics
            **-> Members:**${totalMembers}
            **-> Bots:**${totalBots}
            **-> Total Roles:** ${message.guild.roles.cache.size}
            **-> Emoji Count:** 
            **-> Text Channels:** ${textChannels.size}
            **-> Voice Channels:**${voiceChannels.size}
            **-> Total:** ${totalChannels}
            
            
            `)

            // Presence
            // **-> :green_circle: ** ${online.length} Users online
            // **-> :red_circle: ** ${dnd.length} Users on Do not Disturb
            // **-> ⚪** ${offline.length} Users offline

            // .addField(`**-> Total Members:** ${message.guild.memberCount}
            // **-> Total Humans:** ${humans}
            // **-> Total Bots:** ${bots}`)
            // /* Footer */
            //.setFooter(`ID: ${message.guild.id}   Created - ${serverCreated[0]} ${serverCreated[1]} ${serverCreated[2]} ${serverCreated[3]}`)

            message.channel.send(serverembed);
        })  
    }
}