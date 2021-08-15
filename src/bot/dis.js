"use strict"

let 
    { BaseClusterWorker } = require('./shardManager'),
    conf = require('./conf');

class Bot extends BaseClusterWorker {

    constructor(setup) {
        super(setup);
        
        this.modman.LoadPlugins();
        this._plugins = this.modman.pluginslist;

        require('./util/func.js')(this);

        this.bot.core = this;
        //this.bot.createSlashs();
        this.bot.editStatus("online", { name: `/help or ${conf.dis.p}help`, type: 0 });
        //this.bot.on("interactionCreate", (m) => this.bot.getIC(m));
        //this.bot.on('messageCreate', this.handleMsg.bind(this));
        this.bot.on("messageCreate", this.handleMsg.bind(this)); 
        this.bot.on('rawWS', (d) => {
            console.log("HELLO rawWS!?");
            if(d.t == "MESSAGE_CREATE") {
                console.log("HELLO MESSAGE CREATE!?");
            }
        });
    }
    async handleMsg(m) {
        if(m.user.bot) return;
        m.prefix = conf.dis.p;
        this.bot.getMC(m);
    }
    async shutdown(done) {
        await this.bot.disconnect();
        done();
    }
}

module.exports = Bot;