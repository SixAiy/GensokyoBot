"use strict"

let 
    conf = require('../conf'),
    fetch = require('node-fetch');

module.exports = async(app) => {
    console.log(`[${app.func.timestamp(new Date())}] Bot:`, "postStats");
    let 
        botid = app.bot.user.id,
        shards = app.bot.shards.size,
        guilds = app.bot.guilds.size,
        lists = [
            {
                link: `https://top.gg/api/bots/${botid}/stats`,
                key: conf.list_top,
                body: { server_count: guilds, shard_count: shards }
            },
            {
                link: `https://discords.com/bots/api/bot/${botid}`,
                key: conf.list_discords,
                body: { server_count: guilds }
            },
            {
                link: `https://discord.bots.gg/api/v1/bots/${botid}/stats`,
                key: conf.list_discord_bots,
                body: { guildCount: guilds, shardCount: shards }
            },
            {
                link: `https://api.discordlist.space/v2/bots/${botid}`,
                key: conf.list_discordlist,
                body: { serverCount: guilds }
            },
            {
                link: `https://discordbotlist.com/api/v1/bots/${botid}/stats`,
                key: conf.list_discordbotlist,
                body: { guilds: guilds }
            },
            {
                link: `https://api.discordextremelist.xyz/v2/bot/${botid}/stats`,
                key: conf.list_discordextremelist,
                body: { guildCount: guilds, shardCount: shards }
            },
            {
                link: `https://api.discordextremelist.xyz/v2/bot/${botid}/stats`,
                key: conf.list_discordextremelist,
                body: { guildCount: guilds, shardCount: shards }
            },
            {
                link: `https://bots.discordlabs.org/v2/bot/${botid}/stats`,
                key: conf.list_discordlabs,
                body: { server_count: guilds, shard_count: shards }
            },
            {
                link: `https://discord.boats/api/bot/${botid}`,
                key: conf.list_discordboats,
                body: { server_count: guilds }
            },
            /*{
                name: "o7.fyi",
                link: `https://api.o7.fyi/list/bot/${botid}`,
                key: conf.list_listo7,
                body: { servers: guilds, shards: shards }
            },
            */
        ];

    // Townlist.xyz post
    /*fetch(`https://townlist.xyz/api/bots/${botid}`, { 
        method: "POST", 
        headers: { "serverCount": guilds, "Content-Type": "application/json", "Authorization": conf.list_townlist } 
    })
        .then(r => r.json())
        .then(d => console.log("townlist.xyz", d))
        .catch(e => console.log(e.stack));
    */
    // Carbonitx Post
    fetch("https://carbonitex.net/discord/data/botdata.php", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ key: conf.list_carbonitex, servercount: guilds, shardcount: shards }) 
    }).catch(e => console.log(e.stack));

    for(let list of lists) {
        fetch(list.link, { 
            method: "POST", 
            headers: { "Content-Type": "application/json", "Authorization": list.key }, 
            body: JSON.stringify(list.body)
        }).catch(e => console.log(e.stack));
    }
};

function dfu(url) {
    var result
    var match
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
        }
    }
    return result
}