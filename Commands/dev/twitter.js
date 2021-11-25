const { MessageEmbed } = require('discord.js')
const Axios = require('axios')
const Helper = require('@helper')

module.exports = {
    name: "twitter",
    category: "dev",
    description: "",
    run: async (client, message, args, tools) => {

        let Embed = new MessageEmbed()
        .setTitle('**__Defiance Staff__**')
        .setDescription(`
        **EXECUTIVES**
        CEO -> <@kfrost#4544>
        COO -> <@Kaiju#2469>
        COO -> <@king scarycow#9187>

        **UPPER LEVEL**
        Developer -> <@Downfall#4129>
        Graphics Artist -> <@JoLix#1230>
        `
        )

    }
}