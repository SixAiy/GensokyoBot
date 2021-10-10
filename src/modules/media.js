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
            gr = await fetch(`https://api.o7.fyi/v3/gb/playing`).then(r => r.json()),
            vcn = msg.member.guild.channels.get(vc).name;

        await msg.defer();
        app.bot.joinVoiceChannel(vc).then(async(p) => {
            if(p.playing) return msg.createMessage(`Already Playing in **${vcn}**`);

			p.play(`${conf.gr_stream}`, { inlineVolume: true });
			p.setVolume(50 / 100);

            msg.createMessage(`Now playing **${gr.SONGINFO.ARTIST} - ${gr.SONGINFO.TITLE}** in **${vcn}**`);
        }).catch((e) => console.log(e.stack));
    }
});

mod.command("now", {
    desc: "Displays the current song",
    rank: 0,
    func: async function(app, msg, args, rank) {
        let 
            gr = await fetch(`https://api.o7.fyi/v3/gb/playing`).then(r => r.json()),
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
        em.author("Gensokyo Radio - Music. Games. Touhou");
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
