module.invalidable = true

const { MessageEmbed } = require('discord.js')
const functions = require('@functions')
const Helper = require('@helper')

module.exports = {
    name: 'movienight',
    category: "setup",
    description: "move night",
    usage: "",
    run: async (client, message, args, helper, tools) => {

        // if(message.author.id != '607430749620011008') return

        const obj = {
            action: ['Venom', 'Nerve'],
            comedy: ['School of Rock', "We're the Millers"],
            family: ['Space Jam', 'Spirited Away'],
            horror: ['Hereditary', 'Insidious', 'The Possession of Hannah Grace']
        }

        var raction = obj.action[Math.floor(Math.random() * obj.action.length)]
        var rcomedy = obj.comedy[Math.floor(Math.random() * obj.comedy.length)];
        var rfamily = obj.family[Math.floor(Math.random() * obj.family.length)];
        var rhorror = obj.horror[Math.floor(Math.random() * obj.family.length)];
        
        const Channel = message.guild.channels.cache.get('840324006191169536')
        
        Channel.send('<@&840322803348668416>').then(msg => msg.delete({timeout: 1000}))
        let movieEmbed = new MessageEmbed()
        .setTitle('**Select a move to watch**')
        .setDescription(`Select a move by reacting to the corresponding emoji.`)
        .addField(`**Action**`, `:one: ${raction}`, true).addField(`**Comedy**`, `:two: ${rcomedy}`, true).addField(`**Family Friendly**`, `:three: ${rfamily}`, true)
        .addField(`**Horror**`, `:four: ${rhorror}`, true)

        let arr = ['1️⃣', '2️⃣', '3️⃣', '4️⃣']
        Channel.send(movieEmbed).then(async(msg) => {
            functions.addEmojis(msg, arr)
            let payload = { id: null, channel_id: message.channel.id, message_id: msg.id }
            await Helper.insertData(`INSERT INTO movienight SET ?`, [ payload ])

            setTimeout(async() => {

                function getMaxOfArray(numArray) {
                    return Math.max.apply(null, numArray);
                }
                let arr = []
                let fmovie = ''

                const cat = await Helper.selectData(`SELECT action,comedy,family,horror FROM movienight WHERE message_id = ?`, [ msg.id ])
                arr.push(cat.action, cat.comedy, cat.family, cat.horror)
                const max = getMaxOfArray(arr)
                if(arr[0] == max) fmovie = raction
                if(arr[1] == max) fmovie = rcomedy
                if(arr[2] == max) fmovie = rfamily
                if(arr[3] == max) fmovie = rhorror

                let final = new MessageEmbed()
                .setTitle('**Chosen Movie**')
                .setDescription(`The tally has finished! With a total votes of ${max}, this week's movie will be **${fmovie}**`)

                Helper.deleteData(`DELETE FROM movienight WHERE message_id = ?`, [ msg.id ])
                Channel.send(final)
            }, 172800000)
        })
    }
}