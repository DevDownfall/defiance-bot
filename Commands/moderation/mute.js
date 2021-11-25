module.invalidable = true

const {MessageEmbed} = require("discord.js");
const ms = require('ms');
const functions = require('@functions');
const Helper = require('@helper')

module.exports = {
    name: "mute",
    description: "Mutes a member in the discord!",
    usage: "mute <user> <reason> <time>",
    aliases: ["m", "nospeak"],
    perms: 'Staff',
    run: async (client, message, args, tools) => {


        // check if the command caller has permission to use the command
        if(!message.member.hasPermission("MANAGE_MESSAGES") || !message.guild.owner) return message.channel.send("You dont have permission to use this command.");

        if(!message.guild.me.hasPermission(["MANAGE_MESSAGES"])) return message.channel.send("I don't have permission to add roles!")

        //define the reason and mutee
        let mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if(!mutee) return message.channel.send("Please supply a user to be muted!");

        let muteTime = args[1]

        if(!muteTime) return message.channel.send(`Please specify a mute time! Ex: 20m`)

        let reason = args.slice(2).join(" ");
        if(!reason) reason = "No reason given"

        //define mute role and if the mute role doesnt exist then create one
        let muterole = message.guild.roles.cache.find(r => r.name === "Muted")
        if(!muterole) {
            function sleep(ms) {
                return new Promise((resolve) => {
                    setTimeout(resolve, ms);
                });
            }
            if (!message.guild.roles.cache.find(r => r.name === "Muted")) {
                message.guild.roles.create({
                    data: {
                        name: 'Muted',
                        permissions: [
                            "VIEW_CHANNEL"
                        ]
                    }
                }).then(role => {
                    role.setPosition(0); 
                })
            }
            await sleep(1000);
        }

        //add role to the mentioned user and also send the user a dm explaing where and why they were muted
        mutee.roles.add(message.guild.roles.cache.find(r => r.name === "Muted").id).then(() => {
            message.delete({timeout:500})
            mutee.send(`You have been muted in ${message.guild.name} for ${ms(ms(muteTime))}. Reason: **${reason}**`)
            message.channel.send(`${mutee.user.username} was successfully muted.`)
        })
        mute(true)

        // Check if user is in a voice channel
        async function mute(value){
            const mutedMember = message.guild.members.cache.get(mutee.id)
            const mutedChannel = mutedMember.voice.channel
            if(!mutedChannel) return

            mutedChannel.members.forEach(m => {
                if(m.id == mutee.id){
                    m.voice.setMute(value)
                }
            })
        }

        var payload = {
            id: null, 
            server_id: message.guild.id, 
            discord_id: mutee.id,
            type: 'mute',
            reason: reason,
            time: null
        }

        // Log the mute incident into the database
        await Helper.insertData(`INSERT INTO user_incidents SET ? `, [ payload ])

        let embed = new MessageEmbed()
            .setAuthor(client.embedTitle, client.embedURL)
            .setColor(client.embedColour)
            .setDescription(`
            **User Muted - LOG**
            - Muted User: ${mutee} | ${mutee.id}
            - Muted By:   ${message.member} | ${message.member.id}
            - Mute Reason:  ${reason}
            `)
            .setFooter(client.embedFooter)
            .setThumbnail(mutee.user.avatarURL())
            .setTimestamp()            

        let unmuteEmbed = new MessageEmbed()
            .setColor(client.embedColour)
            .setDescription(`${mutee.user.username} has been unmuted!`)

        mutee._roles.forEach(async(role) => {
            var payload = { id: null, server_id: message.guild.id, discord_id: mutee.id, roles: role}
            await Helper.insertData(`INSERT INTO muted_users SET ?`, [ payload ])

            mutee.roles.remove(role)
        });
        
        const Server = await Helper.selectData(`SELECT * FROM servers WHERE server_id = ?`, [ message.guild.id ])
        const lchannel = Server.logs_id

        try{
            client.channels.cache.get(lchannel).send(embed)
        } catch (err) {}

        const muted = await Helper.selectAll(`SELECT * FROM muted_users WHERE server_id = ? AND discord_id = ?`, [ message.guild.id, mutee.id ])

        setTimeout(async function(){
            mutee.roles.remove(message.guild.roles.cache.find(r => r.name === "Muted").id);
            
            try {
                muted.forEach(async function (roles) {
                    if (roles.roles == '') return;
                    await message.guild.members.cache.get(mutee.id).roles.add(roles.roles.toString())
                    await Helper.deleteData(`DELETE FROM muted_users WHERE server_id = ? AND discord_id = ?`, [ message.guild.id, mutee.id])
                });
            } catch (err) {
                console.log(err)
            } 

            client.channels.cache.get(lchannel).send(unmuteEmbed)
            mute(false)
            mutee.send(unmuteEmbed)
        }, ms(muteTime))
    }
}
