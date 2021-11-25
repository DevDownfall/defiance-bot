const {MessageEmbed, MessageAttachment} = require("discord.js");
const functions = require("@functions");
const request = require('request-promise');

module.exports = {
    name: "unlink",
    aliases: ["unregister"],
    category: "Rank Check",
    description: "Unlink your account",
    usage: "",
    run: async (client, message, args, con, tools) => {

        await con.query(`SELECT * FROM rankcheck_links WHERE discord_id='${message.author.id}'`, function(err, rows){
            if(rows && rows.length){
                con.query(`DELETE FROM rankcheck_links WHERE discord_id='${message.author.id}'`, function(err){
                    if(err) return message.channel.send(`There was an error unlinking your account!`);
                })
                return message.channel.send(`You've unlinked your account!`)
            }else{
                return message.channel.send(`You don't have an account linked yet, link one with ${tools.default_prefix}linkid`)
            }
        });
    }
}