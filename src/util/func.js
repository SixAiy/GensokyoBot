"use strict"

const conf = require('../conf');

module.exports = async(m) => {
    // messageCreate Handlers
    m.bot.getCommand = (msg, app) => {
        msg.prefix = conf.discord.prefix;

        const prefixMention = new RegExp(`^<@!?${app.bot.user.id}>( |)$`);
        if(msg.content.match(prefixMention)) return msg.channel.createMessage(`Your prefix is \`${msg.prefix}\``);
        if(msg.content.indexOf(msg.prefix) !== 0) return;

        let 
            level = app.bot.permlevel(app, msg),
            friendly = app.bot.perms.find(l => l.level == level).name,
            systemLevel = { friendly: friendly, level: level },
            res = undefined;
        
        for(let plugin in app.bot.core._plugins) {
            let r = app.bot.core._plugins[plugin].mod.getCommand(msg);
            if(r !== undefined) {
                res = r;
                if(level >= res.cmd.rank) {
                    let args = res.res.args || "";
                    res.cmd.func(app, msg, args, systemLevel);
                }
            }
        }
    }

    // Main Functions
    m.bot.permlevel = (app, msg) => {
        let permlvl = 0;
        const permOrder = app.bot.perms.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if (msg.guild && currentLevel.guildOnly) continue;
            if (currentLevel.check(app, msg)) {
                permlvl = currentLevel.level;
                break;
            }
        }
        return permlvl;
    }
    m.bot.clean = async(bot, txt) => {
        if(txt && txt.constructor.name == "Promise") txt = await txt;
        if(typeof evaled != "String") txt = await txt;
        txt = txt
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`)
            .replace(m.bot.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");
        return txt;
    };
    m.bot.countMusic = async(chan) => {
        let 
            vclisteners = 0,
            vcusers = [],
            ch = await m.ipc.fetchChannel(chan);
        if(ch.type == 2 && ch.voiceMembers.has(m.bot.user.id)) {
            vclisteners += ch.voiceMembers.map(x => x).length - 1;
            ch.voiceMembers.map(async(x) => {
                let 
                    u = await m.ipc.fetchMember(x.guild, x.user.id),
                    data = { username: u.user.username, id: u.user.id };
                vcusers.push(data);
            });
        }
        return { vclisteners, vcusers };
    };
    m.bot.dhm = (time) => {
        let 
            date = new Date(time * 1000),
            months = date.getUTCMonth(),
            days = date.getUTCDate - 1,
            hours = date.getUTCHours(),
            minutes = date.getUTCMinutes(),
            seconds = date.getUTCSeconds(),
            segments = [];
            
        if(months > 0) segments.push(months + " mo" + ((months == 1) ? "" : "s"));
        if(days > 0) segments.push(days + ' d' + ((days == 1) ? '' : 's'));
        if(hours > 0) segments.push(hours + ' hr' + ((hours == 1) ? '' : 's'));
        if(minutes > 0) segments.push(minutes + ' min' + ((minutes == 1) ? '' : 's'));
        if(seconds > 0) segments.push(seconds + ' sec' + ((seconds == 1) ? '' : 's'));

        return segments.join(', ');
    }

    // Slash Creator
    m.bot.getAppInteration = (guild) => {
        let app = m.bot.api.applications(bot.user.id);
        if(guild) app.guilds(guild);
        return app;
    }


    // Post Stats to listing site
    m.bot.postStatsList = async(type, key, app, url) => {

        let d = await app.ipc.getStats();
        let buildD = {};
        if(type == "cb") {
            fetch(`${url}?key=${key}&servercount=${d.guilds}&shardcount=${d.shardCount}`, { 
                method: "POST"
            }).then(r => r.json()).then(d => console.log(`Posted stats to ${url}`));
        }
        if(type == "topgg") buildD = { server_count: d.guilds, shard_count: d.shardCount };
        if(type == "dbgg") buildD = { guildCount: d.guilds, shardCount: d.shardCount };
        if(type == "dbl") buildD = { guilds: d.guilds };
        if(type == "dls") buildD = { serverCount: d.guilds };

        fetch(url, { 
            method: "POST",
            headers: { authorization: key, "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(r => r.json()).then(d => console.log(`Posted stats to ${url}`));
        
    };

    /*
    // Grabs Staff members
    m.bot.fetchStaff = async(userid, roleid) => {
        let u = await m.ipc.fetchMember(conf.guild_id, userid);
        return u.roles.includes(roleid);
    };
    m.bot.fetchGuildOwner = async(guild) => {
        let g = await m.ipc.fetchGuild(guild);
        return g.ownerID;
    }
    */

    // Permission System Storage
    m.bot.perms = [
        { 
            level: 0, 
            name: "User", 
            check: () => true 
        },
        /*
        { 
            level: 1, 
            name: "Guild Mod", 
            check: (x, m) => false
        },
        { 
            level: 2, 
            name: "Guild Admin", 
            check: (x, m) => false
        },
        { 
            level: 3, 
            name: "Guild Owner", 
            check: (x, m) => false //m.bot.fetchGuildOwner(x.guild_id) 
        },
        { 
            level: 4, 
            name: "Bot Mod", 
            check: (x, m) => m.bot.fetchStaff(x.user.id, conf.role.mod)
        },
        { 
            level: 5, 
            name: "Bot Admin", 
            check: (x, m) => m.bot.fetchStaff(x.user.id, conf.role.admin) 
        },
        { 
            level: 6, 
            name: "Bot Dev", 
            check: (x, m) => m.bot.fetchStaff(x.user.id, conf.role.dev) 
        },
        */
        { 
            level: 7, 
            name: "Bot Owner", 
            check: (app, msg) => conf.discord.owners.includes(msg.author.id)
        }
    ];


}