module.invalidable = true

const { MessageEmbed } = require("discord.js");
const Canvas = require('canvas')
var ProgressBar = require('progress');
const canvacord = require('canvacord')
const Axios = require('axios')
const functions = require('@functions')
const Helper = require('@helper')

module.exports = {
    name: "trivia",
    category: "dev",
    description: "Displays the users current level and xp",
    usage: "<id | mention> <reason>",
    run: async (client, message, args, con, tools) => {
        // message.delete();
        // if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("You don't have the required permissions to use this command.").then(m => m.delete(5000));

        if (args[0] === 'easy') {
            var difficulty = 'easy'
            var exp = 4
        }else if(args[0] === 'medium'){
            var difficulty = 'medium'
            var exp = 9
        }else if(args[0] === 'hard'){
            var difficulty = 'hard'
            var exp = 18
        } 

        if(!args[0]){
            return message.channel.send('Please provide a difficulty option. ex. **Easy**, **Medium**, **Hard**')
        }

        const Question = await getQuestion(difficulty)

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣']
        let answers = []
        Question.data.results[0].incorrect_answers.forEach(i => {
            answers.push(i)
        })
        answers.push(Question.data.results[0].correct_answer)
        shuffle(answers)

        let embed = new MessageEmbed()
        .setTitle('Quiz Question')
        .setDescription(`**${Question.data.results[0].question}**
        React to this message with the appropriate answer.
        You have **60** seconds to answer!

        ${emojis[0]} - ${answers[0]}

        ${emojis[1]} - ${answers[1]}

        ${emojis[2]} - ${answers[2]}

        ${emojis[3]} - ${answers[3]}
        `)

        if( answers[0] == Question.data.results[0].correct_answer) {
            var selected = emojis[0]
        }else if(answers[1] == Question.data.results[0].correct_answer){
            var selected = emojis[1]
        }else if(answers[2] == Question.data.results[0].correct_answer){
            var selected = emojis[2]
        }else if(answers[3] == Question.data.results[0].correct_answer){
            var selected = emojis[3]
        }

        message.channel.send(embed).then(msg => {
            functions.addEmojis(msg, emojis)

            const filter = (reaction, user) => user.id === message.author.id && emojis.includes(reaction.emoji.name);

            const collector = msg.createReactionCollector(filter, {max: 1, time: 30000});    
    
            collector.on('end', async(collected) => {   
                let userReaction = collected.array()[0];
                let person = userReaction.users.cache.array()[1].id
              // Grab the name of the reaction (which is the emoji itself)
                             
                msg.delete({timeout:60000});
                if(collected.first() == undefined){
                    return message.channel.send(`Times up, no emoji specified, cancelling action.`)
                }else{
                    //console.log(footerT)
                    var emoji = collected.first().emoji.name;
                    const Server = client.guilds.cache.get('815791443288260641')
                    const Username = Server.members.cache.get(person)
                    if(emoji == selected){
                        const User = await Helper.selectData(`SELECT * FROM trivia_levels WHERE server_id = ? AND discord_id = ?`, [ '815791443288260641', person])
                        if(Username.user.bot) return
                        if(User) {
                            await Helper.updateData(`UPDATE trivia_levels SET xp = ? WHERE server_id = ? AND discord_id = ?`, [ User.xp + exp, '815791443288260641', person ])
                        }else{  
                            let payload = { id: null, server_id: msg.guild.id, discord_id: person, username: Username.user.username, xp: 0}
                            await Helper.insertData(`INSERT INTO trivia_levels SET ?`, [ payload ])
                        } 
                        const User2 = await Helper.selectData(`SELECT * FROM trivia_levels WHERE server_id = ? AND discord_id = ?`, [ '815791443288260641', person])
                        return message.reply(`**Correct!** You have earned ${exp} points. You now have ${User2.xp} points!`)
                    }else{
                        return message.reply(`**WRONG!** The correct answer was ${Question.data.results[0].correct_answer}`)
                    }
                }
            });
        });

        function shuffle(array) {
            var currentIndex = array.length,  randomIndex;
            
            // While there remain elements to shuffle...
            while (0 !== currentIndex) {
            
                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
            
                // And swap it with the current element.
                [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
            }
            
            return array;
        }
              

            

        async function getQuestion(difficulty){
            const Response = await Axios.get(`https://opentdb.com/api.php?amount=1&category=9&difficulty=${difficulty}&type=multiple`)
            return Response
        }
    }
}