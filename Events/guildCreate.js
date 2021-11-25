const helper = require('@helper')

module.exports = async(client, guild) => {

    var payload = { id: null }
    const Data = helper.selectData(`SELECT * FROM servers WHERE server_id = ?`, [ guild.id ])
    if(!Data) await helper.insertdata(`INSERT INTO servers SET ?`, payload)

    if (!guild.roles.cache.find(r => r.name === "Now Live 🔴")) { guild.roles.create(
        { data: { name: "Now Live 🔴", color: "#760cb3", position: '5' }}
    ) }

}