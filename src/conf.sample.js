/*
#####################################################################
# File: conf.js / sample.conf.js
# Title: A Radio Music Bot
# Author: SixAiy <me@sixaiy.com>
# Version: 5.3
# Description:
#  A Discord bot for playing the Gensokyo Radio.
#####################################################################

#####################################################################
# License
#####################################################################
# Copyright 2021 Contributing Authors
# This program is distributed under the terms of the GNU GPL.
######################################################################
*/
"use strict"

module.exports = {
    dev:        false, // if not runing main GensokyoBot
    version:    "5.3_58",
    
    bot:        "",
    api:        "",
    url:        "https://api.o7.fyi",
    stream:     "https://stream.gensokyoradio.net/2/",
    site:       "https://gensokyobot.com",
    logs:       "899315347679744000",
    
    state:      "online", 
    option:     { name: "/help", type: 0 },
    eris:       { autoreconnect: true, maxShards: "auto", intents: [ "guilds", "guildMessages", "guildMembers", "guildInteractions", "guildVoiceStates" ] },
    color:      0x421250,
    port:       4022
};