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
                    type: 2,
                    label: "Status",
                    style: 5,
                    url: `${conf.site}/status`
                },
                {
                    type: 2,
                    label: "Support",
                    style: 5,
                    url: `${conf.site}/support`
                },
                {
                    type: 2,
                    label: "Invite",
                    style: 5,
                    url: `https://discord.com/oauth2/authorize?client_id=302857939910131712&scope=bot%20applications.commands&permissions=305261734`
                },
                {
                    type: 2,
                    label: "Botteh - Moderation Bot",
                    style: 5,
                    url: "https://discord.com/oauth2/authorize?client_id=897240962076647464&scope=bot&permissions=1610087639"
                }
            ],
            mods = app.modman.getPlugins(),
            em = app.bot.makeEmbed();

        mods.map((m) => {
            let mdata = app._plugins[m].mod.getAllCommands();
            mdata.map((md) => {
                cmd_name += `/${md.name}\n`;
                cmd_desc += `${md.desc}\n`;
                //return (`✦ ${md.name}: ${md.desc}`);
            });
            //out += `${loaded.join("\n")}`;
            
        });
        em.author("Commands List");
        em.thumbnail(msg.channel.guild.iconURL)
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
            uptime = process.uptime(),
            network = await app.func.utrStatus();
                
                
        em.author(`${app.bot.user.username} Stats`, app.bot.user.avatarURL);
        em.field('Bot', `Uptime: **${app.func.dhm(uptime)}**\nMemory: **${usedram} MB / ${totalram} MB**\nLoad Avg: **${loadavg[0].toFixed(3)}**, **${loadavg[1].toFixed(3)}**, **${loadavg[2].toFixed(3)}**`, false);
        em.field("Shard", `On Shard: **${msg.member.guild.shard.id}**\nShards: **${app.bot.shards.size.toLocaleString()}**\nGuilds: **${app.bot.guilds.size.toLocaleString()}**`, false);
        em.field("Voice", `Players: **${app.func.getAllPlayers(app)}**\nListeners: **${app.func.getAllPlayers(app)}**`, false);
        em.field("Network", network, false);
        em.timestamp();
        em.color(conf.embed_color);
        em.footer(`Project ${app.bot.user.username}`);
                
        msg.createEmbed(em);
    }
});

exports.mod = mod;