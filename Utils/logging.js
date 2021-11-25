module.invalidable = true;

const colors = require('colors');

module.exports = {

    notif: function (text) {
        console.log(colors.bold.blue(text));
    },
    
    error: function (text) {
        console.log(colors.red.bold(text));
    },

    warn: function (text) {
        console.log(colors.yellow.bold(text));
    },

    wait: function(time) {
        require('util').promisify(setTimeout);
    }
};