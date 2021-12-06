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
    fetch = require('node-fetch'),
    conf = require('../conf'),
    guilds = ["896971353490604063", "174820236481134592"],
    channels = ["896971354170085388", "174821093633294338"];

module.exports = async(app) => {
    app.func.getCommand = (app, msg) => {
        if(!msg.token) return;
        if(guilds.includes(msg.channel.guild.id)) {
            if(!channels.includes(msg.channel.id)) return;
            app.func.pushcmd(app, msg);
        }
        
        app.func.pushcmd(app, msg);
    }
    app.func.pushcmd = (app, msg) => {
        msg.pingstamp = new Date() / 1000;
        msg.content = msg.data.name;

        let res = undefined;
        for(let plugin in app._plugins) {
            let r = app._plugins[plugin].mod.getCommand(msg);
            if(r !== undefined) {
                res = r;
                app.func.interactionCommands(app);
                let args = res.res.args || "";
                res.cmd.func(app, msg, args, /*sys*/);
            }
        }
    }

    // Save Fav Song
    app.func.FavSong = (user, song) => {
        
    };

    // Main Functions
    app.func.dhm = (time) => {
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
    app.func.helpEmbed = (msg, content, components) => /*console.log({embeds: [content], components: [{type: 1, components: components}]});*/ msg.createMessage({embeds: [content], components: [{type: 1, components: components}]});

    // interaction Commands Register
    app.func.interactionCommands = async(app) => {
        const intercmds = await app.bot.getCommands(); // pulls the interaction commands to see if they are listed!
        const mods = app.modman.getPlugins();

        mods.map(async(module) => {
            const data = app._plugins[module].mod.getAllCommands();
            data.map(async(c) => {
                if(intercmds.length < 1) {
                    if(!c.interaction || c.name == "bot") return;
                    app.bot.createCommand({
                        name: c.name,
                        description: c.desc,
                        options: [],
                        type: 1
                    });
                    // sleep for 5 seconds so we dont slam discords api
                    app.func.Sleep(5000);
                }

                // Interaction Check so we dont re-register - better safe then sorry.
                for(let intercmd of intercmds) {
                    // Check if each command is registered if not registered it will register that command
                    if(intercmd.name != c.name && intercmd.application_id != app.bot.user.id) {
                        // if the interaction is false it wont register the command - still partly buggy
                        app.bot.createCommand({
                            name: c.name,
                            description: c.desc,
                            options: [],
                            type: 1
                        });
                        // sleep for 5 seconds so we dont slam discords api
                        app.func.Sleep(5000);
                    }
                    return;
                }
            });
        });
    }

    // Uptime Robot API
    app.func.utrStatus = async() => {
        let 
            s = await fetch(`${conf.url}/gb/network`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": conf.api } }).then(r => r.json()),
            online = "<:online:702753802784210994>",
            offline = "<:dnd:702753779455623229>",
            state = "";

        for(let m of s) {
            if(m.status == 2) state += `${online} ${m.name}\n`;
            else state += `${offline} ${m.name}\n`;
        }
        return state;
    };

    // Global Sleep Function
    app.func.Sleep = (x) => {
        let date = Date.now();
        let curDate = null;
        do { 
            curDate = Date.now(); 
        } while(curDate - date < x);
    }

    // Console Timestamp
    app.func.timestamp = (d) => {
        return d.getFullYear() + "-" +
            pad(d.getMonth() + 1, 2, "0") + "-" +
            pad(d.getDate(), 2, "0") + " " +
            pad(d.getHours(), 2, "0") + ":" +
            pad(d.getMinutes(), 2, "0") + ":" +
            pad(d.getSeconds(), 2, "0");
    }
    function pad(s, len, c) {
        var cur = s.toString();
        while(cur.length < len) {cur = c + cur;}
        return cur;
    }

    // Post to API
    app.func.postStats = async(app) => {
        let 
            botid = app.bot.user.id,
            shards = app.bot.shards.size,
            guilds = app.bot.guilds.size,
            b = { botid, shards, guilds },
            x = await fetch(`${conf.url}/gb/list`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": conf.api
                },
                body: JSON.stringify(b)
            }).then(r => r.json());
        console.log(`[${app.func.timestamp(new Date())}] postStats:`, Object.keys(x.data));
    };
    app.func.postAPI = async(app) => {
        let 
            os = require('os'),
            id = app.bot.user.id,
            shards = app.bot.shards.size,
            guilds = app.bot.guilds.size,
            players = app.func.getAllPlayers(app),
            load = os.loadavg(),
            totalram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
            usedram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            freeram = ((process.memoryUsage()['rss'] - process.memoryUsage()['heapUsed']) / 1024 / 1024).toFixed(2),
            uptime = process.uptime(),
            data = {
                id,
                shards,
                guilds,
                players,
                load: { one: load[0].toFixed(3), two: load[1].toFixed(3), three: load[2].toFixed(3) },
                totalram,
                usedram,
                freeram,
                uptime
            },      
            x = await fetch(`${conf.url}/gb/stats`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": conf.api
                },
                body: JSON.stringify(data)
            }).then(r => r.json());
        console.log(`[${app.func.timestamp(new Date())}] storeStats:`, Object.keys(x.data));
    }
    app.func.storeVoiceUsers = async(data) => {
        let x = await fetch(`${conf.url}/gb/voice`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": conf.api
            },
            body: JSON.stringify(data)
        }).then(r => r.json());
        console.log(`[${app.func.timestamp(new Date())}] ${data.type}:`, x.data);
    }

    // VC Stuff
    app.func.getAllPlayers = (app) => {
        let n = 0;
        app.bot.guilds.map(g => {
            g.channels.map(c => {
                if(c.type == 2 && c.voiceMembers.has(app.bot.user.id)) {
                    n++;
                }
            });
        });
        return n;
    };

    // Generate Code Block for Eval
    app.func.generateCodeblock = (text) => {
        return `\`\`\`js\n${text}\n\`\`\``;
    };

    // messageCreate Handler - These are GensokyoBot's Core Commands (Move to console later)
    app.func.messageCreate = (app, msg) => {
        
        if(msg.author.bot) return;
        let usr = ["188571987835092992", "112615849566744576"];
        if(!usr.includes(msg.author.id)) return;
        let
            body = msg.content.slice("!".length).split(" "),
            cmd = body[0],
            args = body.slice(1).join(" ");
        if(cmd == "e") {
            let 
                util            = require('util'),
                redCol          = 0xF44336,
                greenCol        = 0x8BC34A;
            try {
                let
                    returned = eval(args),
                    str = util.inspect(returned, {depth: 1}),
                    embed = {
                        title: "evaluation Results",
                        color: greenCol,
                        fields: [
                            { name: "Input", value: app.func.generateCodeblock(args) },
                            { name: "Output", value: app.func.generateCodeblock(str) }
                        ]
                    };
                msg.channel.createMessage( { embeds: [embed] });
            } catch(e) {
                msg.channel.createMessage({
                    embeds: [{
                        title: "Evaluation Results",
                        color: redCol,
                        fields: [
                            { name: "Input", value: app.func.generateCodeblock(args) },
                            { name: "Output", value: app.func.generateCodeblock(e) }
                        ]
                    }]
                });
            }
        }
        if(cmd == "r") {
            let state = app.modman.reload(args);
            if(state) {
                msg.channel.createMessage(`${args} Rloaded ^^`);
            } else {
                let em = bot.makeEmbed();
                em.description("0.0 WHAT ARE YOU PLAYING AT REEEEE D:<");
                em.image('https://media1.tenor.com/images/a715f8f49a7ca5cfa04bb4eb2899552e/tenor.gif');;
                msg.channel.createEmbed(em);
            }
        }
        if(cmd == "revive") {

        }
    };

    // Status Handler
    app.func.setStatus = (app) => {
        
    };

    // Event Handler
    app.func.eventHandle = (event) => {
        app.bot.createMessage(conf.logs, event)
    };

    // Error Handler


    // Timeouts
    if(!conf.dev) { 
        // Post
        setTimeout(() => { 
            app.func.postStats(app); 
            app.func.postAPI(app); 
        }, 3.6e+6 /* 1hr */);
    }
}
