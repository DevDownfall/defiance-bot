module.invaldiable = true

const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Shows you all plugins, or help on a specific command.",
    usage: "[command | alias]",
    run: async (client, message, args, con, tools) => {

        if (args[0]) {
            if (args[0].includes('_')) { var cargs = args[0].replace('_', ' ') } else { var cargs = args[0] }
            if (client.categories.includes(cargs.toLowerCase())) {
                return catCMDS(client, message, cargs.toLowerCase(), tools)
            } else {
                return getCMD(client, message, cargs, tools);
            }
        } else {
            return getAll(client, message, tools);
        }

        function catCMDS(client, message, cat, tools) {
            const embed = new MessageEmbed()
                .setAuthor(`Showing you commands for plugin: ${cat}`, client.embedURL)
                .setThumbnail(client.embedURL).setColor(client.embedColour)
            const commands = (category) => {
                var commands = client.commands;
                if (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.some(role => role.name === 'Staff')) { 
                    var commands = commands.filter(cmd => cmd.category === category).map(cmd => `\`${tools.prefix}${cmd.name}\`\n${cmd.description}`).join("\n"); return commands; 
                }
                var commands = commands.filter(cmd => cmd.category === category && cmd.perms != 'Staff').map(cmd => `\`${tools.prefix}${cmd.name}\`\n${cmd.description}`).join("\n"); return commands;
            }    
            embed.setDescription(commands(cat))
            message.channel.send(embed);
        }
        
        function getAll(client, message, tools) {
            const embed = new MessageEmbed()
                .setAuthor(`${client.embedTitle} Plugins Commands`, client.embedURL)
                .setThumbnail(client.embedURL).setColor(client.embedColour)
            client.categories.forEach(function (c) {
                var cCommand = c;
                if(c == 'dev' || c == 'rank check' || c == 'information') return;
                if (!message.member.hasPermission("ADMINISTRATOR") || !message.member.roles.cache.some(role => role.name === 'Staff')) { 
                    if(c == 'setup' || c == 'moderation') return
                }
                //if(c == 'moderation' || c == 'setup' && !message.member.roles.cache.some(role => role.name === 'Staff')) return
                if (c.includes(' ')) { var cCommand = c.replace(' ', '_') }
                embed.addField(`**${c.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })}**`, `\`${tools.prefix}help ${cCommand}\``, true)
            });
            return message.channel.send(embed);
        }
        
        function getCMD(client, message, input, tools) {
            const embed = new MessageEmbed()
            const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
            let info = `No information found for command **${input.toLowerCase()}**`;
            if (!cmd) { return message.channel.send(embed.setColor(client.embedColour).setDescription(info)); }
            if (cmd.name) info = `**Command name**: ${cmd.name}`;
            if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
            if (cmd.description) info += `\n**Description**: ${cmd.description}`;
            if (cmd.usage) {
                info += `\n**Usage**: ${cmd.usage}`;
                embed.setFooter(`Syntax: <> = required, [] = optional`);
            }
            return message.channel.send(embed.setColor(client.embedColour).setDescription(info));
        }   
    }
} 