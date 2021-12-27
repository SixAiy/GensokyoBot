"use strict"

let mod = require('../util/mod').Module("media");

mod.command("play", {
    desc: "Plays the music in the voice channel",
    func: async function(app, msg, args) {
        let 
            perm = msg.member.guild.members.get(app.bot.user.id),
            vc = msg.member.voiceState.channelID;

        if(!perm.permissions.has("voiceSpeak")) return app.core.createMessage(msg, "Missing Speak Permission");
        if(!perm.permissions.has("voiceConnect")) return app.core.createMessage(msg, "Missing Connect Permission");
        if(!vc) return app.core.createMessage(msg, "You need to be in a voice channel");

        let 
            api = await app.core.getRemote(app.conf.fm_api).then(r => r.json()),
            vcn = msg.member.guild.channels.get(vc).name;

        await msg.defer();
        if(!api.is_online) return app.core.createMessage(msg, `Music API is currently offline`);

        app.bot.joinVoiceChannel(vc).then(async(music) => {
            if(music.playing) return app.core.createMessage(msg, `Playing in **${vcn}`);
            music.play(app.conf.fm_stream);
            music.setVolume(50 / 100);
            music.on("error", (e) => { console.log(e); });
            app.core.createMessage(msg, `Now playing **${api.song_info.artist} - ${api.song_info.title}** in **${vcn}**`);
        });
    }
});

mod.command("now", {
    desc: "Displays the current song",
    func: async function(app, msg, args) {
        let 
            api = await app.core.getRemote(app.conf.fm_api).then(r => r.json()),
            em = app.bot.makeEmbed();

        await msg.defer();
        if(!api.is_online) return app.core.createMessage(msg, `Music API is currently offline`);

        let
            serverInfo = api.server_info,
            songInfo = api.song_info,
            songTimes = api.song_times,
            songData = api.song_data,
            misc = api.misc,
			duration = songTimes.duration,
			xdur = songTimes.played,
			durM = (Math.floor(duration / 60)),
			durS = (duration % 60),
			xdurM = (Math.floor(xdur / 60)),
			xdurS = (xdur % 60),
            song_link = misc.songlink ? misc.songlink : "https://gensokyobot.com";
        
        if(durS < 10) durS = "0" + durS;
        if(xdurS < 10) xdurS = "0" + xdurS;

        em.color(app.conf.color);
        em.author(serverInfo.name, serverInfo.image);
        em.title(`${songInfo.artist} - ${songInfo.title}`);
        if(misc.albumart) em.thumbnail(misc.albumart);
        em.field(`Title`, songInfo.title, true);
        em.field(`Artist`, songInfo.artist, true);
        em.field(`Album`, songInfo.album, true);
		em.field('Duration', xdurM + ":" + xdurS + " / " + durM + ':' + durS, true);
		em.field('Raiting', songData.raiting + '/5', true);
		em.field('\u200b', `[🎵](${song_link})`, true);
        em.timestamp();
        em.footer(`Project ${app.bot.user.username} v${app.conf.version} | Environment: ${app.conf.env}`);
        
        app.core.createEmbed(msg, em);
    }
});

mod.command("stop", {
    desc: "Stops the music",
    func: async function(app, msg, args) {

        let 
            guild = msg.member.guild,
            channel = guild.channels.get(guild.members.get(app.bot.user.id).voiceState.channelID),
            vc = msg.member.voiceState.channelID;
        
        if(vc == null || vc == "") return app.core.createMessage(msg, "You need to be in the voice channel to use this.");
        if(!guild.members.has(app.bot.user.id)) return app.core.createMessage(msg, "Something went wrong please use the Report button on our website!");        
        if(!vc) return app.core.createMessage(msg, `You need to be in ${channel.name} to stop the music!`);

        let vcn = msg.member.guild.channels.get(vc).name;

        app.core.createMessage(msg, `Leaving **${vcn}**`);
        
        app.bot.leaveVoiceChannel(vc);
    }
});



exports.mod = mod;
