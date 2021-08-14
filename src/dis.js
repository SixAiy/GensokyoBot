"use strict"

let { BaseClusterWorker } = require('./util/shardManager');

class Bot extends BaseClusterWorker {
    constructor(setup) {
        super(setup);
        
        this.modman.LoadPlugins();
        this._plugins = this.modman.pluginslist;

        require('./util/func.Eris')(this);

        this.dis.core = this;
        this.dis.createSlashs();
        this.dis.editStatus("online", { name: `/help or ,,help`, type: 0 });
        this.dis.on("interactionCreate", this.interHandle.bind(this));
        this.dis.on("messageCreate", this.msgHandle.bind(this));
    }
    async interHandle(inter) { 
        this.dis.getIC(inter); 
    }
    async msgHandle(msg) {
        if(msg.author.bot) return;
        msg.prefix = require('./conf').dis.prefix;        
        this.dis.getMC(msg);
    }
    async shutdown(done) {
        await this.dis.disconnect();
        done();
    }
}

module.exports = Bot;