"use strict"

module.exports = {
    discord: {
        token: "",

        // Config
        slash: false, // Enable Slash Commands Globally?
        prefix: "?", // Default Prefix
        owners: ["", ""],
        guild: "", // Home Guild
        color: 0x421250 // Color
    },
    // URLs
    lists: {
        sa: { url: "https://api.sixaiy.com/v3/X712x2", key: "" },
        sc: { url: "https://sentcord.com/api/bot/X712x2", key: "" },
        gr: { url: "https://gensokyoradio.net/api/station/playing", key: "" },
        cb: { url: "https://carbonitex.net/discord/data/botdata.php", key: "" },
        top: { url: "https://top.gg/api/bots/X712x2/stats", key: "-" },
        dbgg: { url: "https://discord.bots.gg/api/v1/bots/X712x2/stats", key: "" },
        dbl: { url: "https://discordbotlist.com/api/v1/bots/X712x2/stats", key: "" },
        dls: { url: "https://api.discordlist.space/v2/bots/X712x2", key: "" }
    },

    // Web Settings
    web: {
        port: 4000,
        links: { 
            bladenode: "https://bladenode.com",
            radio: "https://gensokyoradio.net/playing",
            network: "http://status.sixaiy.com", 
            discord: "https://discord.gg/C3vRDBU5kR", 
            telegram: "https://t.me/joinchat/rfWlbVpfv_02OWFl",
            gensokyobot: "https://discord.com/oauth2/authorize?client_id=302857939910131712&scope=bot%20applications.commands&permissions=305261734",
        }
    }
};