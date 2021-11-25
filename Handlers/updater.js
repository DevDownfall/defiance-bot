module.invalidable = true;

const chokidar = require('chokidar');
const logs = require('@logging');

module.exports = (client) => {

    //Create Watch Instance
    const coreWatcher = chokidar.watch('.', {
        ignored: /(^|[\/\\])\../,
        persistent: true,
        awaitWriteFinish: {
            stabilityThreshold: 1000,
            pollInterval: 100
        },
    });

    //Watch For File Creation
    coreWatcher.on('ready', () => {
        coreWatcher.on('add', path => {
            try {

                if (path.startsWith('Commands')) {
                    let pull = require(`${__root}/${path}`);
                    if (!pull.name) return;
                    if (pull.name) client.commands.set(pull.name, pull);
                    if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
                    logs.notif(`Added ${pull.name} command`);
                }

                if (path.startsWith('Sixmans Commands')) {
                    let pull = require(`${__root}/${path}`);
                    if (!pull.name) return;
                    if (pull.name) client.sixmans_commands.set(pull.name, pull);
                    if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.sixmans_aliases.set(alias, pull.name));
                    logs.notif(`Added ${pull.name} command`);
                }

                if (path.startsWith('Events')) {
                    let pull = require(`${__root}/${path}`);
                    const event = path.split('/')[1];
                    logs.notif(`Added ${event.replace('.js', '')} event`);
                    client.on(event.replace('.js', ''), pull.bind(null, client))
                }

            } catch (e) {
                logs.error(`Failed to require module: ${path}`);
            }
        });
        coreWatcher.on('unlink', path => {
            try {
                logs.notif(`File removed ${path}`);
                if (require.cache[`${__root}/${path}`]) {
                    logs.notif(`Removed ${path}`);
                    delete require.cache[`${__root}/${path}`];
                }
            } catch (e) {
                logs.error(`Failed to unlink module: ${path}`);
            }
        })
    });


    //Watch For Updates For Instance
    coreWatcher.on('change', path => {
        try {
            module.invalidateByPath(`${__root}/${path}`);
            logs.notif(`Reloaded module: ${path}`);
        } catch (e) {
            logs.error(`Failed to reload module: ${path}`);
        }
    });

}
