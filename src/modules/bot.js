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
    os = require("os");

mod.command("help", {
    desc: "Shows a list of all commands",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let 
            //out = "",
            cmd_name = "",
            cmd_desc = "",
            components = [
                {
                    //emoji: "<a:typingstatus:393836741272010752>",
                    type: 2,
                    label: "Status",
                    style: 5,
                    url: "https://status.o7.fyi"
                },
                {
                    //emoji: "<:horizon:896745535422234676>",
                    type: 2,
                    label: "Support",
                    style: 5,
                    url: "https://o7.fyi/s"
                },
                {
                    //emoji: "<:gb:806639885448380476>",
                    type: 2,
                    label: "Invite",
                    style: 5,
                    url: "https://o7.fyi/i"
                }
            ],
            mods = app.modman.getPlugins(),
            em = app.bot.makeEmbed();

        mods.map((m) => {
            let mdata = app._plugins[m].mod.getAllCommands();
            mdata.map((md) => {
                cmd_name += `${md.name}\n`;
                cmd_desc += `${md.desc}\n`;
            });            
        });
        em.author("Commands List");
        em.field("Command", cmd_name, true);
        em.field("Description", cmd_desc, true);
        em.color(conf.embed_color);
        em.footer(`Project ${app.bot.user.username}`, app.bot.user.avatarURL);
        em.timestamp();

        app.func.helpEmbed(msg, em, components);
    }
});

mod.command("stats", {
    desc: "Shows Stastic Info.",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let 
            em = app.bot.makeEmbed(),
            loadavg = os.loadavg(),
            totalram = (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
            usedram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
            uptime = process.uptime();
                
                
        em.author(`${app.bot.user.username} Stats`, app.bot.user.avatarURL);
        em.field('Bot', `Uptime: **${app.func.dhm(uptime)}**\nMemory: **${usedram} MB / ${totalram} MB**\nLoad Avg: **${loadavg[0].toFixed(3)}**, **${loadavg[1].toFixed(3)}**, **${loadavg[2].toFixed(3)}**`, false);
        em.field("Stats", `On Shard: **${msg.member.guild.shard.id}**\nTotal Shards: **${app.bot.shards.size.toLocaleString()}**\nTotal Guilds: **${app.bot.guilds.size.toLocaleString()}**`, false);
        em.timestamp();
        em.color(conf.embed_color);
        em.footer(`Project ${app.bot.user.username}`);
                
        msg.createEmbed(em);
    }
});



exports.mod = mod;