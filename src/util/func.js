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
    conf        = require('../conf'),
    { Webhook } = require('discord-webhook-node'),
    fetch       = require('node-fetch');

module.exports = async(m) => {

    // messageCreate and interactionCreate Handler
    m.func.getCommand = (app, msg) => {
        if(!msg.content && !msg.token) return;
        if(msg.member.user.bot) return;
        msg.pingstamp = new Date() / 1000;

        let
            level = app.func.permlevel(app, msg),
            friendly = app.func.perms.find((l) => l.level == level).name,
            sysLvl = { friendly, level },
            res = undefined;

        if(msg.token == undefined) {
            msg.prefix = conf.legacy_prefix;
    
            const prefixMention = new RegExp(`^<@!?${app.bot.user.id}>( |)$`);
            if(msg.content.match(prefixMention)) return msg.channel.createMessage(`Your prefix is \`${msg.prefix}\``);
            if(msg.content.indexOf(msg.prefix) !== 0) return;
        } else {
            msg.content = msg.data.name;
        }

        if(msg.member.guild.id == conf.guild_id && !conf.channel_allowed.includes(msg.channel.id)) {
            let respond = `${msg.member.user.username}!:  Please read <#${conf.channel_rules}> for server rules and only use commands in <#${conf.channel_bot_spam}>!`;
            if(msg.token != undefined) {
                msg.createMessage(respond);
                //console.log(msg);
                msg.defer()
                app.func.Sleep(10000);
                msg.deleteOriginalMessage(msg.id);
                return;

            } else {
                return msg.channel.createMessage(respond).then(async(m) => {
                    app.func.Sleep(10000);
                    m.delete();
                });
            }
        }
        
        for(let plugin in app._plugins) {
            let r = app._plugins[plugin].mod.getCommand(msg);
            if(r !== undefined) {
                res = r;
                if(level >= res.cmd.rank) {
                    app.func.interactionCommands(app);
                    let args = res.res.args || "";
                    if(msg.token == undefined) return res.cmd.func("m", app, msg, args, sysLvl);
                    res.cmd.func("i", app, msg, args, sysLvl);
                }
            }
        }
    }

    // Message Handler
    m.func.sendEmbed = (t, msg, em) => {
        if(t == "i") return msg.createEmbed(em);
        if(t == "m") return msg.channel.createEmbed(em);
    }
    m.func.sendMessage = (t, msg, args) => {
        if(t == "i") return msg.createMessage(args);
        if(t == "m") return msg.channel.createMessage(args);
    }

    // Main Functions
    m.func.permlevel = (app, msg) => {
        let permlvl = 0;
        let checkTeam = app.bot.guilds.get(conf.guild_id).members.get(msg.member.user.id);
        const permOrder = app.func.perms.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
        while (permOrder.length) {
            const currentLevel = permOrder.shift();
            if(msg.member.guild && currentLevel.guildOnly) continue;
            if(currentLevel.check(app, msg, checkTeam)) {
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
            check: (app, msg, team) => false
        },
        { 
            level: 2, 
            name: "Guild Admin", 
            check: (app, msg, team) => false
        },
        */
        { 
            level: 3, 
            name: "Guild Owner", 
            check: (app, msg, team) => msg.member.guild.ownerID == msg.member.user.id
        },
        { 
            level: 4, 
            name: "Bot Mod", 
            check: (app, msg, team)  => team.roles.includes(conf.bot_mod)
        },
        { 
            level: 5, 
            name: "Bot Admin", 
            check: (app, msg, team) => team.roles.includes(conf.bot_admin)
        },
        { 
            level: 6, 
            name: "Bot Owner", 
            check: (app, msg, team) => conf.bot_owners.includes(msg.member.user.id)
        }
    ];

    // interaction Commands Register
    m.func.interactionCommands = async(app) => {
        const intercmds = await app.bot.getCommands(); // pulls the interaction commands to see if they are listed!
        const mods = app.modman.getPlugins();

        mods.map(async(module) => {
            const data = app._plugins[module].mod.getAllCommands();
            data.map(async(c) => {
                // Interaction Check so we dont re-register - better safe then sorry.
                for(let intercmd of intercmds) {
                    // Check if each command is registered if not registered it will register that command
                    if(intercmd.name != c.name && intercmd.application_id != app.bot.user.id) {
                        // if the interaction is false it wont register the command - still partly buggy
                        if(!c.interaction || c.name == "bot") return;
                        app.bot.createCommand({
                            name: c.name,
                            description: c.desc,
                            options: [],
                            type: 1
                        });
                        // sleep for 5 seconds so we dont slam discords api
                        m.func.Sleep(5000);
                    }
                    return;
                }
            });
        });
    }

    // Global Sleep Function for (this/app)
    m.func.Sleep = (x) => {
        let date = Date.now();
        let curDate = null;
        do { 
            curDate = Date.now(); 
        } while(curDate - date < x);
    }

    // Global Webhook Function
    m.func.sendHook = (webhook, msg) => {
        let hook = new Webhook(webhook);
        hook.send(msg);
    }

}
