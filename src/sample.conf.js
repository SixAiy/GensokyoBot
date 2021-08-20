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
    bot_admin:              "",
    bot_mod:                "",
    bot_owners:             [""], // Only place userIds in here.
    guild_id:               "",

    game_status:            "online",
    game_name:              "",
    game_type:              1,

    webhook_error_log:      "",
    webhook_guild_log:      "",

    eris_shards:            "auto",
    eris_all_users:         true,
    eris_intents:           [ "guilds", "guildMembers", "guildMessages", "guildInteractions", "guildVoiceStates" ],

    invite_perms:           "",
    guild_invite:           "",

    music_api:              "",
    music_stream:           "",

    embed_color:             0x421250,

    web_domain:             "",
    web_port:                4000,

    // Bot Listing Places
    enable_post:             false,
    sentcord_token:         "",
    carbonitex_token:       "",
    topgg_token:            "",
    discordbotsgg_token:    "",
    discordbotlist_token:   "",
    discordlistspace_token: ""
};