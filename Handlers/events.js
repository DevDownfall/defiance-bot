const { readdirSync } = require("fs");

module.exports = (client) => {

    const events = readdirSync(`${__dirname}/../Utils/Structs`).filter(file => file.endsWith(".js"));
    events.forEach(function (event) {
        var pull = require(`${__dirname}/../Utils/Structs/${event}`);
        client.on(event.replace('.js', ''), pull.bind(null, client))
    });

}