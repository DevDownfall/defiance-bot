const { MessageEmbed } = require("discord.js");
const moment = require("moment");
const hastebin = require("hastebin-gen");
const Helper = require('@helper')

module.exports = {
    name: "ticketsetup",
    category: "info",
    description: "Create tickets for different topics",
    usage: "ticketsetup",
    perms: "Admin",
    run: async (client, message, args, tools) => {

        /* Checks if the user has the ADMINISTRATOR permission */
        if (!message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send("You do not have permission to use this command. Please contact an administrator or moderator.")
            .then(m => m.delete({ timeout: 5000 }));
        }

        const Server = await Helper.selectData(`SELECT * FROM servers WHERE server_id = ?`, [ message.guild.id ])
        var tcat = Server.ticket_category_id
        var tcategory = message.guild.channels.cache.get(tcat)

        /* Checks for ticket category */
        if (!tcategory) return message.reply(`theres no category setup for tickets.`);
        
        /* Checks if user already has an opened ticket */
        var channelLookup = message.guild.channels.cache.find(c => c.name === `ticket-${message.author.username.toLowerCase()}-${message.author.discriminator}`);
        if(channelLookup) return message.reply(`you already have an open ticket!`).then(msg => msg.delete({timeout:1500}));

        let embed = new MessageEmbed()
        .setColor(client.embedColour)
        .setTitle("Create a Ticket")
        .setDescription("React to this message to create a ticket.")

        var tpayload = {
            id: null,
            server_id: message.guild.id,
            message_id: '',
            channel_id: '',
        }

        message.channel.send(embed).then(async msg => {
            msg.react('✅')
            const Tickets = await Helper.selectData(`SELECT * FROM tickets WHERE server_id=?`, [ message.guild.id ])
            if(!Tickets) await Helper.insertData(`INSERT INTO tickets SET ?`, [tpayload]) 

            await Helper.updateData(`UPDATE tickets SET message_id = ? WHERE server_id = ?`, [ msg.id, msg.guild.id ])
            await Helper.updateData(`UPDATE tickets SET channel_id = ? WHERE server_id = ?`, [ msg.channel.id, msg.guild.id ])
        })
    }
}

