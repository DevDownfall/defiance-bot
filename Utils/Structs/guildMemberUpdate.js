const updateEvent = require('../../Events/guildMemberUpdate.js');

module.exports = (async (client, oldMember, newMember) => {
    updateEvent.profileEdit(client, oldMember, newMember);


});