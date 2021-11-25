const { MessageAttachment } = require("discord.js");
const canvacord = require('canvacord')
const levels = require('../../Utils/levels.js')

module.exports = {
    name: "level",
    category: "leveling",
    description: "Displays the users current level and xp",
    usage: "<id | mention> <reason>",
    run: async (client, message, args, helper, tools) => {

        let person = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(person) var leveled = person.id
        if(!person) var leveled = message.author.id

        const Level = await helper.selectData(`SELECT * FROM user_levels WHERE server_id = ? AND discord_id = ?`, [message.guild.id, leveled])
        if(Level) {
            if(Level.level == 1) var lexp = levels.level2
            if(Level.level == 2) var lexp = levels.level3
            if(Level.level == 3) var lexp = levels.level4
            if(Level.level == 4) var lexp = levels.level5
            if(Level.level == 5) var lexp = levels.level6
            if(Level.level == 6) var lexp = levels.level7
            if(Level.level == 7) var lexp = levels.level8
            if(Level.level == 8) var lexp = levels.level9
            if(Level.level == 9) var lexp = levels.level10
            if(Level.level == 10) var lexp = levels.level11
            if(Level.level == 11) var lexp = levels.level12
            if(Level.level == 12) var lexp = levels.level13
            if(Level.level == 13) var lexp = levels.level14
            if(Level.level == 14) var lexp = levels.level15
            if(Level.level == 15) var lexp = levels.level16
            if(Level.level == 16) var lexp = levels.level17
            if(Level.level == 17) var lexp = levels.level18
            if(Level.level == 18) var lexp = levels.level19
            if(Level.level == 19) var lexp = levels.level20
            if(Level.level == 20) var lexp = levels.level21
            if(Level.level == 21) var lexp = levels.level22
            if(Level.level == 22) var lexp = levels.level23
            if(Level.level == 23) var lexp = levels.level24
            if(Level.level == 24) var lexp = levels.level25
            if(Level.level == 25) var lexp = levels.level26
            if(Level.level == 26) var lexp = levels.level27
            if(Level.level == 27) var lexp = levels.level28
            if(Level.level == 28) var lexp = levels.level29
            if(Level.level == 29) var lexp = levels.level30
            if(Level.level == 30) var lexp = levels.levelMax

            var url = 'https://beautibal.com/wp-content/uploads/2020/04/grey-background.jpg'

            try{
                if(!person) {

                    const rank = new canvacord.Rank()
                    .setBackground("IMAGE", url)
                    .setRank(0, "", false)
                    .setLevel(Level.level)
                    .setAvatar(message.member.user.displayAvatarURL({ format: 'jpg' }))
                    .setCurrentXP(Level.xp)
                    .setRequiredXP(lexp)
                    .setStatus("online")
                    .setProgressBar('#d25aed', "COLOR")
                    .setUsername(message.member.user.username)
                    .setDiscriminator(message.member.user.discriminator);

                    rank.build().then(data => {
                        const attachment = new MessageAttachment(data, "RankCard.png");
                        message.channel.send(attachment);
                    })
                } else{

                    const prank = new canvacord.Rank()
                    .setBackground("IMAGE", url)
                    .setRank(0, "", false)
                    .setLevel(Level.level)
                    .setAvatar(person.user.displayAvatarURL({ format: 'jpg' }))
                    .setCurrentXP(Level.xp)
                    .setRequiredXP(lexp)
                    .setStatus("online")
                    .setProgressBar('#d25aed', "COLOR")
                    .setUsername(person.user.username)
                    .setDiscriminator(person.user.discriminator);

                    prank.build().then(data => {
                        const attachment = new MessageAttachment(data, "RankCard.png");
                        message.channel.send(attachment);
                    })
                }
            }catch (err) {
                console.log(`Error sending rank attachment ${err}`);
            };
        } else {
            message.reply('User has not sent a message')
        }
    }
}