/*
    #####################################################################
    # File: bot.js
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
    mod = require('../util/mod').Module("ed"),
    conf = require('../conf'),
    axios = require('axios'),
    fetch = require('node-fetch');

mod.command("cmdr", {
    interaction: false,
    desc: "Look up a commander from Elite Dangerous",
    rank: 0,
    func: async function(t, app, msg, args, rank) {
        if(!args) return msg.channel.createMessage("Please provide me with a commander name!");
        
        let 
            currentTime = new Date(),
            username = args,
            event = {
                eventCustomID: 13458,
                eventName: "getCommanderProfile",
                eventTimestamp: currentTime.toISOString(),
                eventData: {
                    searchName: username,
                }
            };
        inaraPost(msg, event);
    }
});

exports.mod = mod;

function inaraPost(msg, event) {
    let data = {
        /*
        header: {
            appName: "GensokyoBot - Discord Application",
            appVersion: "0.1",
            isDeveloped: false,
            APIkey: "3jzl6vuebwe8ow8sk4g00sokwk00c8g8c08k8o0",
            commanderName: "sixaiy",
            commanderFrontierID: "243500"
        },
        */
       
        header: {
            appName: "Second Chances DashBoard",
            appVersion: "0.1",
            isDeveloped: true,
            APIkey: "f8esm8mqr1sssc4c8kkkk84oo44ssws0ks440g",
            commanderName: "pepega_overlord",
            commanderFrontierID: "6091730",
        },
        

        events: [event]
    };

    axios.post(conf.inara_cz_url, data).then((d) => {
        console.log(d.data);
        msg.channel.createMessage("Check console!");
    }).catch((e) => console.log(e));
}