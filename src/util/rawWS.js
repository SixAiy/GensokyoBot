"use strict"

const conf = require("../conf");

module.exports = async(app, raw) => {
    /*
        raw.t = Event Name
        raw.d = Event Data
    */

    // Ready from Discord
    if(raw.t == "READY") {
        this.bot.editStatus("online", { name: `/help or ${conf.discord.prefix}help`, type: 0 });
    }

    // Slash and Message Handler
    if(raw.t == "MESSAGE_CREATE") {
        app.bot.getCommand(raw.d, app);
    }
    if(raw.t == "INTERACTION_CREATE") {
        app.bot.getInteractionCommand(raw.d, app);
    }

    // Guild Events
    if(raw.t == "GUILD_CREATE") {
        app.bot.createMessage("877001931426496522", `<:join:877006355746136064> Guild: **${raw.d.guild.name}** (\`${raw.d.guild.id}\`)`);

        // Creates new slash commands for the guild if its enabled globaly, we can disable it on the fly if theres a bug.
        // Future Plans
        if(conf.discord.slash) {
            await app.bot.getAppInteration(raw.d.id).commands.post({})
            app.bot.createGuildCommand(raw.d.id, {});
        }
    }
    if(raw.t == "GUILD_DELETE") {
        app.bot.createMessage("877001931426496522", `<:leave:877006244794220585> Guild: **${raw.d.guild.name}** (\`${raw.d.guild.id}\`)`);
    }

    // Channel Events

};