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
    { Webhook }     = require('discord-webhook-node'),
    { clear }       = require('console'),
    conf            = require('./src/conf'),
    man             = require('./src/util/man'),
    bot             = new Eris(conf.bot_token, { maxShards: conf.eris_shards, getAllUsers: conf.eris_users, intents: conf.eris_intents }),
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

app.bot.on("error", (e) => {
    //sendHook(conf.webhook_error_log, (`\`\`\`${e.stack}\`\`\``);
    console.log(e.stack);
}); 

// Discord Events
app.bot.on("ready", () => {
    app.func.interactionCommands(app);
    app.bot.editStatus(conf.game_status, { name: conf.game_name, type: conf.game_type });
    console.log("Discord", "Ready!");
    require('./src/web')(app); // Website
});
app.bot.on("guildCreate", (g) => {
    let hook = conf.discord.hooks.join_leave;
    sendHook(conf.webhook_guild_log, `<:join:877006355746136064> Guild: **${g.name}** (\`${g.id}\`)`);
});
app.bot.on("guildDelete", (g) => {
    let hook = conf.discord.hooks.join_leave;
    sendHook(conf.webhook_guild_log, `<:leave:877006244794220585> Guild: **${g.name}** (\`${g.id}\`)`);
});

// autoPost
// Coming soon :P


// Functions for app.js
function sendHook(webhook, msg) {
    let hook = new Webhook(webhook);
    hook.send(msg);
}