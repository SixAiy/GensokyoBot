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
require('./src/util/core')(app);
require('./src/util/event')(app);

console.clear();
console.log("\n\n" +
" _____                      _               ______       _   \n" +
"|  __ \\                    | |              | ___ \\     | |  \n" +
"| |  \\/ ___ _ __  ___  ___ | | ___   _  ___ | |_/ / ___ | |_ \n" +
"| | __ / _ \\ '_ \\/ __|/ _ \\| |/ / | | |/ _ \\| ___ \\/ _ \\| __|\n" +
"| |_\\ \\  __/ | | \\__ \\ (_) |   <| |_| | (_) | |_/ / (_) | |_ \n" +
" \\____/\\___|_| |_|___/\\___/|_|\\_\\\\__, |\\___/\\____/ \\___/ \\__|\n" +
"                                  __/ |                      \n" +
"                                 |___/                       " + "\n\n");
console.log(`[${app.func.timestamp(new Date())}] Bot:`, "Startup");

app.modman.LoadPlugins();
app._plugins = app.modman.pluginslist;
app.bot.connect();