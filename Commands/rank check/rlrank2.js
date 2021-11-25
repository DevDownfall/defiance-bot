const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require('canvas');
const request = require('request-promise');

module.exports = {
    name: "drank",
    aliases: ["rankcheck", "rank"],
    category: "rank check",
    description: "Check your Rocket League rank",
    usage: "<platform> <id>",
    run: async (client, message, args, con, tools) => {

        var t0 = Date.now();

        var platform = args[0];
        var user = args.slice(1).join(" ");

        if (!platform) return sendEmbed(`Invalid Syntax: \`${tools.prefix}rlrank <pc,xbox,ps4,epic> <id>\` or \`${tools.prefix}rlrank me\``);

        if (platform.startsWith('<@!') && platform.endsWith('>') || platform.startsWith('<@') && platform.endsWith('>')) {
            var finder = message.mentions.members.first();

            con.query(`SELECT * FROM rankcheck_links WHERE discord_id='${finder.id}'`, function (err, rows) {
                if (rows && rows.length) {
                    var platform = rows[0].platform
                    var user = rows[0].user
                    if (platform.toLowerCase() == 'pc') { var platform = 'steam'; }
                    if (platform.toLowerCase() == 'ps4') { var platform = 'psn'; }
                    if (platform.toLowerCase() == 'xbox') { var platform = 'xbl'; }
                    sendRequest(user, platform);
                } else {
                    return message.reply(`${finder.user.username} has no linked account!`);
                }
            });


        } else if (platform.toLowerCase() == 'me') {

            con.query(`SELECT * FROM rankcheck_links WHERE discord_id='${message.author.id}'`, function (err, rows) {
                if (rows && rows.length) {
                    var platform = rows[0].platform
                    var user = rows[0].user
                    if (platform.toLowerCase() == 'pc') { var platform = 'steam'; }
                    if (platform.toLowerCase() == 'ps4') { var platform = 'psn'; }
                    if (platform.toLowerCase() == 'xbox') { var platform = 'xbl'; }
                    sendRequest(user, platform);
                } else {
                    return message.reply(`You have no linked account you can link one with \`${tools.default_prefix}linkid <pc,xbox,ps4,epic> <id>\``);
                }
            });

        } else {

            if (platform.toLowerCase() == 'pc' || platform.toLowerCase() == 'xbox' || platform.toLowerCase() == 'ps4' || platform.toLowerCase() == 'epic') {
                if (platform.toLowerCase() == 'pc') { var platform = 'steam'; }
                if (platform.toLowerCase() == 'ps4') { var platform = 'psn'; }
                if (platform.toLowerCase() == 'xbox') { var platform = 'xbl'; }
                if (platform.toLowerCase() == 'epic') { var platform = 'epic'; }
            } else {
                return sendEmbed(`Invalid Syntax: \`${tools.default_prefix}rlrank <pc,xbox,ps4,epic> <id>\` or \`${tools.default_prefix}rlrank me\``);
            }

            if (!user) { return sendEmbed(`Invalid Syntax: \`${tools.default_prefix}rlrank <pc,xbox,ps4,epic> <id>\` or \`${tools.default_prefix}rlrank me\``) }

            sendRequest(user, platform)

        }

        function sendEmbed(m) {
            let embed = new MessageEmbed().setTitle(m);
            message.channel.send(embed)
        }

        async function sendRequest(user, platform) {
            var msg = await message.channel.send(`Loading the requested stats ${message.author.username}`);
            request('https://crewmate.xyz/rg2?user=' + user + '&platform=' + platform).then(body => {
                var variable = body.replace(/  +/g, ' ');
                var obj = JSON.parse(variable);
                var info = {
                    onesmmr: obj[0].ones.mmr,
                    onesdiv: obj[0].ones.div,
                    onesname: obj[0].ones.name,
                    onespic: obj[0].ones.pic,
                    doublesmmr: obj[1].doubles.mmr,
                    doublesdiv: obj[1].doubles.div,
                    doublesname: obj[1].doubles.name,
                    doublespic: obj[1].doubles.pic,
                    standardmmr: obj[2].standard.mmr,
                    standarddiv: obj[2].standard.div,
                    standardname: obj[2].standard.name,
                    standardpic: obj[2].standard.pic,
                    solostandardmmr: obj[3].solostandard.mmr,
                    solostandarddiv: obj[3].solostandard.div,
                    solostandardname: obj[3].solostandard.name,
                    // solostandardpic: obj[3].solostandard.pic,
                    hoopsmmr: obj[4].hoops.mmr,
                    hoopsdiv: obj[4].hoops.div,
                    hoopsname: obj[4].hoops.name,
                    hoopspic: obj[4].hoops.pic,
                    rumblemmr: obj[5].rumble.mmr,
                    rumblediv: obj[5].rumble.div,
                    rumblename: obj[5].rumble.name,
                    rumblepic: obj[5].rumble.pic,
                    dropshotmmr: obj[6].dropshot.mmr,
                    dropshotdiv: obj[6].dropshot.div,
                    dropshotname: obj[6].dropshot.name,
                    dropshotpic: obj[6].dropshot.pic,
                    snowdaymmr: obj[7].snowday.mmr,
                    snowdaydiv: obj[7].snowday.div,
                    snowdayname: obj[7].snowday.name,
                    snowdaypic: obj[7].snowday.pic,
                    username: obj[8],
                    tracker_score: obj[9],
                    goal_shot: obj[10],
                    wins: obj[11],
                    goals: obj[12],
                    saves: obj[13],
                    shots: obj[14],
                    mvps: obj[15],
                    assists: obj[16]
                }
                if (info.tracker_score == null) return sendEmbed(`${user} doesnt exist, please try again.`);
                data(info, msg);

            }).catch(function (err) {
                sendEmbed(`${user} doesnt exist, please try again.`)
            })
        }

        async function data(info, msg) {

            //if (info.onesmmr == 'N/A' && info.doublesmmr == 'N/A' && info.standardmmr == 'N/A' && info.solostandardmmr == 'N/A') return message.channel.send(`That account does not exist!`);

            const canvas = Canvas.createCanvas(800, 480);
            const ctx = canvas.getContext('2d');

            var pic_url = 'https://i.pinimg.com/originals/f6/8e/93/f68e93027f1d9340973c56efb675ef76.jpg';

            //Pheonix
            if (message.guild.id == '705432598092054619') var pic_url = 'https://cdn.discordapp.com/attachments/692189380168777749/739258206261477416/PG_Rank_1.png';

            //Sik
            if (message.guild.id == '669343885083934755') var pic_url = 'https://cdn.discordapp.com/attachments/704033754104070206/745215184347332709/opacity_3.png';

            const pic = await Canvas.loadImage(pic_url)
            ctx.drawImage(pic, 0, 0, canvas.width, canvas.height)

            const background = await Canvas.loadImage(`https://cdn.discordapp.com/attachments/641826898359353344/765789037553385472/bg_3_1.png`);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#ffffff';
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            // User text name
            ctx.font = '32px sans-serif';
            ctx.fillStyle = '#000000';
            var titletext = ctx.measureText(info.username)
            ctx.fillText(info.username, 100, 45);
            ctx.font = '12px sans-serif';

            ctx.fillText('Wins - ' + info.wins, 611, 100);
            //ctx.fillText(`${x_wins[2]} - ${x_wins[4]} ${x_wins[5]}`, 611, 115);

            ctx.fillText('Goals - ' + info.goals, 611, 148);
            //ctx.fillText(`${x_goals[2]} - ${x_goals[4]} ${x_goals[5]}`, 611, 163);

            ctx.fillText('Assists - ' + info.assists, 611, 196);
            //ctx.fillText(`${x_assists[2]} - ${x_assists[4]} ${x_assists[5]}`, 611, 211);

            ctx.fillText('Saves - ' + info.saves, 611, 244);
            //ctx.fillText(`${x_saves[2]} - ${x_saves[4]} ${x_saves[5]}`, 611, 259);

            ctx.fillText('Shots - ' + info.shots, 611, 292);
            //ctx.fillText(`${x_shots[2]} - ${x_shots[4]} ${x_shots[5]}`, 611, 307);

            ctx.fillText('Goal/Shot % - ' + info.goal_shot + '%', 611, 340);
            //ctx.fillText(`${x_goal_shot[3]} - ${x_goal_shot[5]} ${x_goal_shot[6]}`, 611, 355);

            ctx.fillText('MVPS - ' + info.mvps, 611, 388);
            //ctx.fillText(`${x_mvps[2]} - ${x_mvps[4]} ${x_mvps[5]}`, 611, 403);

            ctx.fillText('Score - ' + info.tracker_score, 611, 436);
            //ctx.fillText(`${t_score[3]} - ${t_score[5]} ${t_score[6]}`, 611, 451);

            ctx.fillStyle = '#000000';

            async function displayRankCard(location1, location2, location3, location4, fillcolor, rankName, rankDivision, rankMMR) {
                ctx.font = '17px sans-serif';
                ctx.fillText(rankName, location1, location2);
                ctx.font = '14px sans-serif';
                ctx.fillText(`Div. ${rankDivision} - ${rankMMR} MMR`, location3, location4);
            }

            //1v1
            displayRankCard('90', '135', '90', '155', '#000000', info.onesname, info.onesdiv, info.onesmmr);
            //2v2
            displayRankCard('90', '235', '90', '255', '#000000', info.doublesname, info.doublesdiv, info.doublesmmr);
            //3v3
            displayRankCard('90', '335', '90', '355', '#000000', info.standardname, info.standarddiv, info.standardmmr);
            //Solo Standard
            displayRankCard('90', '435', '90', '455', '#000000', info.solostandardname, info.solostandarddiv, info.solostandardmmr);

            //Hoops
            displayRankCard('370', '135', '370', '155', '#000000', info.hoopsname, info.hoopsdiv, info.hoopsmmr);
            //Rumble
            displayRankCard('370', '235', '370', '255', '#000000', info.rumblename, info.rumblediv, info.rumblemmr);
            //Dropshot
            displayRankCard('370', '335', '370', '355', '#000000', info.dropshotname, info.dropshotdiv, info.dropshotmmr);
            //Snowday
            displayRankCard('370', '435', '370', '455', '#000000', info.snowdayname, info.snowdaydiv, info.snowdaymmr);


            const avatar = await Canvas.loadImage(info.onespic).catch(function (err) { console.log(`Error with pictures: Code-1 : ${err}`); });
            ctx.drawImage(avatar, 23.5, 110, 63, 63);

            const avatar2 = await Canvas.loadImage(info.doublespic).catch(function (err) { console.log(`Error with pictures: Code-2 : ${err}`); });
            ctx.drawImage(avatar2, 23.5, 210, 63, 63);

            const avatar3 = await Canvas.loadImage(info.standardpic).catch(function (err) { console.log(`Error with pictures: Code-3 : ${err}`); });
            ctx.drawImage(avatar3, 23.5, 310, 63, 63);

            // const avatar4 = await Canvas.loadImage(info.solostandardpic).catch(function (err) { console.log(`Error with pictures: Code-4 : ${err}`); });
            // ctx.drawImage(avatar4, 23.5, 410, 63, 63);

            const avatar5 = await Canvas.loadImage(info.hoopspic).catch(function (err) { console.log(`Error with pictures: Code-5 : ${err}`); });
            ctx.drawImage(avatar5, 303.5, 110, 63, 63);

            const avatar6 = await Canvas.loadImage(info.rumblepic).catch(function (err) { console.log(`Error with pictures: Code-6 : ${err}`); });
            ctx.drawImage(avatar6, 303.5, 210, 63, 63);

            const avatar7 = await Canvas.loadImage(info.dropshotpic).catch(function (err) { console.log(`Error with pictures: Code-7 : ${err}`); });
            ctx.drawImage(avatar7, 303.5, 310, 63, 63);

            const avatar8 = await Canvas.loadImage(info.snowdaypic).catch(function (err) { console.log(`Error with pictures: Code-8 : ${err}`); });
            ctx.drawImage(avatar8, 303.5, 410, 63, 63);

            ctx.beginPath();
            ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();

            const attachment = new MessageAttachment(canvas.toBuffer(), 'image.png');

            message.channel.send(attachment)
                .then(function (x) {
                    var t1 = Date.now();
                    //console.log(t1 - t0 + 'ms');
                    msg.delete().catch(function (e) { })
                })
                .catch(function (err) {
                    console.log(`Error sending rank attachment ${err}`);
                });

        }

    }
}