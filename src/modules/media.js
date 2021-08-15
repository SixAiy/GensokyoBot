"use strict"

let 
    mod = require('../util/mod').module("media"),
    conf = require('../conf'),
    fetch = require('node-fetch');

mod.alias("play", "p");
mod.alias("j", "p");
mod.alias("join", "p");
mod.command("p", {
    feature: "Plays the music in the voice channel your in",
    rank: 0,
    func: async function(type, app, msg, args, rank) {
        if(type == "tg") return app.tg.sendMessage(msg.chat.id, "This feature is coming soon!");
    
        let 
            perm = msg.channel.guild.members.get(app.bot.user.id),
            vc = msg.member.voiceState.channelID,
            gr = await fetch(conf.lists.gr.url).then(r => r.json());

        if(!perm.permissions.has("voiceSpeak")) return msg.channel.createMessage("Missing Speak Permissions");
        if(!perm.permissions.has("voiceConnect")) return msg.channel.createMessage("Missing Connect Permissions");
        if(!vc) return msg.channel.createMessage("You need to be in a voice channel");

        let vcn = msg.channel.guild.channels.get(vc).name;

        app.bot.joinVoiceChannel(vc).then(p => {
            if(p.playing) return msg.channel.createMessage(`Playing Music in ${vcn}`);

			p.play("https://stream.gensokyoradio.net/2", { inlineVolume: true });
			p.setVolume(50 / 100);

            msg.channel.createMessage(`Now playing **${gr.SONGINFO.ARTIST} - ${gr.SONGINFO.TITLE}** in **${vcn}**`);
        }).catch((e) => console.log(e.stack));
    }
});

mod.alias("now", "np");
mod.alias("music", "np");
mod.alias("playing", "np");
mod.alias("current", "np");
mod.alias("song", "np");
mod.alias("who", "np");
mod.alias("radio", "np");
mod.alias("info", "np");
mod.command("np", {
    feature: "Displays the current song",
    rank: 0,
    func: async function(type, app, msg, args, rank) {
        let 
            gr = await fetch(conf.lists.gr.url).then(r => r.json()),
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

        if(type == "dis") {
            let em = app.bot.makeEmbed();
            em.color(conf.discord.color);
            em.author("Gensokyo Radio - Music. Games. Touhou", "https://gensokyobot.com/static/images/partners/gr.png", conf.web.links.radio)
            //em.author("Gensokyo Radio - Music. Games. Touhou", "https://gensokyobot.com/_gb/gr.png", conf.web.links.radio);
            em.title(`${current.artist} - ${current.title} (${current.circle})`);
            //em.url(current.albumurl);
            //if(current.albumart) em.thumbnail(current.arturl + current.albumart);
            em.field("Title", current.title, true);
            em.field("Artist", current.artist, true);
            em.field("Album", current.album, true)
            em.field('Circle', current.circle, true);
            em.field('Duration', xdurM + ":" + xdurS + " / " + durM + ':' + durS, true);
            em.field('Rating', current.rating + '/5.00', true);
            em.timestamp();
            em.footer(`Project ${app.bot.user.username}`, app.bot.user.avatarURL);

            msg.channel.createEmbed(em);

        }
        if(type == "tg") {
            return app.tg.sendMessage(msg.chat.id, "Coming Soon!");
        }
    }
});

mod.alias("leave", "stop");
mod.alias("s", "stop");
mod.alias("disconnect", "stop");
mod.alias("shutup", "stop");
mod.command("stop", {
    feature: "Stops the music",
    rank: 0,
    func: async function(type, app, msg, args, rank) {
        if(type == "tg") return app.tg.sendMessage(msg.chat.id, "This feature is coming soon!");

        let 
            guild = msg.channel.guild,
            channel = guild.channels.get(guild.members.get(app.bot.user.id).voiceState.channelID),
            vc = msg.member.voiceState.channelID;
        
        if(vc == null || vc == "") return msg.channel.createMessage("You need to be in the voice channel to use this.");
        if(!guild.members.has(app.bot.user.id)) return msg.channel.createMessage("Something went wrong please use the Report button on our website!");        
        if(!vc) return msg.channel.createMessage(`You need to be in ${channel.name} to stop the music!`);

        let vcn = msg.channel.guild.channels.get(vc).name;

        msg.channel.createMessage(`Leaving ${vcn}`);

        app.bot.leaveVoiceChannel(vc);
    }
});

exports.mod = mod;