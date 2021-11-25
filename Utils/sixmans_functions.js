module.invalidable = true

const con = require('@database');
const { MessageEmbed } = require('discord.js');

module.exports = {

    activeQueues: function (server_id) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT * FROM sixmans_lobbies WHERE server_id=? AND id=(SELECT MAX(id)) ORDER BY id DESC LIMIT 1`, [server_id], function (err, rows) {
                if (err) return console.log(err);
                if (rows && rows.length) { resolve(true); } else { resolve(false); }
            });
        });
    },

    createQueue: function (server_id) {
        return new Promise((resolve, reject) => {
            var payload = { id: null, server_id: server_id }
            con.query(`INSERT INTO sixmans_lobbies SET ?`, payload, (err) => {
                if (err) return console.log(err);
                resolve(true);
            });
        });
    },

    selectQueue: function (server_id) {
        return new Promise((resolve, reject) => {
            con.query(`SELECT * FROM sixmans_lobbies WHERE server_id=? AND id=(SELECT MAX(id)) ORDER BY id DESC LIMIT 1`, [server_id], async function (err, rows) {
                if(rows && rows.length){
                    var info = { id: rows[0].id, server_id: rows[0].server_id, p1: rows[0].p1, p2: rows[0].p2, p3: rows[0].p3, p4: rows[0].p4, p5: rows[0].p5, p6: rows[0].p6, captain1: rows[0].captain1, captain2: rows[0].captain2, active: rows[0].active, voted: rows[0].voted, random: rows[0].random, captain: rows[0].captain, balance: rows[0].balance, team1: rows[0].team_1, team2: rows[0].team_2, timerVote: rows[0].timer_to_vote, sub_num: rows[0].sub_num }
                    resolve(info)
                }else{
                    resolve(null);
                }
            });
        });
    },

    joinQueue: function (server_id, userid) {
        return new Promise((resolve, reject) => {
            var Join6MansSQL = `SELECT * FROM sixmans_lobbies WHERE server_id = ? AND id=(SELECT MAX(id)) AND active='yes' ORDER BY id DESC LIMIT 1`
            con.query(Join6MansSQL, [server_id], (err, rows) => {
                if (err) { reject(err) }
                if (rows && rows.length) {
                    var Player1 = rows[0].p1; var Player2 = rows[0].p2; var Player3 = rows[0].p3; var Player4 = rows[0].p4; var Player5 = rows[0].p5; var Player6 = rows[0].p6;
                    if (!Player1) { con.query(`UPDATE sixmans_lobbies SET p1 = ? WHERE server_id = ? AND id=(SELECT MAX(id)) ORDER BY id DESC LIMIT 1`, [userid, server_id]); return resolve(true); }
                    if (!Player2) { con.query(`UPDATE sixmans_lobbies SET p2 = ? WHERE server_id = ? AND id=(SELECT MAX(id)) ORDER BY id DESC LIMIT 1`, [userid, server_id]); return resolve(true); }
                    if (!Player3) { con.query(`UPDATE sixmans_lobbies SET p3 = ? WHERE server_id = ? AND id=(SELECT MAX(id)) ORDER BY id DESC LIMIT 1`, [userid, server_id]); return resolve(true); }
                    if (!Player4) { con.query(`UPDATE sixmans_lobbies SET p4 = ? WHERE server_id = ? AND id=(SELECT MAX(id)) ORDER BY id DESC LIMIT 1`, [userid, server_id]); return resolve(true); }
                    if (!Player5) { con.query(`UPDATE sixmans_lobbies SET p5 = ? WHERE server_id = ? AND id=(SELECT MAX(id)) ORDER BY id DESC LIMIT 1`, [userid, server_id]); return resolve(true); }
                    if (!Player6) { con.query(`UPDATE sixmans_lobbies SET p6 = ? WHERE server_id = ? AND id=(SELECT MAX(id)) ORDER BY id DESC LIMIT 1`, [userid, server_id]); return resolve(true); }
                    return resolve(false);
                } else {
                    return resolve(false);
                }
            });
        });
    },

    queueAmount: function (server_id, gameid) {
        return new Promise((resolve, reject) => {
            var CountQueueSQL = `SELECT * FROM sixmans_lobbies WHERE server_id = ? AND id=(SELECT MAX(id)) ORDER BY id DESC LIMIT 1`
            con.query(CountQueueSQL, [server_id], (err, rows) => {
                if (err) { reject(err) }
                if (rows && rows.length) {
                    var queue_amount = 0; var Player1 = rows[0].p1; var Player2 = rows[0].p2; var Player3 = rows[0].p3; var Player4 = rows[0].p4; var Player5 = rows[0].p5; var Player6 = rows[0].p6;
                    if (Player1) { queue_amount++ } if (Player2) { queue_amount++ } if (Player3) { queue_amount++ } if (Player4) { queue_amount++ } if (Player5) { queue_amount++ } if (Player6) { queue_amount++ }
                    resolve(queue_amount);
                } else {
                    resolve('NA');
                }
            });
        });
    },

    init6mans: function(server_id, gameid){
        return new Promise((resolve, reject) => {
            con.query(`SELECT * FROM sixmans_lobbies WHERE server_id='${server_id}' AND id='${gameid}'`, (err, rows) => {
                if (err) { reject(err) }
                var players = []; if(rows[0].p1) { players.push(rows[0].p1) } if(rows[0].p2) { players.push(rows[0].p2) } if(rows[0].p3) { players.push(rows[0].p3) } if(rows[0].p4) { players.push(rows[0].p4) } if(rows[0].p5) { players.push(rows[0].p5) } if(rows[0].p6) { players.push(rows[0].p6) }
                var initArray = [server_id, gameid, players];
                resolve(initArray);
            });
        });
    },

    playerData: function(server_id, id){
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM sixmans_lobbies WHERE server_id='${server_id}' AND (p1='${id}' OR p2='${id}' OR p3='${id}' OR p4='${id}' OR p5='${id}' OR p6='${id}')`
            con.query(query, function(err, rows){
                if(rows && rows.length){
                    var info = { id: rows[0].id, server_id: rows[0].server_id, p1: rows[0].p1, p2: rows[0].p2, p3: rows[0].p3, p4: rows[0].p4, p5: rows[0].p5, p6: rows[0].p6, captain1: rows[0].captain1, captain2: rows[0].captain2, balance: rows[0].balance, active: rows[0].active, voted: rows[0].voted, random: rows[0].random, captain: rows[0].captain, team1: rows[0].team_1, team2: rows[0].team_2, timerVote: rows[0].timer_to_vote, sub_num: rows[0].sub_num }
                    resolve(info);
                }else{
                    resolve(null);
                }
            });
        });
    },

    inQueue: function(id){
        return new Promise((resolve, reject) => {
            con.query(`SELECT * FROM sixmans_lobbies WHERE p1='${id}' OR p2='${id}' OR  p3='${id}' OR p4='${id}' OR p5='${id}' OR p6='${id}'`, (err, rows) => {
                if (err) { reject(err) }
                if(rows && rows.length){ resolve(true); }else{ resolve(false); }
            });
        });
    },    

    sixmansInit: function(server_id, gameid){
        return new Promise((resolve, reject) => {
            con.query(`SELECT * FROM sixmans_lobbies WHERE server_id='${server_id}' AND id='${gameid}'`, (err, rows) => {
                if (err) { reject(err) }
                var players = []; if(rows[0].p1) { players.push(rows[0].p1) } if(rows[0].p2) { players.push(rows[0].p2) } if(rows[0].p3) { players.push(rows[0].p3) } if(rows[0].p4) { players.push(rows[0].p4) } if(rows[0].p5) { players.push(rows[0].p5) } if(rows[0].p6) { players.push(rows[0].p6) }
                var initArray = [server_id, gameid, players];
                resolve(initArray);
            });
        });
    },    

    generateCreator: function(Players){
        var Creator = Players[Math.floor(Math.random() * Players.length | 0)];
        return Creator;
    },
    
    generateExpiry: function(minutes){
        var _d = new Date()
        _d.setMinutes(_d.getMinutes() + minutes);
        return Math.round(_d.getTime() / 1000);
    },    

    makeString: function(length){
        var result           = '';
        var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },    

    shuffle: function(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      },

    splitTeams: function(array) {
        return {'orange': array.splice(0, Math.floor(array.length/2)),
        'blue': array}
    },    



}