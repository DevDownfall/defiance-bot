const paginationEmbed = async (msg, pages, emojiList = ['⏪', '⏩'], timeout = 120000) => {
    if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');
    if (emojiList.length !== 2) throw new Error('Need two emojis.');
    let page = 0;
    const curPage = await msg.channel.send(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
    for (const emoji of emojiList) await curPage.react(emoji);
    const reactionCollector = curPage.createReactionCollector(
        (reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot && user.id === msg.author.id, { time: timeout }
    );
    reactionCollector.on('collect', reaction => {
        reaction.users.remove(msg.author);
        switch (reaction.emoji.name) {
            case emojiList[0]:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case emojiList[1]:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            default:
                break;
        }
        curPage.edit(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
    });
    reactionCollector.on('end', () => curPage.reactions.removeAll());
    return curPage;
};

const paginationModMail = async (client, msg, pages, emojiList = ['⏪', '⏩'], timeout = 120000) => {
    if (!msg && !msg.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');
    let page = 0;
    const curPage = await msg.send(pages[page].setFooter(`Page ${page + 1} / ${pages.length}`));
    utils.addEmojis(curPage, emojiList);
    const reactionCollector = curPage.createReactionCollector((reaction, user) => emojiList.includes(reaction.emoji.name) && !user.bot, { time: timeout })
    reactionCollector.on("collect", e => {
        switch (e.emoji.name) {
            case emojiList[0]:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case emojiList[1]:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            case emojiList[2]:
                if (guild_id = curPage.embeds[0].fields[0].value.split(" ")[4], !guild_id) return curPage.delete(), msg.send((new MessageEmbed).setColor("DARK_RED").setDescription("Invalid choice for current page!"));
                reactionCollector.stop("AUTH_COMPLETE"), modmail.initMail(client, msg, guild_id);
                break;
            case emojiList[3]:
                if (guild_id = curPage.embeds[0].fields[1].value.split(" ")[4], !guild_id) return curPage.delete(), msg.send((new MessageEmbed).setColor("DARK_RED").setDescription("Invalid choice for current page!"));
                curPage.delete(), modmail.initMail(client, msg, guild_id);
                break;
            case emojiList[4]:
                if (guild_id = curPage.embeds[0].fields[2].value.split(" ")[4], !guild_id) return curPage.delete(), msg.send((new MessageEmbed).setColor("DARK_RED").setDescription("Invalid choice for current page!"));
                curPage.delete(), modmail.initMail(client, msg, guild_id);
                break;
            case emojiList[4]:
                if (guild_id = curPage.embeds[0].fields[3].value.split(" ")[4], !guild_id) return curPage.delete(), msg.send((new MessageEmbed).setColor("DARK_RED").setDescription("Invalid choice for current page!"));
                curPage.delete(), modmail.initMail(client, msg, guild_id);
                break;
            case emojiList[6]:
                if (guild_id = curPage.embeds[0].fields[4].value.split(" ")[4], !guild_id) return curPage.delete(), msg.send((new MessageEmbed).setColor("DARK_RED").setDescription("Invalid choice for current page!"));
                curPage.delete(), modmail.initMail(client, msg, guild_id);
                break;
            case emojiList[7]:
                if (guild_id = curPage.embeds[0].fields[4].value.split(" ")[4], !guild_id) return curPage.delete(), msg.send((new MessageEmbed).setColor("DARK_RED").setDescription("Invalid choice for current page!"));
                curPage.delete(), modmail.initMail(client, msg, guild_id)
        }
        curPage.edit(pages[page].setFooter(`Page ${page+1} / ${pages.length}`))
    });
    reactionCollector.on('end', (collected, reason) => {
        if (reason == 'AUTH_COMPLETE') {
            setTimeout(async () => {
                curPage.delete();
            }, 5000)
            return;
        }
        return msg.send(new MessageEmbed().setColor('DARK_RED').setDescription('Time out. You did not choose anything.'))
    });
};

module.exports = paginationEmbed;

