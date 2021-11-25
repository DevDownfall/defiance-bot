const leaveEvent = require('../../Events/guildMemberRemove.js');

module.exports = (async (client, member) => {

    leaveEvent.x(client, member);

});