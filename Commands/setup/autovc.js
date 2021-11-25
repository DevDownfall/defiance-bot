const con = require('@database')

module.exports = {
    name: "autovc",
    category: "auto vc",
    description: "Create/Remove an auto vc (Admin)",
    perms: "Admin",
    usage: "<voice channel id> <1-99/max> <category id> <auto vc name>",
    run: async (client, message, args, tools) => {

        var command = args[0];

        message.delete();

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("you do not have permission to use this command. Please contact an administrator.").then(m => m.delete({ timeout: 5000 }));

        if (!command) return message.reply(`please specify whether you want to \`add\` or \`remove\` a auto vc`);

        if(command.toLowerCase() == 'add')
        message.reply(`please specify the voice channel id`).then(async msg => {
            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                msg.delete({ timeout: 500 }); var channelID = collected.first().content;
                if(isNaN(channelID) == true) return message.reply(`invalid voice channel id, please restart.`);
                message.reply(`please specify a category id`).then(async msg => {
                    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                        msg.delete({ timeout: 500 }); var categoryID = collected.first().content;
                        if(isNaN(categoryID) == true) return message.reply(`invalid category id, please restart.`);
                        message.reply(`please specify a limit, <1-99>`).then(async msg => {
                            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                                msg.delete({ timeout: 500 }); var voiceLimit = collected.first().content;
                                if(isNaN(voiceLimit) == false || voiceLimit.toLowerCase() == 'max'){}else{ return message.reply(`invalid voice limit, please restart.`); }
                                if(isNaN(voiceLimit) == false){ if(voiceLimit >= 100) return message.reply(`invalid voice limit, please restart.`); }
                                if(voiceLimit.toLowerCase == 'max'){ var voiceLimit = ''; }
                                message.reply(`please specify a vc name`).then(async msg => {
                                    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                                        msg.delete({ timeout: 500 }); var voiceName = collected.first().content;
                                        createAutoVC(channelID, categoryID, voiceLimit, voiceName);
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        if(command.toLowerCase() == 'remove'){
            message.reply(`please specify the voice channel id`).then(async msg => {
                message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(collected => {
                    msg.delete({ timeout: 500 }); var channelID = collected.first().content;
                    if(isNaN(channelID) == true) return message.reply(`invalid voice channel id, please restart.`);
                    con.query(`DELETE FROM autovcs WHERE server_id='${message.guild.id}' AND vc_id=?`, [channelID], function (err) {
                        if (err) return message.reply(`there was an error whilst removing the auto vc.`);
                        message.reply(`auto vc removed!`);
                    });
                });
            });
        }

        async function createAutoVC(channelID, categoryID, voiceLimit, voiceName){

            var payload = {
                id: null, server_id: message.guild.id, vc_id: channelID, vc_category: categoryID, vc_limit: voiceLimit, vc_name: voiceName, active_vcs: ''
            }

            con.query(`SELECT * FROM autovcs WHERE server_id='${message.guild.id}' AND vc_id=?`, [channelID], function (err, rows){
                if(rows && rows.length){
                    return message.reply(`there is already an auto vc with that channel id!`);
                }else{
                    con.query(`INSERT INTO autovcs SET ?`, payload, function (err) {
                        if (err) return message.reply(`there was an error whilst creating the auto vc.`);
                        message.reply(`auto vc created!`);
                    });
                }
            });
        }
    }
}