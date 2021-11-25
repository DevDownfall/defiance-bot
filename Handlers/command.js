const { readdirSync } = require("fs");

module.exports = (client) => {
    readdirSync(`${__dirname}/../Commands/`).forEach(dir => {
        const commands = readdirSync(`${__dirname}/../Commands/${dir}/`).filter(file => file.endsWith(".js"));
        commands.forEach(function (command) {
            let pull = require(`${__dirname}/../Commands/${dir}/${command}`);
            if (!pull.name) return;
            if (pull.name) client.commands.set(pull.name, pull);
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        });
    });
}