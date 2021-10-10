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

    // Global Sleep Function for (this/app)
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
}
