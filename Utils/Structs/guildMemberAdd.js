const joinEvent = require('../../Events/guildMemberAdd.js');

module.exports = (async (client, member) => {

    joinEvent.x(client, member);

});