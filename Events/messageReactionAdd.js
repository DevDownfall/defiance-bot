module.invalidable = true

const Helper = require('@helper')

module.exports = {
    
    x: async (client, messageReaction, user) => {

        var con = require('@database');
        const { MessageEmbed, MessageCollector } = require("discord.js");
        const moment = require("moment");

        var reactionEmoji = messageReaction.emoji;
        var channelID = messageReaction.message.channel.id;
        var messageID = messageReaction.message.id;

        if (messageReaction.message.partial) await messageReaction.message.fetch();
        if (messageReaction.partial) await messageReaction.fetch();

        if (user.bot) return;

        con.query(`SELECT * FROM reaction_roles WHERE channel_id = '${channelID}' AND message_id = '${messageID}'`, function (err, rows) {
            if (err) return console.log(`Error with reaction roles add selection`);
            if (rows && rows.length) {
                rows.forEach(function (r) {
                    if (r.emoji == reactionEmoji.name) addRole(r.role_id);
                    if (r.emoji == reactionEmoji.id) addRole(r.role_id);
                });
            }
        });

        async function addRole(roleID) {
            await messageReaction.message.guild.members.cache.get(user.id).roles.add(roleID).catch(function (e) {
            });
        }

        let eArr = ['👍', '👎']
        const Clip = await Helper.selectData(`SELECT * FROM defiance_clips WHERE message_id = ?`, [ messageID ])
        if(Clip) {
            if(reactionEmoji.name == '👍'){
                await Helper.updateData(`UPDATE defiance_clips SET upvotes = ? WHERE message_id = ?`, [ Clip.upvotes + 1, messageID ])
            }else if(reactionEmoji.name == '👎'){
                await Helper.updateData(`UPDATE defiance_clips SET downvotes = ? WHERE message_id = ?`, [ Clip.downvotes + 1, messageID ])
            }else {
                console.log('emoji not found')
            }
        }else {
            console.log('clip not found')
        }
        
    }
}