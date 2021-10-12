/*
    #####################################################################
    # File: func.js
    # Title: A Radio Music Bot
    # Author: SixAiy <me@sixaiy.com>
    # Version: 5.2
    # Description:
    #  A Discord bot for playing the Gensokyo Radio.
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
    conf = require('../conf');

module.exports = async(app) => {
    app.func.getCommand = (app, msg) => {
        if(!msg.token) return;
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
            x = await fetch(conf.utr_api, { method: "POST" }).then(r => r.json()),
            online = "<:online:702753802784210994>",
            offline = "<:dnd:702753779455623229>",
            state = "",
            s = x.monitors;

        for(let m of s) {
            if(m.status == 2) state += `${online} ${m.friendly_name}\n`;
            else state += `${offline} ${m.friendly_name}\n`;
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
    /*
    app.func.storeStats = (app) => { 
        let 
            loadavg = os.loadavg(),
            totalram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
            usedram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            memory = `Memory: **${usedram} MB / ${totalram} MB`,
            uptime = app.func.dhm(process.uptime()),
            shards = app.bot.shards.size,
            guilds = app.bot.guilds.size,
            load = [];

        for(let lx of loadavg) {
            load.push(lx);
        }
        let b = {
            bot: { uptime, memory, load },
            shard: { shards, guilds, players: 0 }
        }

        let x = await app.func.postAPI("/gb/status", b);
        console.log(`[${app.func.timestamp(new Date())}] storeStats:`, x.msg);
    }; 
    */
    app.func.postStats = async(app) => {
        let 
            shards = app.bot.shards.size,
            guilds = app.bot.guilds.size,
            b = { shards, guilds };
        let x = await app.func.postAPI('/gb/list', b);
        console.log(`[${app.func.timestamp(new Date())}] postStats:`, x.msg);
    };
    app.func.postAPI = async(loc, data) => {
        let x = await fetch(`${conf.url}${loc}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": conf.api
            },
            body: JSON.stringify(data)
        }).then(r => r.json());
        return x
    }

}
