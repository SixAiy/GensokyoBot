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

mod.alias("p", "play");
mod.alias("j", "play");
mod.alias("join", "play");
mod.command("play", {
    interaction: true,
    desc: "Plays the music in the voice channel",
    rank: 0,
    func: async function(t, app, msg, args, rank) { 
        let 
            perm = msg.member.guild.members.get(app.bot.user.id),
            vc = msg.member.voiceState.channelID;

        if(!perm.permissions.has("voiceSpeak")) return app.func.sendMessage(t, msg, "Missing Speak Permissions");
        if(!perm.permissions.has("voiceConnect")) return app.func.sendMessage(t, msg, "Missing Connect Permissions");
        if(!vc) return app.func.sendMessage(t, msg, "You need to be in a voice channel");

        let 
            gr = await fetch(conf.music_api).then(r => r.json()),
            vcn = msg.member.guild.channels.get(vc).name;

        if(t == "i") await msg.defer();
        app.bot.joinVoiceChannel(vc).then(async(p) => {
            if(p.playing) return app.func.sendMessage(t, msg, `Already Playing in **${vcn}**`);

			p.play(conf.music_stream, { inlineVolume: true });
			p.setVolume(50 / 100);

            app.func.sendMessage(t, msg, `Now playing **${gr.SONGINFO.ARTIST} - ${gr.SONGINFO.TITLE}** in **${vcn}**`);
        }).catch((e) => console.log(e.stack));
    }
});

mod.alias("np", "now");
mod.alias("music", "now");
mod.alias("playing", "now");
mod.alias("current", "now");
mod.alias("song", "now");
mod.alias("who", "now");
mod.alias("radio", "now");
mod.alias("info", "now");
mod.command("now", {
    interaction: true,
    desc: "Displays the current song",
    rank: 0,
    func: async function(t, app, msg, args, rank) {
        let 
            gr = await fetch(conf.music_api).then(r => r.json()),
            current = {
                arturl: "https://gensokyoradio.net/images/albums/500/",
                songid: gr.SONGDATA.SONGID,
                title: gr.SONGINFO.TITLE,
                artist: gr.SONGINFO.ARTIST,
                album: gr.SONGINFO.ALBUM,
                year: gr.SONGINFO.YEAR,
                circle: gr.SONGINFO.CIRCLE,
                duration: gr.SONGTIMES.DURATION,
                played: gr.SONGTIMES.PLAYED,
                remaining: gr.SONGTIMES.REMAINING,
                rating: gr.SONGDATA.RATING,
                timesrated: gr.SONGDATA.TIMESRATED,
                circlelink: gr.MISC.CIRCLELINK,
                circleart: gr.MISC.CIRCLEART,
                albumart: gr.MISC.ALBUMART,
                albumurl: `https://gensokyoradio.net/music/album/${gr.SONGDATA.ALBUMID}`
            },
			duration = current.duration,
			xdur = current.played,
			durM = (Math.floor(duration / 60)),
			durS = (duration % 60),
			xdurM = (Math.floor(xdur / 60)),
			xdurS = (xdur % 60);
        
        if(durS < 10) durS = "0" + durS;
        if(xdurS < 10) xdurS = "0" + xdurS;

        let em = app.bot.makeEmbed();
        em.color(conf.embed_color);
        em.author("Gensokyo Radio - Music. Games. Touhou", "https://gensokyobot.com/static/images/partners/gr.png", conf.m)
        //em.author("Gensokyo Radio - Music. Games. Touhou", "https://gensokyobot.com/_gb/gr.png", conf.web.links.radio);
        em.title(`${current.artist} - ${current.title} (${current.circle})`);
        em.url(current.albumurl);
        if(current.albumart) em.thumbnail(current.arturl + current.albumart);
        em.field("Title", current.title, true);
        em.field("Artist", current.artist, true);
        em.field("Album", current.album, true)
        em.field('Circle', current.circle, true);
        em.field('Duration', xdurM + ":" + xdurS + " / " + durM + ':' + durS, true);
        em.field('Rating', current.rating + '/5.00', true);
        em.timestamp();
        em.footer(`Project ${app.bot.user.username}`, app.bot.user.avatarURL);
        
        app.func.sendEmbed(t, msg, em);
    }
});

mod.alias("leave", "stop");
mod.alias("s", "stop");
mod.alias("disconnect", "stop");
mod.alias("shutup", "stop");
mod.command("stop", {
    interaction: true,
    desc: "Stops the music",
    rank: 0,
    func: async function(t, app, msg, args, rank) {

        let 
            guild = msg.member.guild,
            channel = guild.channels.get(guild.members.get(app.bot.user.id).voiceState.channelID),
            vc = msg.member.voiceState.channelID;
        
        if(vc == null || vc == "") return app.func.sendMessage(t, msg, "You need to be in the voice channel to use this.");
        if(!guild.members.has(app.bot.user.id)) return app.func.sendMessage(t, msg, "Something went wrong please use the Report button on our website!");        
        if(!vc) return app.func.sendMessage(t, msg, `You need to be in ${channel.name} to stop the music!`);

        let vcn = msg.member.guild.channels.get(vc).name;

        app.func.sendMessage(t, msg, `Leaving **${vcn}**`);

        app.bot.leaveVoiceChannel(vc);
    }
});

exports.mod = mod;