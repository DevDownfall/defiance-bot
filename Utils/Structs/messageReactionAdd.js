const reactionEvent = require('../../Events/messageReactionAdd.js');

module.exports = (async (client, messageReaction, user) => {

    reactionEvent.x(client, messageReaction, user);

});