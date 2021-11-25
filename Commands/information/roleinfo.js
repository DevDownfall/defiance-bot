const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "roleinfo",
    category: "info",
    description: "Show info a specific role",
    run: async (client, message, args, con, tools) => {

        var role = args[0];
        if (!role) return message.reply(`please @role`).then(m => m.delete({ timeout: 5000 }));

        if (role.startsWith('<@&')) {
            var roleid = role.replace('<@&', '');
            var roleid = roleid.replace('>', '')
        } else {
            return message.channel.send("Please specify a valid role.")
        }

        var role = message.guild.roles.cache.get(roleid)
        let memberCount = message.guild.roles.cache.get(roleid).members.size;

        var roleCreated = message.guild.createdAt.toString();
        var roleCreated = roleCreated.split(' ');

        let embed = new MessageEmbed()
            .setTitle(`**Role Info - ${role.name}**`)
            .setColor(client.embedColor)
            .addField(`**Role Name**`, role.name, true)
            .addField(`**Total Members**`, memberCount, true)
            .addField(`**Role Colour**`, `#${role.color}`, true)
            .addField(`**Created**`, `${roleCreated[0]} ${roleCreated[1]} ${roleCreated[2]} ${roleCreated[3]}`)
            .setFooter(`ID: ${role.id}`)

        message.channel.send(embed)

    }
}