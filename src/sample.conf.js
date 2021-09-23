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
    development:            true,

    bot_token:              "",
    api_token:              "",

    legacy_prefix:          "-", // Bot runs with Slash Commands Now.

    bot_owners:             ["", ""], // Only place userIds in here.
    bot_owner:              "", // Role for Owners
    bot_admin:              "",
    bot_mod:                "",
    bot_contributor:        "",

    guild_id:               "",
    guild_invite:           "",

    channel_restrictions:   ["", ""],
    channel_rules:          "",
    channel_bot_spam:       "",
    
    game_status:            "online",
    game_name:              "/help or ,,help",
    game_type:              1,

    webhook_error_log:      "",
    webhook_guild_log:      "",

    eris_options:           { maxShards: "auto", getAllUsers: true, intents: [ "guilds", "guildMembers", "guildMessages", "guildInteractions", "guildVoiceStates" ] },

    invite_perms:           "",

    embed_color:             0x421250,


    // GensokyoRadio Posting Locations
    gr_api_key:             "",

    gr_stream:              "https://stream.gensokyoradio.net/2",
    gr_discord:             "https://discord.gg/5ecahrZ ",
    gr_url:                 "https://gensokyoradio.net",

    gr_api:                 "/api",
    gr_api_discord:         "/discord",
    gr_api_playing:         "/station/playing",
    gr_register:            '/register',
    gr_connect_user:        '/connect/user',
    gr_update:              '/update',
    gr_disconnect_user:     '/disconnect/user',
    gr_connect_channel:     '/connect/channel',
    gr_disconnect_channel:  '/disconnect/channel',
    keyUnregister:          '',
    gr_rating:              '/rating'
};