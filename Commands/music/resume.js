module.exports = {
    name: "resume",
    category: "music",
    description: "Resume currently playing music",
    run: async (client, message, args, con, tools) => {

        const { canModifyQueue } = require("../../Utils/Music/CoreUtil");
        const queue = client.queue.get(message.guild.id);
        if (!queue) return message.reply("There is nothing playing.").catch(console.error);
        if (!canModifyQueue(message.member)) return;

        if (!queue.playing) {
            queue.playing = true;
            queue.connection.dispatcher.resume();
            return queue.textChannel.send(`${message.author} ▶ resumed the music!`).catch(console.error);
        }

        return message.reply("The queue is not paused.").catch(console.error);
    }
}