module.invalidable = true

const { MessageEmbed } = require("discord.js");
const functions = require("@functions");

module.exports = {
    name: "whois",
    aliases: ["who", "user", "userinfo"],
    category: "info",
    description: "Returns user and member information",
    usage: "[username | id | mention]",
    run: (client, message, args, con, tools) => {

        /* Get a users information */
        function getMember(message, toFind = '') {
            toFind = toFind.toLowerCase();
            let target = message.guild.members.cache.get(toFind);
            if (!target && message.mentions.members)
                target = message.mentions.members.first();
            if (!target && toFind) {
                target = message.guild.members.cache.get(member => {
                    return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
                });
            }
            if (!target) 
                target = message.member;
            return target;
        }

        function formatDate(date) {
            return new Intl.DateTimeFormat('en-US').format(date)
        }

        const member = getMember(message, args.join(" "));

        if (!member) {
            message.channel.send("Specified user could not be found.") 
        }

        // Member variables
        const joined = formatDate(member.joinedAt);
        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'none';
        
        const uRoles = roles.split(',')
        // User variables
        const created = formatDate(member.user.createdAt);

        if (member.user.presence.game) 
            var game = ('Currently playing', `** Name:** ${member.user.presence.game.name}`);
        else{
            var game = "Currently not playing a game."
        }

        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor(client.embedColor)

            .addField('**User information:**', 
            `**-> Display name:** ${member.displayName}
            **-> Username: ** ${member.user.username}
            **-> Discriminator** ${member.user.discriminator}
            **-> ID: ** ${member.id}
            **-> Status: ** ${member.presence.status}
            **-> Game: ** ${game}
            **-> Created at**: ${created}`)

            .addField('**Member information:**',
            `**-> Joined at:** ${joined}
            **-> Roles[${uRoles.length}]:** ${roles}`)
            
            .setTimestamp()

        

        message.channel.send(embed);
    }
}