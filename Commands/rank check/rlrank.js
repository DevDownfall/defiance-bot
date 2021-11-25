module.invalidable = true

const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require('canvas');
const request = require('request-promise');
const Axios = require('axios')
const con = require('@database')

module.exports = {
    name: "rlrank",
    aliases: ["rankcheck", "rank"],
    category: "Rank Check",
    description: "Check your Rocket League rank",
    usage: "<platform> <id>",
    run: async(client, message, args, helper, tools) => {
        // if(message.author.id != '607430749620011008' ) return message.reply('command is currently under maitenance')

        var t0 = Date.now();

        var platform = args[0];
        var user = args.slice(1).join(" ");

        if (!platform) return sendEmbed(`Invalid Syntax: \`${tools.prefix}rlrank <pc,xbox,ps4,epic> <id>\`, \`Steam Profile Link\` or \`${tools.prefix}rlrank me\``);

        if (platform.startsWith('<@!') && platform.endsWith('>') || platform.startsWith('<@') && platform.endsWith('>')) {
            var finder = message.mentions.members.first();

            con.query(`SELECT * FROM rankcheck_links WHERE discord_id='${finder.id}'`, function(err, rows) {
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

            con.query(`SELECT * FROM rankcheck_links WHERE discord_id='${message.author.id}'`, function(err, rows) {
                if (rows && rows.length) {
                    var platform = rows[0].platform
                    var user = rows[0].user
                    if (platform.toLowerCase() == 'pc') { var platform = 'steam'; }
                    if (platform.toLowerCase() == 'ps4') { var platform = 'psn'; }
                    if (platform.toLowerCase() == 'xbox') { var platform = 'xbl'; }
                    sendRequest(user, platform);
                } else {
                    return message.reply(`You have no linked account you can link one with \`${tools.prefix}linkid <pc,xbox,ps4,epic> <id>\` or \`Steam Profile Link\``);
                }
            });

        } else if (platform.startsWith('https://steamcommunity')) {
            var user = platform.substring(30)
            var user2 = user.slice(0, -1);
            sendRequest(user2, 'steam')
        } else {

            if (platform.toLowerCase() == 'pc' || platform.toLowerCase() == 'xbox' || platform.toLowerCase() == 'ps4' || platform.toLowerCase() == 'epic') {
                if (platform.toLowerCase() == 'pc') { var platform = 'steam'; }
                if (platform.toLowerCase() == 'ps4') { var platform = 'psn'; }
                if (platform.toLowerCase() == 'xbox') { var platform = 'xbl'; }
                if (platform.toLowerCase() == 'epic') { var platform = 'epic'; }
            }else {
                return sendEmbed(`Invalid Syntax: \`${tools.prefix}rlrank <pc,xbox,ps4,epic> <id>\` or \`${tools.prefix}rlrank me\``);
            }

            if (!user) { return sendEmbed(`Invalid Syntax: \`${tools.prefix}rlrank <pc,xbox,ps4,epic> <id>\`, \`Steam Profile Link\` or \`${tools.prefix}rlrank me\``) }
            sendRequest(user, platform)

        }

        function sendEmbed(m) {
            let embed = new MessageEmbed().setTitle(m);
            message.channel.send(embed)
        }

        async function sendRequest(user, platform) {
            var msg = await message.channel.send(`Loading the requested stats ${message.author.username}`);
    
            request(`https://api.tracker.gg/api/v2/rocket-league/standard/profile/${platform}/${user}`).then(async (body) => {
                
                var variable = body.replace(/  +/g, ' ');
                var obj = JSON.parse(variable);

                let rankArray = []
                let i = 0
                obj.data.segments.forEach(a => {
                    if(a.metadata.name != 'Un-Ranked') {
                        rankArray.push(a)
                    }
                });
                var info = {}

                rankArray.forEach(r => {
                    if(!r.stats[8]) {
                        info = {
                            username: obj.data.platformInfo.platformUserHandle,
                            tracker_score: rankArray[0].stats.tRNRating,
                            goal_shot: rankArray[0].stats.goalShotRatio.displayValue,
                            wins: rankArray[0].stats.wins.displayValue,
                            goals: rankArray[0].stats.goals.displayValue,
                            saves: rankArray[0].stats.saves.displayValue,
                            shots: rankArray[0].stats.shots.displayValue,
                            mvps: rankArray[0].stats.mVPs.displayValue,
                            assists: rankArray[0].stats.assists.displayValue,
                            onesmmr: rankArray[1].stats.rating.displayValue,
                            onesdiv: rankArray[1].stats.division.displayValue,
                            onesname: rankArray[1].metadata.name,
                            onespic: rankArray[1].stats.tier.metadata.iconUrl,
                            doublesmmr: rankArray[2].stats.rating.displayValue,
                            doublesdiv: rankArray[2].stats.division.displayValue,
                            doublesname: rankArray[2].metadata.name,
                            doublespic: rankArray[2].stats.tier.metadata.iconUrl,
                            standardmmr: rankArray[3].stats.rating.displayValue,
                            standarddiv: rankArray[3].stats.division.displayValue,
                            standardname: rankArray[3].metadata.name,
                            standardpic: rankArray[3].stats.tier.metadata.iconUrl,
                            hoopsmmr: rankArray[4].stats.rating.displayValue,
                            hoopsdiv: rankArray[4].stats.division.displayValue,
                            hoopsname: rankArray[4].metadata.name,
                            hoopspic: rankArray[4].stats.tier.metadata.iconUrl,
                            rumblemmr: rankArray[5].stats.rating.displayValue,
                            rumblediv: rankArray[5].stats.division.displayValue,
                            rumblename: rankArray[5].metadata.name,
                            rumblepic: rankArray[5].stats.tier.metadata.iconUrl,
                            dropshotmmr: rankArray[6].stats.rating.displayValue,
                            dropshotdiv: rankArray[6].stats.division.displayValue,
                            dropshotname: rankArray[6].metadata.name,
                            dropshotpic: rankArray[6].stats.tier.metadata.iconUrl,
                            snowdaymmr: rankArray[7].stats.rating.displayValue,
                            snowdaydiv: rankArray[7].stats.division.displayValue,
                            snowdayname: rankArray[7].metadata.name,
                            snowdaypic: rankArray[7].stats.tier.metadata.iconUrl,
                            tournamentmmr: 0,
                            tournamentdiv: 'Unranked',
                            tournamentname: 'Tournament',
                            tournamentpic: 'https://trackercdn.com/cdn/tracker.gg/rocket-league/ranks/s4-0.png', 
                        }
                    }else {

                        info = {
                            username: obj.data.platformInfo.platformUserHandle,
                            tracker_score: rankArray[0].stats.tRNRating,
                            goal_shot: rankArray[0].stats.goalShotRatio.displayValue,
                            wins: rankArray[0].stats.wins.displayValue,
                            goals: rankArray[0].stats.goals.displayValue,
                            saves: rankArray[0].stats.saves.displayValue,
                            shots: rankArray[0].stats.shots.displayValue,
                            mvps: rankArray[0].stats.mVPs.displayValue,
                            assists: rankArray[0].stats.assists.displayValue,
                            onesmmr: rankArray[1].stats.rating.displayValue,
                            onesdiv: rankArray[1].stats.division.displayValue,
                            onesname: rankArray[1].metadata.name,
                            onespic: rankArray[1].stats.tier.metadata.iconUrl,
                            doublesmmr: rankArray[2].stats.rating.displayValue,
                            doublesdiv: rankArray[2].stats.division.displayValue,
                            doublesname: rankArray[2].metadata.name,
                            doublespic: rankArray[2].stats.tier.metadata.iconUrl,
                            standardmmr: rankArray[3].stats.rating.displayValue,
                            standarddiv: rankArray[3].stats.division.displayValue,
                            standardname: rankArray[3].metadata.name,
                            standardpic: rankArray[3].stats.tier.metadata.iconUrl,
                            hoopsmmr: rankArray[4].stats.rating.displayValue,
                            hoopsdiv: rankArray[4].stats.division.displayValue,
                            hoopsname: rankArray[4].metadata.name,
                            hoopspic: rankArray[4].stats.tier.metadata.iconUrl,
                            rumblemmr: rankArray[5].stats.rating.displayValue,
                            rumblediv: rankArray[5].stats.division.displayValue,
                            rumblename: rankArray[5].metadata.name,
                            rumblepic: rankArray[5].stats.tier.metadata.iconUrl,
                            dropshotmmr: rankArray[6].stats.rating.displayValue,
                            dropshotdiv: rankArray[6].stats.division.displayValue,
                            dropshotname: rankArray[6].metadata.name,
                            dropshotpic: rankArray[6].stats.tier.metadata.iconUrl,
                            snowdaymmr: rankArray[7].stats.rating.displayValue,
                            snowdaydiv: rankArray[7].stats.division.displayValue,
                            snowdayname: rankArray[7].metadata.name,
                            snowdaypic: rankArray[7].stats.tier.metadata.iconUrl,
                            snowdaymmr: rankArray[8].stats.rating.displayValue,
                            snowdaydiv: rankArray[8].stats.division.displayValue,
                            snowdayname: rankArray[8].metadata.name,
                            snowdaypic: rankArray[8].stats.tier.metadata.iconUrl,
                        }
                    }
                })
                if (!info.tracker_score) return sendEmbed(`${user} doesnt exist, please try again.`);
                try{
                    data(data, msg, info);
                }catch(e){
                    console.log(e)
                }

            }).catch(function(err) {
                console.log(err)
                sendEmbed(`${user} doesnt exist, please try again.`)
            })
        }

        async function data(info, msg, info) {

            //if (info.onesmmr == 'N/A' && info.doublesmmr == 'N/A' && info.standardmmr == 'N/A' && info.solostandardmmr == 'N/A') return message.channel.send(`That account does not exist!`);
            
            try{
                const canvas = Canvas.createCanvas(800, 480);
                const ctx = canvas.getContext('2d');

                var pic_url = 'https://i.pinimg.com/originals/f6/8e/93/f68e93027f1d9340973c56efb675ef76.jpg';

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
                    ctx.fillText(`Div. ${rankDivision} - ${rankMMR} `, location3, location4);
                }

                //1v1
                displayRankCard('90', '135', '90', '155', '#000000', info.onesname, info.onesdiv, info.onesmmr);
                //2v2
                displayRankCard('90', '235', '90', '255', '#000000', info.doublesname, info.doublesdiv, info.doublesmmr);
                //3v3
                displayRankCard('90', '335', '90', '355', '#000000', info.standardname, info.standarddiv, info.standardmmr);
                //Solo Standard
                displayRankCard('90', '435', '90', '455', '#000000', info.tournamentname, info.tournamentdiv, info.tournamentmmr);

                //Hoops
                displayRankCard('370', '135', '370', '155', '#000000', info.hoopsname, info.hoopsdiv, info.hoopsmmr);
                //Rumble
                displayRankCard('370', '235', '370', '255', '#000000', info.rumblename, info.rumblediv, info.rumblemmr);
                //Dropshot
                displayRankCard('370', '335', '370', '355', '#000000', info.dropshotname, info.dropshotdiv, info.dropshotmmr);
                //Snowday
                displayRankCard('370', '435', '370', '455', '#000000', info.snowdayname, info.snowdaydiv, info.snowdaymmr);
                
                const avatar = await Canvas.loadImage(info.onespic).catch(function(err) { console.log(`Error with pictures: Code-1 : ${err}`); });
                ctx.drawImage(avatar, 23.5, 110, 63, 63);
                console.log('image-1')
                const avatar2 = await Canvas.loadImage(info.doublespic).catch(function(err) { console.log(`Error with pictures: Code-2 : ${err}`); });
                ctx.drawImage(avatar2, 23.5, 210, 63, 63);
                console.log('image-2')
                const avatar3 = await Canvas.loadImage(info.standardpic).catch(function(err) { console.log(`Error with pictures: Code-3 : ${err}`); });
                ctx.drawImage(avatar3, 23.5, 310, 63, 63);
                console.log('image-3')
                const avatar4 = await Canvas.loadImage(info.tournamentpic).catch(function(err) { console.log(`Error with pictures: Code-4 : ${err}`); });
                ctx.drawImage(avatar4, 23.5, 410, 63, 63);
                console.log('image-4')
                const avatar5 = await Canvas.loadImage(info.hoopspic).catch(function(err) { console.log(`Error with pictures: Code-5 : ${err}`); });
                ctx.drawImage(avatar5, 303.5, 110, 63, 63);
                console.log('image-5')
                const avatar6 = await Canvas.loadImage(info.rumblepic).catch(function(err) { console.log(`Error with pictures: Code-6 : ${err}`); });
                ctx.drawImage(avatar6, 303.5, 210, 63, 63);
                console.log('image-6')
                const avatar7 = await Canvas.loadImage(info.dropshotpic).catch(function(err) { console.log(`Error with pictures: Code-7 : ${err}`); });
                ctx.drawImage(avatar7, 303.5, 310, 63, 63);
                console.log('image-7')
                const avatar8 = await Canvas.loadImage(info.snowdaypic).catch(function(err) { console.log(`Error with pictures: Code-8 : ${err}`); });
                ctx.drawImage(avatar8, 303.5, 410, 63, 63);
                console.log('image-8')

                ctx.beginPath();
                ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();

                console.log('attaching')
                const attachment = new MessageAttachment(canvas.toBuffer(), 'image.png');
                console.log('attaching done')
                message.channel.send(attachment)
                    .then(function(x) {
                        var t1 = Date.now();
                        //console.log(t1 - t0 + 'ms');
                        msg.delete().catch(function(e) {})
                    })
                    .catch(function(err) {
                        console.log(`Error sending rank attachment ${err}`);
                    });

            }catch(e){
                console.log(e)
            } 
        }
    }
}