module.invalidable = true

const { MessageEmbed } = require("discord.js");
const functions = require("@functions");
const pagination = require('@pagination');
const Axios = require('axios')

module.exports = {
    name: "joke",
    category: "dev",
    description: "Set up the bot for your discord server! (Admin)",
    usage: "",
    run: async (client, message, args, Helper, tools) => {

        const Joke = await Axios.get(`https://dad-jokes.p.rapidapi.com/random/joke`, {
            headers: {
                "x-rapidapi-app": "Pheasant",
                "x-rapidapi-host": "dad-jokes.p.rapidapi.com",
                "x-rapidapi-key": "c26553ed33mshc3d5e9aac6ad965p130ceajsnc1a8bb1acdc5",
                "useQueryString": true
            }
        })
        let Embed = new MessageEmbed()
        .setColor(client.embedColour)
        .setTitle(`Joke`)
        .setDescription(`
        ${Joke.data.body[0].setup}

        **${Joke.data.body[0].punchline}**
        `).setFooter(client.embedFooter)

        message.channel.send(Embed).then(msg => {
            msg.react('a:855149426385616916:855901561544638504')
        })
    }
}