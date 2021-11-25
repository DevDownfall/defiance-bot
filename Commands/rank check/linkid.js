const { MessageEmbed, MessageAttachment } = require("discord.js");
const functions = require("@functions");
const request = require('request-promise');
const con = require('@database')

module.exports = {
    name: "linkid",
    aliases: ["registerid"],
    category: "Rank Check",
    description: "Link your Rocket League id/name to the bot, after linking you can pass in 'me' instead of your id",
    usage: "<platform> <id>",
    run: async(client, message, args, tools) => {

        await con.query(`SELECT * FROM rankcheck_links WHERE discord_id='${message.author.id}'`, function(err, rows) {
            if (rows && rows.length) {
                return message.channel.send(`You have an account linked already!\nID: ${rows[0].user}\nPlatform: ${rows[0].platform}`)
            } else {
                start();
            }
        });

        function start() {
            var platform = args[0];
            var id = args.slice(1).join(" ");

            if (!platform) { return message.channel.send(`Invalid Syntax: ${tools.prefix}linkid <pc,xbox,ps4,epic> <id>\nEx: ${tools.prefix}linkid pc varedz`) }
            if (!id) { return message.channel.send(`Invalid Syntax: ${tools.prefix}linkid <pc,xbox,ps4,epic> <id>\nEx: ${tools.prefix}linkid pc varedz`) }

            if (platform.toLowerCase() == 'pc') {
                request('https://playrl.com/rg2?user=' + id + '&platform=steam').then(body => {

                    var variable = body.replace(/ | /g, '');
                    var obj = JSON.parse(variable);
                    var info = { onesmmr: obj[0].ones.mmr, doublesmmr: obj[1].doubles.mmr, standardmmr: obj[2].standard.mmr, solostandardmmr: obj[3].solostandard.mmr }
                    if (info.onesmmr == 'N/A' && info.doublesmmr == 'N/A' && info.standardmmr == 'N/A' && info.solostandardmmr == 'N/A') return message.channel.send(`That account does not exist!`);

                    return linkAcc(platform, id, message.author.id);
                }).catch(function(err) {
                    return message.channel.send(`Sorry, we couldnt find that user!\nEx: ${tools.prefix}linkid pc varedz`)
                })
            } else if (platform.toLowerCase() == 'xbox') {
                request('https://playrl.com/rg2?user=' + id + '&platform=xbl').then(body => {

                    var variable = body.replace(/ | /g, '');
                    var obj = JSON.parse(variable);
                    var info = { onesmmr: obj[0].ones.mmr, doublesmmr: obj[1].doubles.mmr, standardmmr: obj[2].standard.mmr, solostandardmmr: obj[3].solostandard.mmr }
                    if (info.onesmmr == 'N/A' && info.doublesmmr == 'N/A' && info.standardmmr == 'N/A' && info.solostandardmmr == 'N/A') return message.channel.send(`That account does not exist!`);

                    return linkAcc(platform, id, message.author.id);
                }).catch(function(err) {
                    return message.channel.send(`Sorry, we couldnt find that user!\nEx: ${tools.prefix}linkid xbox varedz`)
                })
            } else if (platform.toLowerCase() == 'epic') {
                request('https://playrl.com/rg2?user=' + id + '&platform=epic').then(body => {

                    var variable = body.replace(/ | /g, '');
                    var obj = JSON.parse(variable);
                    var info = { onesmmr: obj[0].ones.mmr, doublesmmr: obj[1].doubles.mmr, standardmmr: obj[2].standard.mmr, solostandardmmr: obj[3].solostandard.mmr }
                    if (info.onesmmr == 'N/A' && info.doublesmmr == 'N/A' && info.standardmmr == 'N/A' && info.solostandardmmr == 'N/A') return message.channel.send(`That account does not exist!`);

                    return linkAcc(platform, id, message.author.id);
                }).catch(function(err) {
                    return message.channel.send(`Sorry, we couldnt find that user!\nEx: ${tools.prefix}linkid xbox varedz`)
                })
            } else if (platform.toLowerCase() == 'ps4') {
                request('https://playrl.com/rg2?user=' + id + '&platform=psn').then(body => {

                    var variable = body.replace(/ | /g, '');
                    var obj = JSON.parse(variable);
                    var info = { onesmmr: obj[0].ones.mmr, doublesmmr: obj[1].doubles.mmr, standardmmr: obj[2].standard.mmr, solostandardmmr: obj[3].solostandard.mmr }
                    if (info.onesmmr == 'N/A' && info.doublesmmr == 'N/A' && info.standardmmr == 'N/A' && info.solostandardmmr == 'N/A') return message.channel.send(`That account does not exist!`);

                    return linkAcc(platform, id, message.author.id);
                }).catch(function(err) {
                    return message.channel.send(`Sorry, we couldnt find that user!\nEx: ${tools.prefix}linkid ps4 varedz`)
                })
            } else {
                return message.channel.send(`Invalid Syntax: ${tools.prefix}linkid <pc,xbox,ps4,epic> <id>\nEx: ${tools.prefix}linkid pc varedz`)
            }

            function linkAcc(platform, id, userid) {
                var payload = {
                    id: null,
                    discord_id: userid,
                    platform: platform,
                    user: id
                }
                con.query(`INSERT INTO rankcheck_links SET ?`, payload, function(err) {
                    if (err) message.channel.send(`Failed to link, err: ${err}`)
                    message.channel.send(`Successfully linked account!`);
                });
            }
        }
    }
}