/*
    #####################################################################
    # File: media.js
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
    mod = require('../util/mod').Module("media"),
    conf = require('../conf'),
    fetch = require('node-fetch');

mod.command("play", {
    desc: "Plays the music in the voice channel",
    rank: 0,
    func: async function(app, msg, args, rank) { 
        let 
            perm = msg.member.guild.members.get(app.bot.user.id),
            vc = msg.member.voiceState.channelID;

        if(!perm.permissions.has("voiceSpeak")) return msg.createMessage("Missing Speak Permission");
        if(!perm.permissions.has("voiceConnect")) return msg.createMessage("Missing Connect Permission");
        if(!vc) return msg.createMessage("You need to be in a voice channel");

        let 
            live = await fetch(`${conf.url}/gr/live`).then(r => r.json()),
            vcn = msg.member.guild.channels.get(vc).name;

        await msg.defer();
        app.bot.joinVoiceChannel(vc)
            .then(async(p) => {
                if(p.playing) return msg.createMessage(`Already Playing in **${vcn}**`);

                p.play(`${conf.stream}`, { inlineVolume: true });
                p.setVolume(50 / 100);

                p.on("error", (e) => console.log(e));

                msg.createMessage(`Now playing **${live.artist} - ${live.title}** in **${vcn}**`);
            })
            .catch((e) => console.log(e.stack));
    }
});

mod.command("now", {
    desc: "Displays the current song",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let 
        live = await fetch(`${conf.url}/gr/live`).then(r => r.json()),
			duration = live.duration,
			xdur = live.played,
			durM = (Math.floor(duration / 60)),
			durS = (duration % 60),
			xdurM = (Math.floor(xdur / 60)),
			xdurS = (xdur % 60);
        
        if(durS < 10) durS = "0" + durS;
        if(xdurS < 10) xdurS = "0" + xdurS;

        let em = app.bot.makeEmbed();
        em.color(conf.color);
        em.author("Gensokyo Radio - Music. Games. Touhou")
        em.title(`${live.artist} - ${live.title} (${live.circle})`);
        em.url(live.albumurl);
        if(live.albumart) em.thumbnail(live.arturl + live.albumart);
        em.field("Title", live.title, true);
        em.field("Artist", live.artist, true);
        em.field("Album", live.album, true)
        em.field('Circle', live.circle, true);
        em.field('Duration', xdurM + ":" + xdurS + " / " + durM + ':' + durS, true);
        em.field('Rating', live.rating + '/5.00', true);
        em.timestamp();
        em.footer(`Project ${app.bot.user.username}`, app.bot.user.avatarURL);
        
        msg.createEmbed(em);
    }
});

mod.command("stop", {
    desc: "Stops the music",
    rank: 0,
    func: async function(app, msg, args, rank) {

        let 
            guild = msg.member.guild,
            channel = guild.channels.get(guild.members.get(app.bot.user.id).voiceState.channelID),
            vc = msg.member.voiceState.channelID;
        
        if(vc == null || vc == "") return msg.createMessage("You need to be in the voice channel to use this.");
        if(!guild.members.has(app.bot.user.id)) return msg.createMessage("Something went wrong please use the Report button on our website!");        
        if(!vc) return msg.createMessage(`You need to be in ${channel.name} to stop the music!`);

        let vcn = msg.member.guild.channels.get(vc).name;

        msg.createMessage(`Leaving **${vcn}**`);

        app.bot.leaveVoiceChannel(vc);
    }
});

exports.mod = mod;
