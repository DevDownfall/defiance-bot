module.invalidable = true;

const Discord = require('discord.js');
const fs = require('fs');

module.exports = (client) => {

    //Create collections
    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.categories = fs.readdirSync(`${__root}/Commands`);

    client.sixmans_commands = new Discord.Collection()
    client.sixmans_aliases = new Discord.Collection()
    client.sixmans_categories = fs.readdirSync(`${__root}/Sixmans Commands`)

    client.queue = new Map()
 
    //Settings
    client.embedTitle = 'Defiance';
    client.embedURL = 'https://cdn.discordapp.com/icons/862469337231392819/30ee7f0820fb30d1feefc00b62265ef6.webp?size=256';
    client.embedFooter = 'Defiance - by Downfall';
    client.embedColour = '#ffffff';
}
