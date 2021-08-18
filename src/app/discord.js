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