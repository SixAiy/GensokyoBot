/*
#####################################################################
# File: conf.js / sample.conf.js
# Title: A Radio Music Bot
# Author: SixAiy <me@sixaiy.com>
# Version: 5.2
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
    version:    "5.2",

    bot:        "",
    api:        "",
    url:        "https://api.o7.fyi",
    stream:     "https://stream.gensokyoradio.net/2/",
    site:       "https://gensokyobot.com",
    
    state:      "online", 
    option:     { name: "/help", type: 0 },
    eris:       { maxShards: "auto", intents: [ "guilds", "guildMembers", "guildInteractions", "guildVoiceStates" ] },
    color:      0x421250,
};