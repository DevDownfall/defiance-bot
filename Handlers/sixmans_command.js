const { readdirSync } = require("fs");

module.exports = (client) => {
    readdirSync(`${__dirname}/../Sixmans Commands/`).forEach(dir => {
        const commands = readdirSync(`${__dirname}/../Sixmans Commands/${dir}/`).filter(file => file.endsWith(".js"));
        commands.forEach(function (command) {
            let pull = require(`${__dirname}/../Sixmans Commands/${dir}/${command}`);
            if (!pull.name) return;
            if (pull.name) client.sixmans_commands.set(pull.name, pull);
            if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.sixmans_aliases.set(alias, pull.name));
        });
    });
}