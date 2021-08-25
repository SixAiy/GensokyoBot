/*
    #####################################################################
    # File: app.js
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
    Eris            = require('eris'),
    { clear }       = require('console'),
    //{ spawn }       = require('child_process'),
    conf            = require('./src/conf'),
    man             = require('./src/util/man'),
    //exec            = spawn(`fuser`, ["-k", "-n", "tcp", `${conf.web_port}`]),
    bot             = new Eris(conf.bot_token, conf.eris_options),
    modman          = new man.ModuleManager(`${process.cwd()}/src/modules/`),
    app             = { bot, func: {}, modman };

clear();

app.modman.LoadPlugins();
app._plugins = app.modman.pluginslist;

require('./src/util/extendEris')(Eris);
app.bot.connect();

require('./src/util/func')(app); // Functions

// Command Handling
app.bot.on("interactionCreate", (msg) => app.func.getCommand(app, msg));
app.bot.on("messageCreate", (msg) => app.func.getCommand(app, msg));

// Ready
app.bot.on("ready", () => {
    app.bot.editStatus(conf.game_status, { name: conf.game_name, type: conf.game_type });
    console.log("Discord", "Ready!");
});

// Guilds Event
app.bot.on("guildCreate", (g) => app.func.sendHook(conf.webhook_guild_log, `<:join:877006355746136064> Guild: **${g.name}** (\`${g.id}\`)`));
app.bot.on("guildDelete", (g) => app.func.sendHook(conf.webhook_guild_log, `<:leave:877006244794220585> Guild: **${g.name}** (\`${g.id}\`)`));

// Error Handling!
app.bot.on("error", (e) => console.log(e.stack)); 
//exec.on("error", (e) => console.log(e.stack));

// autoPost - putting the start of here to make it simple :P
setTimeout(() => {
    console.log("Posting");
    if(!conf.enable_post) return;
    app.func.postStatsList(app);
}, 10000);

// Functions for app.js
function sendHook(webhook, msg) {
    let hook = new Webhook(webhook);
    hook.send(msg);
}

// Website includes outside of Ready function because it crashes everything if its pushed.
require('./src/web')(app);