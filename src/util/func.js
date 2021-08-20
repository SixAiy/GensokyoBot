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
    m.func.getCommand = (msg, app) => {
        if(msg.member.user.bot) return;

        let
            level = app.func.permlevel(app, msg),
            friendly = app.func.perms.find((l) => l.level == level).name,
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
        
        app.func.interactionCommands(app);
        for(let plugin in app.func._plugins) {
            let r = app.func._plugins[plugin].mod.getCommand(msg);
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
    m.func.sendEmbed = (t, msg, args) => {
        if(t == "i") return msg.createMessage({ embeds: [args] });
        if(t == "m") return msg.channel.createMessage({ embeds: [args] });
    }
    m.func.sendMessage = (t, msg, args) => {
        if(t == "i") return msg.createMessage(args);
        if(t == "m") return msg.channel.createMessage(args);
    }
    m.func.sendChannelMessage = (t, app, id, args) => {
        if(t == "em") return app.bot.createEmbed(id, args);
        app.bot.createMessage(id, args);
    };

    // Main Functions
    m.func.permlevel = (app, msg) => {
        let permlvl = 0;
        const permOrder = app.func.perms.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
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
    m.func.dhm = (time) => {
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

    // Statstics Functions
    m.func.activePlayers = () => {};
    m.func.countListeners = () => {};

    // Post Stats to listing site
    m.func.postStatsList = async(type, key, app, url) => {

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

    // Permission System Storage for messageCreate
    m.func.perms = [
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
            check: (app, msg) => app.bot.guilds.get(conf.discord.guild).members.get(msg.member.user.id).roles.includes(conf.discord.roles.mod)
        },
        { 
            level: 5, 
            name: "Bot Admin", 
            check: (app, msg) => app.bot.guilds.get(conf.discord.guild).members.get(msg.member.user.id).roles.includes(conf.discord.roles.admin)
        },
        { 
            level: 6, 
            name: "Bot Owner", 
            check: (app, msg) => conf.discord.owners.includes(msg.member.user.id)
        }
    ];

    // Global Sleep Function for (this/app)
    m.func.Sleep = (x) => {
        let date = Date.now();
        let curDate = null;
        do { 
            curDate = Date.now(); 
        } while(curDate - date < x);
    }

    // interaction Commands Register
    m.func.interactionCommands = async(app) => {
        const intercmds = await app.bot.getCommands(); // pulls the interaction commands to see if they are listed!
        const mods = app.func.modman.getPlugins();

        mods.map(async(module) => {
            const data = app.func._plugins[module].mod.getAllCommands();
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
                        m.Sleep(5000);
                    }
                    return;
                }
            });
        });
    }

}