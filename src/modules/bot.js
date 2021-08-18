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
    mod = require('../util/mod').module("bot"),
    conf = require('../conf'),
    util = require('util'),
    os = require("os");

mod.alias("commands", "help");
mod.alias("invite", "help");
mod.command("help", {
    feature: "Shows a list of all commands and information",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let 
            web = "https://gensokyobot.com",
            output = "",
            totalCmds = "",
            usableCmds = "",
            mods = app.modman.getPlugins(),
            em = app.bot.makeEmbed();

        em.field("Help & Support", `[Commands](${web}/commands)\n[Support](https://gensokyobot.com/support)\n[Status](http://status.sixaiy.com)`, true);
        em.field(`Get GensokyoBot`, `[Add GensokyoBot](${web}/invite)\n[Add GensokyoBot EX](${web}/inv/ex)`, true);

        mods.map((m) => {
            let 
                data = app.bot.core._plugins[m].mod.getAllCommands(),
                name = "",
                loaded = data.map((md) => {
                    totalCmds++
                    if(rank.level >= md.rank) {
                        let fix = m.charAt(0).toUpperCase() + m.slice(1);
                        name = fix.replace(/\.js$/i, "");
                        usableCmds++
                        return (`${md.name}`);
                    }
                });
            output += em.field(name, `\`\`\`\n${loaded.join(", ")}\`\`\``, false);
         });
        em.thumbnail(msg.channel.guild.iconURL);
        em.description(`Hay **${msg.author.username}**\nYou can show your prefix anytime by mentioning me.`);
        em.field(`Bot Rank`, `${rank.level} (${rank.friendly})`, true);
        em.field(`You're Prefix`, `\`${msg.prefix}\``, true);
        em.field(`Commands`, `**${usableCmds}** Usable / **${totalCmds}** Total`, true);
        em.color(conf.discord.color);
        em.author(`Server: ${msg.channel.guild.name}`);
        em.footer(`Project ${app.bot.user.username}`, app.bot.user.avatarURL);
        em.timestamp();

        msg.channel.createEmbed(em);
    }
});

mod.alias("ping", "stats");
mod.alias("shards", "stats");
mod.alias("status", "stats");
mod.command("stats", {
    feature: "Shows Ping, Status and much more information regarding the bot.",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let ping = Date.now();
            msg.channel.createMessage("Loading Statistics").then(async (m) => {
                m.delete();
                let 
                    clusters = "",
                    em = app.bot.makeEmbed(),
                    stats = await app.ipc.getStats(),
                    loadavg = os.loadavg(),
                    totalram = stats.totalRam,
                    clustram = stats.clustersRam,
                    shards = stats.shardCount,
                    guilds = stats.guilds,
                    uptime = process.uptime();
                
                stats.clusters.map((d) => clusters++ );
                
                em.author(`${app.bot.user.username} Stats`, app.bot.user.avatarURL);
                em.field('Bot', `Ping: **${Date.now() - ping}ms\n**Uptime: **${app.bot.dhm(uptime)}**\nMemory: **${(totalram - clustram).toFixed(3)} MB / ${totalram.toFixed(3)} MB**\nLoad Avg: **${loadavg[0].toFixed(3)}**, **${loadavg[1].toFixed(3)}**, **${loadavg[2].toFixed(3)}**`, false);
                em.field("Stats", `Shards: **${shards.toLocaleString()}**\nGuilds: **${guilds.toLocaleString()}**`, false);
                em.timestamp();
                em.color(conf.discord.color);
                
                msg.channel.createEmbed(em);
            });
    }
});

mod.alias("m", "bot");
mod.command("bot", {
    feature: "Owner stuff will only work for the owner!",
    rank: 7,
    func: async function(app, msg, args, rank) {
            let cmd = args.split(' ');
            if(!cmd[0]) {
                let em = app.bot.makeEmbed();
                em.author("Fleet Commander");
                em.thumbnail(app.bot.user.avatarURL)
                em.color(0x421250);
                em.field(`service`, "Restarts Service (ex: bot service <web/telegram>)", true);
                em.field(`clusters`, "Cluster Commander", true);
                em.field(`shards`, `Shard Commander`, true);
                em.field(`reshard`, "Reshards all the Discord Shards", true);
                em.field(`relaod`, "Reloads a module", true);
                em.field(`eval`, "Evals anything connected to the bot", true);
                em.timestamp();
                em.footer(`Project ${app.bot.user.username}`);

                msg.channel.createEmbed(em);
            }
            if(cmd[0] == "service") {
                if(!cmd[1]) return msg.channel.createMessage("You need to tell me what service to restart!");
                msg.channel.createMessage(`Ok i have restarted ${cmd[1]}`);
                app.ipc.restartService(cmd[1]);
            }
            if(cmd[0] == "clusters") {
                if(!cmd[1]) {
                    let em = app.bot.makeEmbed();
                    em.author("Cluster Commander");
                    em.thumbnail(app.bot.user.avatarURL)
                    em.color(0x421250);
                    em.field(`find`, "Find a guild on a cluster", true);
                    em.field(`restart`, "Restart Cluster <number>", true);
                    em.field(`restart all`, "Restart all clusters", true);
                    em.timestamp();
                    em.footer(`Project ${app.bot.user.username}`);

                    msg.channel.createEmbed(em);
                }
                if(cmd[1] == "find") return msg.channel.createMessage("This command needs working on.");
                if(cmd[1] == "restart") {
                    if(cmd[2] == "all") {
                        msg.channel.createMessage("I'm restarting all the Clusters for Discord");
                        app.ipc.restartAllClusters();
                    }
                    if(!cmd[2] || isNaN(cmd[2])) return msg.channel.createMessage("I need to know what cluster to restart!");
                    msg.channel.createMessage(`Restarting Cluster: ${cmd[2]}`);
                    app.ipc.restartCluster(cmd[2]);
                }
            }
            if(cmd[0] == "reshard") {
                msg.channel.createMessage("Restarting All Shards");
                app.ipc.reshard();
            }
            if(cmd[0] == "reload") {
                if(!cmd[1]) return msg.channel.createMessage("The reload function has been disabled. This will be placed into IPC for Global Reload.");
                let state = app.modman.reload(cmd[1]);
                //let json = JSON.stringify({ plugin: cmd[1], chID: msg.channel.id })
                //main.ipc.admrialBroadcast("reloadPlugin", json);
                if(state) {
                    msg.channel.createMessage(`${cmd[1]} Rloaded ^^`);
                } else {
                    let em = bot.makeEmbed();
                    em.description("0.0 WHAT ARE YOU PLAYING AT REEEEE D:<");
                    em.image('https://media1.tenor.com/images/a715f8f49a7ca5cfa04bb4eb2899552e/tenor.gif');;
                    msg.channel.createEmbed(em);
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
                    
                    msg.channel.createEmbed(em);

                } catch(e) {

                    let em = app.bot.makeEmbed();
                    em.title("Eval Results");
                    em.color(0xF44336);
                    em.field("Input", generateCodeblock(arg));
                    em.field("Output", generateCodeblock(e));
                    
                    msg.channel.createEmbed(em);
                }
            }
    }
});

function generateCodeblock(text) {
    return `\`\`\`js\n${text}\n\`\`\``;
};


exports.mod = mod;