"use strict"

let mod = require('../util/mod').Module("bot");

mod.command("help", {
    desc: "Shows a list of all commands",
    func: async function(app, msg, args) { 
        msg.member.user.getDMChannel().then(c => {
            let content = `
What to add GensokyoBot to your server? If you have Manage Service Permissions for your guild, you can invite Gensokyobot:
${app.conf.domain}/add
    
Need help or have any ideas for GensokyoBot? Pherhaps you just want to hang out? Join the GensokyoBot Community!
${app.conf.domain}/support
    
You can not send GensokyoBot commands through DMs.
Created by Fre_d and Developed by SixAiy (Allie | アリー)
            `;
            c.createMessage(content);
        });
        msg.createMessage(`${msg.member.user.username}: Documentation has been sent to your DMs!\nSay \`/commands\` to learn what this bot can do!`);
    }
});

mod.command("commands", {
    desc: "Shows all the commands for the bot",
    func: async function(app, msg, args) {
        let 
            cmds = await app.core.aCommands(),
            em = app.bot.makeEmbed(),
            cmd = "";

        for(let x of cmds) {
            if(!x.masterGuild) {
                cmd += `${x.name}:  ${x.desc}\n`;
            }
        }
        
        em.color(app.conf.color);
        em.author("Commands List");
        em.thumbnail(msg.channel.guild.iconURL);
        em.description(`\`\`\`yaml\n${cmd}\`\`\``);
        em.timestamp();
        em.footer(`Project ${app.bot.user.username} v${app.conf.version} | Environment: ${app.conf.env}`);
        msg.createEmbed(em);
    }
});

mod.command("stats", {
    desc: "Shows Stastic Info.",
    func: async function(app, msg, args) {
        let 
            stats = await app.core.stats(),
            em = app.bot.makeEmbed(),
            build = ``;

        em.color(app.conf.color);
        em.author(`Stastics`);
        em.thumbnail(app.bot.user.avatarURL);
        build = `
**Bot**
\`\`\`yaml
Started: ${stats.started} UTC
Memory: ${stats.ram.used.toFixed(2)} MB / ${stats.ram.total.toFixed(2)} MB
Load Avg: ${stats.loadavg[0].toFixed(3)}, ${stats.loadavg[1].toFixed(3)}, ${stats.loadavg[1].toFixed(3)}
\`\`\`
**Sharding**
\`\`\`yaml
Online: ${stats.online_shards} / ${stats.total_shards}
Total Guilds: ${stats.total_guilds}
Total Players: ${stats.total_players}
Total Listeners: ${stats.total_listeners}
\`\`\``;
        for(let shard of stats.shards) {
            if(shard.id == msg.member.guild.shard.id) {
                if(shard.status == "ready") {
                    console.log(shard);
                    build += `
**Operating on ${shard.name}**
\`\`\`yaml
ID: ${shard.id}
Name: ${shard.name}
Status: ${shard.status}
Ping: ${shard.latency}ms
Guilds: ${shard.guilds}
Players: ${shard.players}
Listeners: ${shard.listeners}
\`\`\``;
                }
            }
        }
        
        em.description(build);
        em.timestamp();
        em.footer(`Project ${app.bot.user.username} v${app.conf.version} | Environment: ${app.conf.env}`);
        msg.createEmbed(em);
    }
});

mod.command("conf", {
    desc: "Bot Configuration",
    options: [
        { name: "eval", description: "Evals Things", options: [{ name: "data", description: "Object.keys(app.core);", type: 3, required: true }], type: 1 }, 
        { name: "reload", description: "Reloads plugin/Updates on Discord", options: [{ name: "mod", description: "name", type: 3, required: true }], type: 1 }, 
        { name: "revive", description: "Revivies a Shard", options: [{ name: "shard", description: "id", type: 3 }], type: 1, required: true }
    ],
    masterGuild: true,
    func: async function(app, msg, args) {
        let 
            cmd = msg.data.options[0].name,
            value = msg.data.options[0].options[0].value;

        if(cmd == "eval") {
            console.log(msg.id);
            try {
                let
                    returned = eval(value),
                    str = require('util').inspect(returned, {depth: 1}),
                    embed = {
                        title: "evaluation Results",
                        color: 0x8BC34A,
                        fields: [
                            { name: "Input", value: `\`\`\`js\n${value}\`\`\`` },
                            { name: "Output", value: `\`\`\`js\n${str}\`\`\`` }
                        ]
                    };
                return msg.createMessage({ embeds: [embed] });
            } catch(e) {
                let embed = {
                    title: "Evaluation Results",
                    color: 0xF44336,
                    fields: [
                        { name: "Input", value: `\`\`\`js\n${value}\`\`\`` },
                        { name: "Output", value: `\`\`\`js\n${e}\`\`\`` }
                    ]
                };
                return msg.createMessage({ embeds: [embed] });
            };
        };
        if(cmd == "reload") {
            let state = await app.core.ModuleHandler('rl', value);
            await msg.defer();
            msg.createMessage(state);
        };
        if(cmd == "revive") {
            if(isNaN(value)) return msg.createMessage("Error you need to provide a shard id number");
            let shard = parseInt(value);
            msg.createMessage(`Reviving Shard ${shard}`).then(async() => {
                let msgid = 0;
                msg.channel.messages.map((m) => {
                    if(m.author.id == app.bot.user.id && m.author.bot && m.interaction.user.id == msg.member.id) {
                        msgid = m.id;
                    }
                });
                console.log(shard);
                app.bot.shards.get(shard).disconnect();
                app.core.sleep(5000);
                app.bot.shards.get(shard).connect();
                msg.editMessage(msgid, `Shard ${shard} has restarted`)
            });
        };
    }
});

exports.mod = mod;



/*
Example Creation of custom command

bot.createGuildCommand(GUILD_ID, { 
    name: "conf", 
    description: "Bot Configuration", 
    options: [
        { name: "eval", description: "Evals Things", options: [{ name: "data", description: "blah", type: 3 }], type: 1 }, 
        { name: "reload", description: "Reloads plugin/Updates on Discord", options: [{ name: "mod", description: "name", type: 3 }], type: 1 }, 
        { name: "revive", description: "Revivies a Shard", options: [{ name: "shard", description: "id/name", type: 3 }], type: 1 }
    ], 
    type: 1,
                        permissions: [{
                            id: "188571987835092992",
                            type: 2,
                            permission: true
                        }]
});
*/