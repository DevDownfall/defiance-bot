module.invalidable = true

const Canvas = require('canvas')
const { MessageAttachment } = require('discord.js')
const con = require('@database')

module.exports = {
    name: 'bl',
    alises: ['t'],
    category: 'dev',
    description: '',
    usage: '',
    run: async (client, message, args, Helper, tools) => {
        let downy = '607430749620011008'

        const Members = message.guild.members.cache.get('607430749620011008')
        console.log(Members.voice)

    }
}