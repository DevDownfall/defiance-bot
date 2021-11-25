module.invalidable = true

const Axios = require('axios')
const { MessageEmbed } = require('discord.js')


module.exports = {
    name: "inspire",
    category: "dev",
    description: "Inspire yourself",
    usage: "",
    run: async (client, message, args, Helper, tools) => {

        const Quote = await Axios.get('https://zenquotes.io/api/random')
        
        let Embed = new MessageEmbed()
        .setTitle('Inspirational Quote')
        .setDescription(`${Quote.data[0].q}
        
        - **${Quote.data[0].a}**`).setColor(client.embedColor)

        message.channel.send(Embed)

    }
}
