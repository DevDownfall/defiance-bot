const leaveEvent = require('../../Events/messageReactionRemove.js');

module.exports = (async (client, messageReaction, user) => {

    leaveEvent.x(client, messageReaction, user);

});