"use strict"

let 
    mod = require('../util/mod').mdoule("media"),
    fetch = require('node-fetch');

mod.alias("play", "p");
mod.alias("j", "p");
mod.alias("join", "p");
mod.command("p", {
    desc: "",
    rank: 0,
    func: async function(type, msg, app, args, rank) {
        if(type == "tg") return app.tg.sendMessage(msg.chat.id, "This feature is coming soon!");
        
        let perm = msg.channel.guild.members.get(app.bot.user.id);
        if(!msg.members.voiceState.channelID) return msg.channel.createMessage("You need to be in a voice channel");
        if(!perm.hasPermission("voiceSpeak")) return msg.channel.createMessage("I need Speak perms");
        if(!perm.hasPermission("voiceConnect")) return msg.channel.createMessage("I need Connect Perms");

        let vc = msg.members.voiceState.channelID;

        app.bot.joinVoiceChannel(vc).then((player) => {
            if(player.playing) return msg.channel.createMessage(`I'm already playing in ${msg.channel.guild.channels.get(vc).name}`);
            player.player("https://stream.gensokyoradio.net/3", { inlineVolume: true });
            player.setVolume(50 / 100);
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
    desc: "",
    rank: 0,
    func: async function(type, msg, app, args, rank) {
        let 
            gr = await fetch(conf.api.u.gr).then(r => r.json()),
            api = {
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
			current = api.music,
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
            em.color(conf.dis.c);
            em.author("Gensokyo Radio - Music. Games. Touhou", "https://gensokyobot.com/_gb/gr.png", conf.w.p.gr);
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
            em.footer(`Project ${app.bot.user.username}`);

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
    desc: "",
    rank: 0,
    func: async function(type, msg, app, args, rank) {
        if(type == "tg") return app.tg.sendMessage(msg.chat.id, "This feature is coming soon!");

        let vc = msg.member.voiceState.channelID;
        if(vc == null || vc == "") return msg.channel.createMessage("You need to be in the voice channel to use this.");
        if(!msg.channel.guild.members.has(app.bot.user.id)) return msg.channel.createMessage("Something went wrong please use the Report button on our website!");        
        if(!vc) return msg.channel.createMessage(`You need to be in ${bot.channels.get(msg.channel.guild.members.get(app.bot.user.id).voiceState.channelID).name} to stop the music!`);

        app.bot.leaveVoiceChannel(msg.member.voiceState.channelID);
    }
});

exports.mod = mod;