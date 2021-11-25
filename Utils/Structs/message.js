const messageEvent = require('../../Events/message.js');

module.exports = (async (client, message) => {

    if(!message.guild){
        messageEvent.DM(client, message)
    }else{
        messageEvent.x(client, message);
    }
});