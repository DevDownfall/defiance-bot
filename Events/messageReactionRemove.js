module.invalidable = true

const Helper = require('@helper')

module.exports = {

    x: async (client, messageReaction, user) => {

        var con = require('@database');

        var reactionEmoji = messageReaction.emoji;
        var channelID = messageReaction.message.channel.id;
        var messageID = messageReaction.message.id;

        if(messageReaction.message.partial) await messageReaction.message.fetch();
        if(messageReaction.partial) await messageReaction.fetch();

        if (user.bot) return;

        con.query(`SELECT * FROM reaction_roles WHERE channel_id = '${channelID}' AND message_id = '${messageID}'`, function(err, rows){
            if(err) return console.log(`Error with reaction roles remove selection`);
            if(rows && rows.length){
                rows.forEach(function(r){
                    try {
                        if(r.emoji == reactionEmoji.name) removeRole(r.role_id);
                        if(r.emoji == reactionEmoji.id) removeRole(r.role_id);
                    } catch(e) {
                        
                    }
                });
            }
        });

        async function removeRole(roleID){
            try { 
                await messageReaction.message.guild.members.cache.get(user.id).roles.remove(roleID).catch(function(e){
                    //err;
                });
            }catch(e){

            }
        }

        const Clip = await Helper.selectData(`SELECT * FROM defiance_clips WHERE message_id = ?`, [ messageID ])
        if(Clip) {
            if(reactionEmoji.name == '👍'){
                await Helper.updateData(`UPDATE defiance_clips SET upvotes = ? WHERE message_id = ?`, [ Clip.upvotes - 1, messageID ])
            }else if(reactionEmoji.name == '👎'){
                await Helper.updateData(`UPDATE defiance_clips SET downvotes = ? WHERE message_id = ?`, [ Clip.downvotes - 1, messageID ])
            }else {
                console.log('emoji not found')
            }
        }else {
            console.log('clip not found')
        }



    }
}