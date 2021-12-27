"use strict"

let 
    Eris            = require('eris'),
    conf            = require('./src/util/conf'),
    man             = require('./src/util/man'),
    bot             = new Eris(conf.token, { autoreconnect: true, maxShards: "auto", intents: conf.intents }),
    modman          = new man.ModuleManager(`${process.cwd()}/src/modules/`),
    app             = { bot, core: {}, modman, conf };

require('./src/util/extend')(Eris);
require('./src/util/core')(app);

console.clear();
app.core.figlet(`GensokyoBot v${conf.version}`);
app.core.log("Bot", "Startup");

app.modman.LoadModules();
app._modules = app.modman.moduleslist;

app.core.bot();
app.core.web();