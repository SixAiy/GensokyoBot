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
    console         = require('console'),
    conf            = require('./src/conf'),
    man             = require('./src/util/man'),
    bot             = new Eris(conf.bot, conf.eris),
    modman          = new man.ModuleManager(`${process.cwd()}/src/modules/`),
    app             = { bot, func: {}, modman };


require('./src/util/extend')(Eris);
require('./src/util/func')(app);

console.clear();
console.log(`[${app.func.timestamp(new Date())}] Bot:`, "Startup");

app.modman.LoadPlugins();
app._plugins = app.modman.pluginslist;
app.bot.connect();

app.bot.on("error", (e) => console.log(e.stack)); 
app.bot.on("interactionCreate", (msg) => app.func.getCommand(app, msg));
app.bot.on("shardReady", (x) => console.log(`[${app.func.timestamp(new Date())}] Bot:`, `Shard ${x} Ready`));
app.bot.on("shardDisconnect", (x) => console.log(`[${app.func.timestamp(new Date())}] Bot:`, `Shard ${x} Disconnected`));
app.bot.on("ready", () => {
    app.bot.editStatus(conf.state, conf.option);
    console.log(`[${app.func.timestamp(new Date())}] Bot:`, "Connected");
    app.func.interactionCommands(app);
    app.func.postStats(app);
    require('./src/util/wss')(app);
});

setTimeout(() => { app.func.postStats(app) }, 3.6e+6 /* 1hr */);