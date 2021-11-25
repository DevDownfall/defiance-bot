const messageEvent = require('../../Events/voiceStateUpdate.js');

module.exports = (async (client, oldMember, newMember) => {

    messageEvent.x(client, oldMember, newMember);

});