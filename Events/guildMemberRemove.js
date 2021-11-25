module.invalidable = true

const functions = require('@functions')
const Helper = require('@helper');
const moment = require("moment");
const { MessageEmbed, MessageAttachment } = require('discord.js')
const Canvas = require('canvas')
const drawMultilineText = require('canvas-multiline-text')

module.exports = {

    x: async(client, member) => {
        console.log('user left')

        // Grab Server Members
        var tmembers = await member.guild.members.cache
        var bots = []
        var members = []

        tmembers.forEach(m => {
            if (m.user.bot) {
                bots.push(m.user.id)
            }else {
                members.push(m.user.id)
            }
        })

        var totalBots = bots.length
        var totalMembers = members.length

        await Helper.updateData(`UPDATE servers SET server_members = ?, server_bots = ? WHERE server_id = ?`, [ totalMembers, totalBots, member.guild.id ])

        // Update Server Stats
        const Stats = await Helper.selectData(`SELECT * FROM server_stats WHERE server_id = ?`, [member.guild.id])
        if(Stats) {
            if (Stats.stats >= '1') { var Channel = member.guild.channels.cache.get(Stats.stats_c1); Channel.setName(`Members: ${totalMembers}`).catch(function (err) { }) }
            if (Stats.stats >= '2') { var Channel = member.guild.channels.cache.get(Stats.stats_c2); Channel.setName(`Bots: ${totalBots}`).catch(function (err) { }) }
            if (Stats.stats >= '3') { var Channel = member.guild.channels.cache.get(Stats.stats_c3); Channel.setName(`Boosts: ${message.guild.premiumSubscriptionCount}`).catch(function (err) { }) }
            if (Stats.stats >= '4') { var Channel = member.guild.channels.cache.get(Stats.stats_c4); Channel.setName(`Total Users: ${totalMembers + totalBots}`).catch(function (err) { }) }
        }
    }
}