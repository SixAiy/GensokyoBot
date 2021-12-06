"use strict"

let conf = require('../conf');

module.exports = (app) => {

    // Shard Events
    app.bot.on("shardReady", (x) => console.log(`[${app.func.timestamp(new Date())}] Bot:`, `Shard ${x} Ready`));
    app.bot.on("shardDisconnect", (x) => console.log(`[${app.func.timestamp(new Date())}] Bot:`, `Shard ${x} Disconnected`));

    // Ready Event
    app.bot.on("ready", () => {
        app.bot.editStatus(conf.state, conf.option);
        console.log(`[${app.func.timestamp(new Date())}] Bot:`, "Connected");
        app.func.interactionCommands(app);
        if(!conf.dev) { 
            app.func.postStats(app);
            app.func.postAPI(app); 
            require('./wss')(app); 
        }
    });

    // Message Events
    app.bot.on("messageCreate", (msg) => app.func.messageCreate(app, msg));
    app.bot.on("interactionCreate", (msg) => app.func.getCommand(app, msg));

    // Guild Events
    app.bot.on("guildCreate", (g) => {
        if(g.name == undefined || g.id == undefined) return;
        let desc = `<:join:877006355746136064> Enter\n\nGuild Name: ${g.name}\nGuild ID: ${g.id}`;
        app.func.logHandle("Guild Update", desc, conf.log.guild);
    });
    app.bot.on("guildDelete", (g) => {
        if(g.name == undefined || g.id == undefined) return;
        let desc = `<:leave:877006244794220585> Exit\n\nGuild Name: ${g.name}\nGuild ID: ${g.id}`;
        app.func.logHandle("Guild Update", desc, conf.log.guild);
    });

    app.bot.on("messageReactionAdd", (msg, emoji, member) => {
        if(msg.id != "917424320245018665" || member.id != app.bot.user.id || msg.guild.id != "269896638628102144" || msg.channel.id != "917419863671209984") return;
        if(emoji.name == "📜") { member.addRole("917408658864894052"); }
        if(emoji.name == "sixaiy") { member.addRole("917408941170901012"); }
        if(emoji.name == "gensokyobot") { member.addRole("917408614946336779"); }
        if(emoji.name == "sentcord") { member.addRole("917408830164467792"); }
        if(emoji.name == "nlsn") { member.addRole("917408661826048051"); }
    });
    app.bot.on("messageReactionRemove", (msg, emoji, id) => {
        if(msg.id != "917424320245018665" || id != app.bot.user.id || msg.guildID != "269896638628102144" || msg.channel.id != "917419863671209984") return;
        let member = app.bot.guilds.get(msg.guildID).members.get(id);
        if(emoji.name == "📜") { member.removeRole("917408658864894052"); }
        if(emoji.name == "sixaiy") { member.removeRole("917408941170901012"); }
        if(emoji.name == "gensokyobot") { member.removeRole("917408614946336779"); }
        if(emoji.name == "sentcord") { member.removeRole("917408830164467792"); }
        if(emoji.name == "nlsn") { member.removeRole("917408661826048051"); }
    });

    // Voice Event
    /* Disabled for now till futher notice
    app.bot.on("voiceChannelJoin", (m, c) => {

    });
    app.bot.on("voiceChannelLeave", (m, c) => {

    });
    app.bot.on("voiceChannelSwitch", (m, nc, oc) => {
        console.log(Object.keys(nc));
        console.log(Object.keys(oc));
    });
    app.bot.on("voiceStateUpdate", (m, u) => {
        m.guild.channels.map(c => { 
            if(c.type == 2 && c.voiceMembers.has(app.bot.user.id)) {
                let build = {
                    user_id: m.user.id,
                    user_name: m.user.username,
                    user_deaf: u.deaf,
                    user_selfdeaf: u.selfDeaf,
                    guild_id: m.guild.id,
                    guild_name: m.guild.name,
                    channel_id: c.id,
                    channel_name: c.name
                }
                console.log(m);
                app.func.storeVoiceUsers(build);
            } 
        });
    });
    */

    // Error Event
    app.bot.on("error", (e) => console.log(e.stack)); 
};