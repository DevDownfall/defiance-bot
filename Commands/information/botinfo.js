const { MessageEmbed } = require('discord.js')


module.exports = {
    name: "botinfo",
    category: "info",
    description: "Show server info",
    run: async (client, message, args, con, tools) => {

        //console.log(client)

        // const shardExtraction = [
        //     client.shard.fetchClientValues(client.guilds.memberCount),
        //     client.shard.broadcastEval('this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)'),
        // ];
        
        // Promise.all(shardExtraction)
        // .then(results => {
        //     const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
        //     const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);
        //     botData(totalGuilds, totalMembers);
        // });

        // async function botData(totalGuilds, totalMembers) {
        //     let botembed = new MessageEmbed()
        //     .setDescription(`**Info for ${client.username}**`)
        //     .setColor(client.embedColour)
        //     .setThumbnail(client.embedURL)
        //     /* Line 1 */
        //     .addField(`Guilds`, `${totalGuilds}` ,true)
        //     .addField(`Members`, `${totalMembers}`, true)
        //     /* Line 2 */
           
        //     /* Line 3 */
            

        //     /* Line 4 */

        let botembed = new MessageEmbed()
            .setTitle(`Pheasant Bot`)
            .setColor(client.embedColour)
            .setThumbnail(client.embedURL)
            /* Line 1 */
            .setDescription(`General
            **-> Username: ** ${client.user.username}
            **-> Discriminator: **${client.user.discriminator}
            **-> ID: **${client.user.id}
            **-> Avatar: **[Avatar](https://cdn.discordapp.com/attachments/762858267474133043/775184990966382612/pheasant-removebg-preview.png)
            **-> Status: **${client.presence.status}

            Statistics
            **-> Guilds: **${client.guilds.cache.size}
            **-> Members: **${client.users.cache.size}
            `)
        message.channel.send(botembed)
       // }
    }
}