const { MessageEmbed } = require('discord.js')
const con = require('@database');
const levelElos = require('../Utils/levels.js')
const helper = require('@helper')

module.exports = {

    x: async (client, oldMember, newMember) => {

        //Joining
        if (newMember.channelID) {
            await con.query(`SELECT * FROM autovcs WHERE server_id='${newMember.guild.id}'`, async function (err, rows) {
                if (rows && rows.length) {
                    await rows.forEach(async function (vc) {
                        var user = newMember.guild.members.cache.get(newMember.id);
                        if (vc.vc_id == newMember.channelID) {
                            if (vc.vc_limit) var voiceChannel = await newMember.guild.channels.create(`⏳`, { type: 'voice', userLimit: vc.vc_limit });
                            if (!vc.vc_limit) var voiceChannel = await newMember.guild.channels.create(`⌛`, { type: 'voice', });
                            await voiceChannel.setParent(vc.vc_category).then(async function () {
                                setTimeout(async function () { await voiceChannel.lockPermissions().catch(function (e){ }); }, 500);
                            });
                            await user.voice.setChannel(voiceChannel).catch(function (e) { })

                            var newVC_payload = {
                                id: null,
                                server_id: newMember.guild.id,
                                vc_id: vc.vc_id,
                                created_id: voiceChannel.id,
                                vc_name: vc.vc_name,
                                vc_creator: newMember.id,                            
                                locked: '0',
                                allowed: ''
                            }

                            await con.query(`INSERT INTO active_vcs SET ?`, newVC_payload, function (err) {
                                if (err) {
                                    voiceChannel.setName(`Bugged Auto VC Detected`).catch(function (e) { });
                                    console.log(`There was an error creating an auto vc ${err}`);
                                    user.send(`Hey, we see that you've created an auto vc, although it turns out to be bugged. We are deleting this vc in 5 seconds.`)
                                    setTimeout(function () {
                                        voiceChannel.delete().catch(function (e) { })
                                    }, 5000);
                                    return;
                                }
                            });
                            await con.query(`SELECT * FROM active_vcs WHERE server_id='${newMember.guild.id}' AND vc_id='${vc.vc_id}'`, async function (err, rows) {
                                if (rows && rows.length) {
                                    check_vcs(vc.vc_id, vc.vc_name);
                                }
                            });
                        }
                    });
                }
            })
        }
        
        //Leaving
        if (newMember.channelID == null || oldMember.channelID) {
            var data = newMember.guild.channels.cache.get(oldMember.channelID);
            await con.query(`SELECT * FROM active_vcs WHERE server_id='${newMember.guild.id}' AND created_id='${oldMember.channelID}'`, async function (err, rows) {
                if (rows && rows.length) {
                    if (data.members.size == 0) {
                        await data.delete().catch(function (e) { })
                        await con.query(`DELETE FROM active_vcs WHERE server_id='${newMember.guild.id}' AND created_id='${oldMember.channelID}'`, async function (err, rows) {
                            if (err) console.log(`There was an error removing data from active vcs!`);
                        });
                        check_vcs(rows[0].vc_id, rows[0].vc_name);
                    }
                }
            });
        }


        async function check_vcs(vc_id, vc_name) {
            setTimeout(async function () {
                await con.query(`SELECT * FROM active_vcs WHERE server_id='${newMember.guild.id}' AND vc_id='${vc_id}'`, async function (err, rows) {
                    //console.log(`Searching for rows`);
                    if (rows && rows.length) {
                        //console.log(`${rows.length} rows found!`);
                        i = 0;
                        rows.forEach(function (x) {
                            i++
                            var data = newMember.guild.channels.cache.get(x.created_id);
                            if(!data) return;
                            data.setName(`${vc_name} #${i}`).catch(function (e) {
                                //console.log(e);
                            })
                            //console.log(`Renaming a channel to ${vc_name} #${i}`)
                        });
                    }
                });
            }, 3000);
        }
    }
}