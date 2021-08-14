"use strict"

module.exports = {

    // API Keys
    api: {
        // Applications
        a: {

            // Public Bots
            //dis: "MzAyODU3OTM5OTEwMTMxNzEy.WPJYbw.h83qa7Uhb6IjWKSYuASg0et04tU", // Discord
            //tg: "1926660094:AAGhdfCvQ6H3AC3Vhui8_T41HNC9bPbZfwM", // Telegram

            // Development Bots
            dis: "ODc1NTQ4ODg5MTM3MTc2NTk3.YRXIcg.0JQp1mY6B_GFdzFy-oNIdqualeI", // Discord - GensokyoBot EX
            //dis: "NjE3MzI3NzEwOTc2NjA2MjA4.XWphOw.A15Y1XsKkANMUquxBr_7dbS4cSs", // Discord - RetroSix
            //tg:  "1716405779:AAEKxoCf4iWlwGDrtoGQ2kAoyDWWkJKwiB0", // Telegram
        },
        // Internal Keys for api.sixaiy.com
        k: {
            gb: "1c8439d9e3491f3f:ddb1836c05b269b9385f4260802c067d", // GensokyoBot
            sc: "" // Sentcord
        },
        // URLs
        u: {
            gr: "https://gensokyoradio.net/api/station/playing",
            gb: "https://api.sixaiy.com/v2/gb",
            sc: "https://api.sixaiy.com/v2/sc",
            top: "https://top.gg/api/bots/gensokyobot/stats",
            dbgg: "https://discord.bots.gg/api/v1/bots/gensokyobot/stats",
            dbl: "https://discordbotlist.com/api/v1/bots/gensokyobot/stats",
            bls: "https://api.discordlist.space/v2/bots/gensokyobot"
        },
        // External Keys/Tokens
        l: {
            carbon: "alyzza018ay3kp136ah341", // carbonitex
            top:    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMwMjg1NzkzOTkxMDEzMTcxMiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI4ODE3MTQ3fQ.nUcT2_XLA3Xzj4yER9-8x2w7BwuXmbWocWM3laKrSHk", // top_gg
            dbgg:   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOnRydWUsImlkIjoiMTg4NTcxOTg3ODM1MDkyOTkyIiwiaWF0IjoxNjI4ODE3MjgwfQ.ZP8qta3VzACktkTHCP4eXghTxBHRBA_Z5x71t68pAxs", // discord.bots.gg
            dbl:    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6IjMwMjg1NzkzOTkxMDEzMTcxMiIsImlhdCI6MTYyODgxNzQxOH0.33mjoW21eatWw4RYmFOjJkKxMiPV3rlccapnLT6cV9k", // discordbotlist.com
            bls:    "d83814c67ee419ee4b418cb5b3ce11bfed5a593503ad920f44447d3e667e8bce8bfa8cf99a49b5e93eabf03b6b50da93", // discordlist.space
            gr:     "", // Gensokyo Radio
        }
    },

    // Telegram
    tg: { 
        prefix: "/",
        owners: ["", "", ""] 
    },

    // Discord
    dis: {
        slash: false, // Enable Slash Commands?
        p: ">>", // Prefix
        o: [
            "188571987835092992", // SixAiy#0015
            "81011298891993088"   // Freya#2602
        ],
        s: [
            "268383799132291072", // phoenixwolf#1337
            "112612543125520384", // Sorch#0001
            "479300591265382401", // mrdennisbold#3524
            "124684327261831170", // Silverwolf#0666
            "141254861575553024", // Otter#0003
            "241626344838922240"  // Shredder121#7707
        ],
        g: {
            gb: "269896638628102144", // Gensokyo Community
            fb: "174820236481134592"  // FredBoat Hangout
        },
        c: 0x421250 // Color
    },

    // Bot Listing - Sentcord
    bl: {
        g: "269896638628102144", // Hardcoded Sentcord Guild
        o: "188571987835092992", // Hardcoded Owner - Only one person

        // Roles
        r: {
            s: "831907745652801597", // Staff
            d: "802549003001528352", // Bot Developer
            l: "802549003753226263"  // Listed Bot
        },

        // logs
        du: "https://discord.com/api/webhooks", // Web hook starting URL
        b: { 
            i: "806313717276868658",
            t: "1lbr9PCfyjkceSM5IANv3Ovn1Bak1smX5k0IIcmVpwZsJ-m6hJZjfS-NLTSbN1j1eRyu"
        }
    },

    // Web Settings
    w: {
        port: 5501,
        p: { 
            gr: "https://gensokyoradio.net/playing",
            n: "http://status.sixaiy.com", 
            s: "https://discord.gg/C3vRDBU5kR", 
            i: "https://discord.com/oauth2/authorize?client_id=302857939910131712&scope=bot%20applications.commands&permissions=305261734",
            ei: "https://discord.com/oauth2/authorize?client_id=875548889137176597&scope=bot%20applications.commands&permissions=305261734"
        }
    }
};