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
    conf            = require('./src/conf'),
    man             = require('./src/util/man'),
    postStats       = require('./src/util/postStats'),
    bot             = new Eris(conf.bot_token, conf.eris_options),
    modman          = new man.ModuleManager(`${process.cwd()}/src/modules/`),
    app             = { bot, func: {}, modman };


clear();

app.modman.LoadPlugins();
app._plugins = app.modman.pluginslist;

require('./src/util/extendEris')(Eris);
app.bot.connect();

require('./src/util/func')(app); // Functions

console.log(`[${app.func.timestamp(new Date())}] Bot:`, "Startup");

// Command Handling
app.bot.on("interactionCreate", (msg) => app.func.getCommand(app, msg));

// Shards
app.bot.on("shardReady", (x) => console.log(`[${app.func.timestamp(new Date())}] Bot:`, `Shard ${x} Ready`));
app.bot.on("shardDisconnect", (x) => console.log(`[${app.func.timestamp(new Date())}] Bot:`, `Shard ${x} Disconnected`));

// Ready
app.bot.on("ready", () => {
    app.bot.editStatus(conf.game_status, { name: conf.game_name, type: conf.game_type });
    console.log(`[${app.func.timestamp(new Date())}] Bot:`, "Connected");

    // Run this after connection
    app.func.interactionCommands(app);
    postStats(app);
});

// Guilds Event - Kind of bugged need to fix this :/
//app.bot.on("guildCreate", (g) => app.func.sendHook(conf.webhook_guild_log, `<:join:877006355746136064> Guild: **${g.name}** (\`${g.id}\`)`));
//app.bot.on("guildDelete", (g) => app.func.sendHook(conf.webhook_guild_log, `<:leave:877006244794220585> Guild: **${g.name}** (\`${g.id}\`)`));

// Error Handling!
app.bot.on("error", (e) => console.log(e.stack)); 

// Post stats to listing sites
setTimeout(() => { postStats(app) }, 3.6e+6 /* 1hr */);