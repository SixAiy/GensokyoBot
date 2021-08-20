"use strict"

let 
    Eris = require('eris'),
    { Webhook } = require('discord-webhook-node'),
    conf = require('./src/conf'),
    man = require('./src/util/man'),
    bot = new Eris(conf.discord.token, conf.discord.erisOptions),
    modman = new man.ModuleManager(`${process.cwd()}/src/modules/`),
    app = { bot, func: {} };

app.func.modman = modman;
app.func.modman.LoadPlugins();
app.func._plugins = app.func.modman.pluginslist;

require('./src/util/extendEris')(Eris);
app.bot.connect();

require('./src/util/func')(app); // Functions

// Command Handling
app.bot.on("interactionCreate", (i) => app.func.getCommand(i, app));
app.bot.on("messageCreate", (m) => app.func.getCommand(m, app));

app.bot.on("error", (e) => {
    let hook = conf.discord.hooks.error;
    let webhook = new Webhook(`https://discord.com/api/webhooks/${hook.id}/${hook.token}`);
    webhook.send(`\`\`\`${e.stack}\`\`\``);
    console.log(e.stack);
}); 

// Discord Events
app.bot.on("ready", () => {
    app.func.interactionCommands(app);
    app.bot.editStatus("online", conf.discord.status);
    console.log("Discord", "Ready!");
    require('./src/web')(app); // Website
});
app.bot.on("guildCreate", (g) => {
    let hook = conf.discord.hooks.join_leave;
    let webhook = new Webhook(`https://discord.com/api/webhooks/${hook.id}/${hook.token}`);
    webhook.send(`<:join:877006355746136064> Guild: **${g.name}** (\`${g.id}\`)`);
});
app.bot.on("guildDelete", (g) => {
    let hook = conf.discord.hooks.join_leave;
    let webhook = new Webhook(`https://discord.com/api/webhooks/${hook.id}/${hook.token}`);
    webhook.send(`<:leave:877006244794220585> Guild: **${g.name}** (\`${g.id}\`)`);
});

// autoPost
// Coming soon :P