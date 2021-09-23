/*
    #####################################################################
    # File: bot.js
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
    mod = require('../util/mod').Module("bot"),
    conf = require('../conf'),
    util = require('util'),
    os = require("os");

mod.alias("commands", "help");
mod.alias("invite", "help");
mod.command("help", {
    interaction: true,
    desc: "Shows a list of all commands",
    rank: 0,
    func: async function(t, app, msg, args, rank) {
        let 
            web = "https://gensokyobot.com",
            cmds = "",
            desc = "",
            totalCmds = "",
            usableCmds = "",
            mods = app.modman.getPlugins(),
            em = app.bot.makeEmbed();

        em.field("Help", `[Status](https://sixnoc.com)\n[Support](${conf.guild_invite})`, true);
        em.field(`Listen`, `[Discord](https://discord.com/oauth2/authorize?client_id=${app.bot.user.id}&scope=bot%20applications.commands&permissions=${conf.invite_perms})\n[Web](https://gensokyoradio.net/playing)`, true);
        em.blankfield();
        
        mods.map((m) => {
            let 
                data = app._plugins[m].mod.getAllCommands(),
                loaded = data.map((md) => {
                    totalCmds++
                    if(rank.level >= md.rank) {
                        usableCmds++
                        return {name: `▫️ **${md.name}**`, desc: `-${md.desc}`};
                    }
                });
            for(let cmd of loaded) {
                if(cmd != undefined) {
                    cmds += `${cmd.name}\n`;
                    desc += `${cmd.desc}\n`;
                }
            }
        });
        em.field("Commands", cmds, true);
        em.field("Description", desc, true);
        em.blankfield();
        em.thumbnail(msg.member.guild.iconURL);
        em.description(`Hay **${msg.member.user.username}**`);
        em.field(`Bot Rank`, `${rank.level} (${rank.friendly})`, true);
        if(msg.prefix == undefined) em.field(`Interaction Prefix`, `\`/\``, true);
        if(msg.prefix != undefined) em.field(`You're Prefix`, `\`${msg.prefix}\``, true);
        em.field(`Commands`, `**${usableCmds}** Usable / **${totalCmds}** Total`, true);
        em.color(conf.embed_color);
        em.author(`Server: ${msg.member.guild.name}`);
        em.footer(`Project ${app.bot.user.username}`, app.bot.user.avatarURL);
        em.timestamp();

        app.func.sendEmbed(t, msg, em);
    }
});

mod.alias("ping", "stats");
mod.alias("shards", "stats");
mod.alias("status", "stats");
mod.command("stats", {
    interaction: true,
    desc: "Shows Stastic Info.",
    rank: 6,
    func: async function(t, app, msg, args, rank) {
        let 
            em = app.bot.makeEmbed(),
            loadavg = os.loadavg(),
            totalram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
            usedram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            freeram = ((process.memoryUsage()['rss'] - process.memoryUsage()['heapUsed']) / 1024 / 1024).toFixed(2),
            uptime = process.uptime();
                
                
        em.author(`${app.bot.user.username} Stats`, app.bot.user.avatarURL);
        em.field('Bot', `Uptime: **${app.func.dhm(uptime)}**\nMemory: **${usedram} MB / ${totalram} MB**\nLoad Avg: **${loadavg[0].toFixed(3)}**, **${loadavg[1].toFixed(3)}**, **${loadavg[2].toFixed(3)}**`, false);
        em.field("Stats", `On Shard: **${msg.member.guild.shard.id}**\nTotal Shards: **${app.bot.shards.size.toLocaleString()}**\nTotal Guilds: **${app.bot.guilds.size.toLocaleString()}**`, false);
        em.timestamp();
        em.color(conf.embed_color);
        em.footer(`Project ${app.bot.user.username}`);
                
        app.func.sendEmbed(t, msg, em);
    }
});

mod.alias("m", "bot");
mod.command("bot", {
    interaction: false,
    desc: "Owner stuff will only work for the owner!",
    rank: 6,
    func: async function(t, app, msg, args, rank) {
            let cmd = args.split(' ');
            if(!cmd[0]) {
                let em = app.bot.makeEmbed();
                em.author("Shards Commander");
                em.thumbnail(app.bot.user.avatarURL)
                em.color(conf.embed_color);
                em.field(`relaod`, "Reloads a module", true);
                em.field(`eval`, "Evals anything connected to the bot", true);
                em.field(`leave`, "Leaves a guild", true);
                em.field(`reboot`, "restarts the bot", true);
                em.timestamp();
                em.footer(`Project ${app.bot.user.username}`);

                app.func.sendEmbed(t, msg, em);
            }
            if(cmd[0] == "reboot") {
                app.func.sendMessage(t, msg, "Rebooting please wait");
                app.Sleep(5000);
                app.bot.disconnect();
            }
            if(cmd[0] == "leave") {
                if(!cmd[1]) return app.func.sendMessage(t, msg, "I need a Guild ID (ex: bot leave 123456789)");
                let guild = app.bot.guilds.get(cmd[1]);
                app.func.sendMessage(t, msg, `Leaving ${guild.name} (${guild.id})`);
                m.Sleep(5000);
                app.bot.leaveGuild(cmd[1]);
            }
            if(cmd[0] == "reload") {
                let state = app.modman.reload(cmd[1]);
                if(state) {
                    app.func.sendMessage(t, msg, `${cmd[1]} Rloaded ^^`);
                } else {
                    let em = bot.makeEmbed();
                    em.description("0.0 WHAT ARE YOU PLAYING AT REEEEE D:<");
                    em.image('https://media1.tenor.com/images/a715f8f49a7ca5cfa04bb4eb2899552e/tenor.gif');
                    app.func.sendEmbed(t, msg, em);
                }
            }
            if(cmd[0] == "eval") {
                let arg = cmd.slice(1).join(" ");
                try {
                    let 
                        back = eval(arg),
                        string = util.inspect(back, { depth: 1 }),
                        em = app.bot.makeEmbed();
                    em.title("Eval Results");
                    em.color(0x8BC34A);
                    em.field("Input", generateCodeblock(arg));
                    em.field("Output", generateCodeblock(string));
                    em.timestamp();
                    em.footer(`Project ${app.bot.user.username}`);
                    app.func.sendEmbed(t, msg, em);
                } catch(e) {
                    let em = app.bot.makeEmbed();
                    em.title("Eval Results");
                    em.color(0xF44336);
                    em.field("Input", generateCodeblock(arg));
                    em.field("Output", generateCodeblock(e));
                    app.func.sendEmbed(t, msg, em);
                }
            }
            if(cmd[0] == "testing12345") {
                let ping = new Date() - msg.timestamp;
                msg.channel.createMessage(`ping is ${ping}`);
            }
            if(cmd[0] == "gup") {
                let gx = await app.bot.getUserProfile(cmd[1]);
                console.log(gx);
                msg.channel.createMessage("Check Console!");
            }
    }
});

function generateCodeblock(text) {
    return `\`\`\`js\n${text}\n\`\`\``;
};


exports.mod = mod;