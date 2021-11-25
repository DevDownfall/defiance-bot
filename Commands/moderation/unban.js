const { MessageEmbed } = require("discord.js");
const Helper = require('@helper')

module.exports = {
    name: "unban",
    category: "moderation",
    description: "Unbans a user from the discord (ADMIN)",
    usage: "<id | mention>",
    perms: 'Staff',
    run: async (client, message, args, tools) => {

        if(!message.member.hasPermission(["BAN_MEMBERS"])) return message.channel.send("You require the permission \`BAN_MEMBERS\`")

        let bannedMember;
        try{                                                            
            bannedMember = await client.users.fetch(args[0])
        }catch(e){
            if(!bannedMember) return message.channel.send("That's not a valid user")
        }
    
        try {
            await message.guild.fetchBan(bannedMember)
        } catch(e){
            message.channel.send('This user is not banned.');
            return;
        }
    
        let reason = args.slice(1).join(" ")
        if(!reason) reason = "No reason specified"
    
        let embed = new MessageEmbed()
            .setAuthor(client.embedTitle, client.embedURL)
            .setColor(client.embedColor)
            .setDescription(`
            **User Unbanned - LOG**
            - Unbanned User: ${bannedMember} | ${bannedMember.id}
            - Unbanned By:   ${message.member} | ${message.member.id}
            - Unban Reason:  ${reason}
            `)
            .setFooter(client.embedFooter, client.embedURL)
            .setThumbnail(bannedMember.displayAvatarURL())
            .setTimestamp()

        if(!message.guild.me.hasPermission(["BAN_MEMBERS"])) return message.channel.send("Only users with the permission Ban Members may do this!")
        message.delete()
        const Server = await Helper.selectData(`SELECT * FROM servers WHERE server_id = ?`, [ message.guild.id ])
        try {
            message.guild.members.unban(bannedMember, {reason: reason})
            message.channel.send(`${bannedMember.tag} was unbanned.`).then(msg => {
                msg.delete({timeout:1000})
            })
            const logChannel = message.guild.channels.cache.get(tools.logs_id);
            if(!logChannel) message.author.send(`Don't forget to set a logs channel within the setup!`);
            logChannel.send(embed)
        } catch(e) {
            console.log(e.message)
        }
    }
}