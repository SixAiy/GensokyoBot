/*
#####################################################################
# File: discord.js
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
    { BaseClusterWorker } = require('../shardManager'),
    conf = require('../conf');

class Bot extends BaseClusterWorker {

    constructor(setup) {
        super(setup);
        
        this.modman.LoadPlugins();
        this._plugins = this.modman.pluginslist;

        require('../util/func')(this);

        this.bot.core = this;
        this.bot.editStatus("online", { name: `/help or ${conf.discord.prefix}help`, type: 0 });
        this.bot.on("error", (e) => console.log(e.stack));
        this.bot.on("rawWS", (d) => require('../util/rawWS')(this, d));
    }
    async shutdown(done) {
        await this.bot.disconnect();
        done();
    }
}

module.exports = Bot;