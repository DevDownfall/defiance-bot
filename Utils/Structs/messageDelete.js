const deleteEvent = require('../../Events/messageDelete.js')

module.exports = (async (client, message) => {
    deleteEvent.x(client, message)
})