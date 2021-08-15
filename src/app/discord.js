"use strict"

let 
    { BaseClusterWorker } = require('../shardManager'),
    { SlashCreator } = require('slash-create'),
    conf = require('../conf');

class Bot extends BaseClusterWorker {

    constructor(setup) {
        super(setup);
        
        this.modman.LoadPlugins();
        this._plugins = this.modman.pluginslist;

        require('../util/func.js')(this);

        this.bot.core = this;
        this.bot.slashCmd = new SlashCreator({ applicationID: conf.discord.app, publicKey: conf.discord.key, token: conf.discord.token })
        //this.bot.createSlashs();
        this.bot.editStatus("online", { name: `/help or ${conf.discord.prefix}help`, type: 0 });
        //this.bot.on("interactionCreate", (m) => this.bot.getIC(m));
        //this.bot.on('messageCreate', this.handleMsg.bind(this));
        this.bot.on("error", (e) => console.log(e.stack));
        this.bot.on("messageCreate", (m) => this.bot.getCommand(m, this)); 
    }
    async shutdown(done) {
        await this.bot.disconnect();
        done();
    }
}

module.exports = Bot;