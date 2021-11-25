module.invalidable = true

const { MessageEmbed } = require('discord.js')
const Helper = require('@helper')

module.exports = {

    profileEdit: async (client, oldMember, newMember) => {

        //const Server = await Helper.selectData(`SELECT * FROM servers WHERE server_id = ?` [ newMember.guild.id ])
        const uChannel = newMember.guild.channels.cache.get('833879879094501416')

        if(oldMember._roles > newMember._roles){
            console.log(``)
        }

        //console.log(oldMember)
        //console.log(oldMember)

        let roleEmbed = new MessageEmbed()
        .setTitle(`User has been edited.`)
        .setColor(client.embedColour)
        .setDescription(`
        User`)

        // if(oldRoles.length < newRoles.length) {
        //     console.log('Added a role')
        //     var newRole = newRoles.slice(-1).pop()
        // }else if(oldRoles.length > newRoles.length){
        //     console.log('Removed a role')
        //     var newRole = newRoles.slice(-1).pop()
        // }

        //uChannel.send(roleEmbed)
    },

}