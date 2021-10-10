/*
#####################################################################
# File: conf.js / sample.conf.js
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

module.exports = {
    version:                "5.1",

    bot_token:              "",
    
    game_status:            "online",
    game_name:              "/help",
    game_type:              0,

    eris_options:           { maxShards: "auto", intents: [ "guilds", "guildMembers", "guildInteractions", "guildVoiceStates" ] },

    embed_color:             0x421250,

    // GensokyoRadio Posting Locations
    gr_api_key:             "",

    gr_stream:              "https://stream.gensokyoradio.net/2",
    gr_url:                 "https://gensokyoradio.net",

    gr_api:                 "/api",
    gr_api_discord:         "/discord",
    gr_register:            '/register',
    gr_connect_user:        '/connect/user',
    gr_update:              '/update',
    gr_disconnect_user:     '/disconnect/user',
    gr_connect_channel:     '/connect/channel',
    gr_disconnect_channel:  '/disconnect/channel',
    keyUnregister:          '',
    gr_rating:              '/rating',

    // Listing Services
    list_top: "",
    list_discords: "",
    list_carbonitex: "",
    list_discord_bots: "",
    list_discordlist: "",
    list_discordbotlist: "",
    list_discordextremelist: "",
    list_discordlabs: "d",
    list_discordboats: "",
    list_townlist: "",
    list_listo7: ""
};