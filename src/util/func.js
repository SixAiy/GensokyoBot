/*
    #####################################################################
    # File: func.js
    # Title: A Radio Music Bot
    # Author: SixAiy <me@sixaiy.com>
    # Version: 0.5a
    # Description:
    #  A GensokyoRadio.net Discord bot for playing the radio on discord.
    #####################################################################

    #####################################################################
    # License
    #####################################################################
    # Copyright 2021 Contributing Authors
    # This program is distributed under the terms of the GNU GPL.
    ######################################################################
*/

"use strict"

let 
    conf = require('../conf'),
    fetch = require('node-fetch');

module.exports = async(m) => {

    // messageCreate and interactionCreate Handler
    m.bot.getCommand = (msg, app) => {
        console.log(msg.member.user.username);
        if(msg.member.user.bot || msg.data.name == undefined) return;

        let
            level = app.bot.permlevel(app, msg),
            friendly = app.bot.perms.find((l) => l.level == level).name,
            sysLvl = { friendly, level },
            res = undefined;

        if(msg.token == undefined) {
            msg.prefix = conf.discord.prefix;
    
            const prefixMention = new RegExp(`^<@!?${app.bot.user.id}>( |)$`);
            if(msg.content.match(prefixMention)) return msg.channel.createMessage(`Your prefix is \`${msg.prefix}\``);
            if(msg.content.indexOf(msg.prefix) !== 0) return;
        } else {
            msg.content = msg.data.name;
        }
        
        for(let plugin in app.bot.core._plugins) {
            let r = app.bot.core._plugins[plugin].mod.getCommand(msg);
            if(r !== undefined) {
                res = r;
                if(level >= res.cmd.rank) {
                    let args = res.res.args || "";
                    if(msg.token == undefined) return res.cmd.func("m", app, msg, args, sysLvl);
                    res.cmd.func("i", app, msg, args, sysLvl);
                }
            }
        }
    }

    // Message Handler
    m.bot.sendEmbed = (t, msg, args) => {
        if(t == "i") return msg.createMessage({ embeds: [args] });
        if(t == "m") return msg.channel.createMessage({ embeds: [args] });
    }
    m.bot.sendMessage = (t, msg, args) => {
        if(t == "i") return msg.createMessage(args);
        if(t == "m") return msg.channel.createMessage(args);
    }

    // Main Functions
    m.bot.permlevel = (app, msg) => {
        let permlvl = 0;
        const permOrder = app.bot.perms.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if(msg.member.guild && currentLevel.guildOnly) continue;
            if(currentLevel.check(app, msg)) {
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

    // Grabs Staff members
    m.bot.fetchStaff = async(userid, roleid) => {
        let u = await m.ipc.fetchMember(conf.guild_id, userid);
        return u.roles.includes(roleid);
    };

    // Permission System Storage for messageCreate
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
            check: (app, msg) => false
        },
        { 
            level: 2, 
            name: "Guild Admin", 
            check: (app, msg) => false
        },
        */
        { 
            level: 3, 
            name: "Guild Owner", 
            check: (app, msg) => msg.member.guild.ownerID == msg.member.user.id
        },
        { 
            level: 4, 
            name: "Bot Mod", 
            check: (app, msg) => app.bot.fetchStaff(msg.member.user.id, conf.role.mod)
        },
        { 
            level: 5, 
            name: "Bot Admin", 
            check: (app, msg) => app.bot.fetchStaff(msg.member.user.id, conf.role.admin)
        },
        { 
            level: 6, 
            name: "Bot Dev", 
            check: (app, msg) => app.bot.fetchStaff(msg.member.user.id, conf.role.dev)
        },
        { 
            level: 7, 
            name: "Bot Owner", 
            check: (app, msg) => conf.discord.owners.includes(msg.member.user.id)
        }
    ];

    // Global Sleep Function for (this/app)
    m.objectSleep = (x) => {
        let date = Date.now();
        let curDate = null;
        do { 
            curDate = Date.now(); 
        } while(curDate - date < x);
    }

    // interaction Commands Register
    m.bot.interactionCommands = async(app) => {
        const intercmds = await app.bot.getCommands(); // pulls the interaction commands to see if they are listed!
        const mods = app.modman.getPlugins();

        mods.map(async(module) => {
            const data = app.bot.core._plugins[module].mod.getAllCommands();
            data.map(async(c) => {
                // Interaction Check so we dont re-register - better safe then sorry.
                for(let intercmd of intercmds) {
                    // Check if each command is registered if not registered it will register that command
                    if(intercmd.name != c.name && intercmd.application_id != app.bot.user.id) {
                        // if the interaction is false it wont register the command - still partly buggy
                        if(!c.interaction) return;
                        app.bot.createCommand({
                            name: c.name,
                            description: c.desc,
                            options: [],
                            type: 1
                        });
                        // sleep for 5 seconds so we dont slam discords api
                        m.objectSleep(5000);
                    }
                    return;
                }
            });
        });
    }

}