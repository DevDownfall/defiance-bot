require('module-invalidate');
require('module-alias/register');
global.__root = __dirname;

const Discord = require('discord.js')
const Config = require('@config')
const Helper = require('@helper')
const Log = require('@logging')
const functions = require('@functions')
const axios = require('axios')
const { MessageEmbed } = require('discord.js')

// Initialize the client
const client = new Discord.Client({
    autoReconnect: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
    restTimeOffset: -150,
    retryLimit: 10,
    http: { api: 'https://discord.com/api' }
});

client.login(Config.token)
    .then(() => {
        Log.notif(`[DISCORD] Logged into ${client.user.username}`);
        require(`./Handlers/settings`)(client)
        require(`./Handlers/command`)(client)
        require(`./Handlers/sixmans_command`)(client)
        require(`./Handlers/updater`)(client)
        require(`./Handlers/events`)(client)
});

async function twitchChecker() {
    const results = await Helper.selectAll(`SELECT * FROM defiance_twitch`);

    results.forEach(async (user) => {
        const twitch = await axios.get(`https://api.twitch.tv/helix/streams?user_login=downfallgohonk&user_login=${user.profile_user}`, {
            headers: {
                Authorization: 'Bearer dshtorrx5pjr9o5rmo5ou0b3pg9lvk',
                'client-id': '0qu5x0kavv1e9oz66bmvt5850rmb6j',
            },
        });

        // If user is not live return
        if (twitch.data.data.length == 0) return;

        // Extract data from response
        const twitchUser = twitch.data.data[0];
        const { user_name, title, viewer_count, thumbnail_url, started_at } = twitchUser;

        // If message has already been sent for that livestream return
        if (started_at == user.started_at) return;

        const thumbnail = thumbnail_url.replace(`{width}`, `1920`).replace(`{height}`, `1080`);
        const liveEmbed = new MessageEmbed().setAuthor(`${user_name} - LIVE`).setColor(client.embedColour).setDescription(`Link: https://twitch.tv/${user.profile_user}\nTitle: ${title}`).setImage(thumbnail);

        // Send message to channel
        const channel = client.guilds.cache.get(user.server_id).channels.cache.get(user.channel_id);
        await channel.send(user.message).catch((e) => {});
        await channel.send(liveEmbed).catch((e) => {});
        Helper.updateData(`UPDATE defiance_twitch SET started_at=? WHERE server_id=? AND profile_user=?`, [started_at, user.server_id, user.profile_user]);
    });
}


async function getTweet(){
    const Request = await axios.get(`https://api.twitter.com/1.1/users/show.json?screen_name=ggdefi`, {
        headers: {
            'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAJn3NAEAAAAADFh0lFD%2F2ZQe8JVsEyUazEMMoco%3DlOAmuP6hELZnIVXzGYb99Gin417lANXDX6tFSSBhNCxoJ3SZU5'
        }
    })
    const query = await Helper.selectData(`SELECT * FROM defiance_twitter`)
    if(query.recent_tweet != Request.data.statuses_count){
        await Helper.insertData(`UPDATE defiance_twitter SET recent_tweet = ?`, [ Request.data.statuses_count ])

        const server = client.guilds.cache.get(`862469337231392819`)
        const channel = server.channels.cache.get(`862488580357357608`)

        let embed = new MessageEmbed()
        .setColor('#0c9cf5')
        .setTitle(`New tweet from ${Request.data.name} (@${Request.data.screen_name}`)
        .setDescription(`
            Link: ${`https://twitter.com/GGDefi/status/${Request.data.status.id_str}`}

            ${Request.data.status.text}
            
            ${Request.data.entities.hashtags ? Request.data.entities.hashtags : ''}
            **Followers:** ${Request.data.followers_count}
            `)
        .setImage(Request.data.urls ? Request.data.urls : '').setFooter(client.embedFooter).setTimestamp()

        channel.send(embed)
    }else {
        return
    }

}

async function serverStats(){
    const Stats = await Helper.selectData(`SELECT * FROM server_stats WHERE server_id = ?`, ['862469337231392819'])
    let guild = client.guilds.cache.get(Stats.server_id)
    // Grab Server Members
    var tmembers = await guild.members.cache
    var bots = []
    var members = []

    tmembers.forEach(m => {
        if (m.user.bot) {
            bots.push(m.user.id)
        }else {
            members.push(m.user.id)
        }
    })

    var totalBots = bots.length
    var totalMembers = members.length

    // Update Server Stats
    
    if(Stats) {
        if (Stats.stats >= '1') { var Channel = guild.channels.cache.get(Stats.stats_c1); Channel.setName(`Members: ${totalMembers}`).catch(function (err) { }) }
        if (Stats.stats >= '2') { var Channel = guild.channels.cache.get(Stats.stats_c2); Channel.setName(`Bots: ${totalBots}`).catch(function (err) { }) }
        if (Stats.stats >= '3') { var Channel = guild.channels.cache.get(Stats.stats_c3); Channel.setName(`Boosts: ${message.guild.premiumSubscriptionCount}`).catch(function (err) { }) }
        if (Stats.stats >= '4') { var Channel = guild.channels.cache.get(Stats.stats_c4); Channel.setName(`Total Users: ${totalMembers + totalBots}`).catch(function (err) { }) }
    }
}

// Get User Tweets https://api.twitter.com/2/users/1364339128146538496/tweets
// Get Tweet by ID https://api.twitter.com/2/tweets?ids=1212092628029698048&tweet.fields=attachments,author_id,context_annotations,created_at,entities,geo,id,in_reply_to_user_id,lang,possibly_sensitive,public_metrics,referenced_tweets,source,text,withheld&expansions=referenced_tweets.id

// Get User https://api.twitter.com/2/users?ids=1364339128146538496&expansions=pinned_tweet_id&user.fields=created_at&tweet.fields=created_at
// Get Uers Tweets https://api.twitter.com/labs/2/tweets/1138505981460193280?expansions=attachments.media_keys&tweet.fields=created_at,author_id,lang,source,public_metrics,context_annotations,entities

// async function resetTwitch(){
//     const date = new Date().getHours()
//     if(date == '3'){
//         await Helper.updateData(`UPDATE twitch_users SET sent = ?`, [ 0 ])
//     }
// }

// setInterval(twitchChecker, 60000)
setInterval(getTweet, 10000)
setInterval(serverStats, 120000)
// setInterval(Twitter, 1000)

