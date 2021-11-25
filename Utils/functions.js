module.invalidable = true

const axios = require('axios')
const Helper = require('@helper')
const { MessageEmbed } = require('discord.js')

module.exports = {

    addEmojis: function(x, array) {
        const wait = ms => new Promise(res => setTimeout(res, ms));
        var base = 0;
        array.forEach(async a => {
            base += 500;
            //await wait(base);
            x.react(a);
        });
    },

}