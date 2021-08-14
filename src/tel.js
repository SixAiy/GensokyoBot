"use strict"

let 
    // Packages
    Telegram = require('node-telegram-bot-api'),

    // Local
    { BaseServiceWorker } = require('./shardManager'),
    conf = require('./conf');

module.exports = class ServiceWorker extends BaseServiceWorker {
    constructor(setup) {
        super(setup);

        this.t = new Telegram(conf.api.Telegram, { polling: true });
        this.t.on('message', this.handleCmds.bind(this));

    }
    async handleCmds(msg) {
        msg.content = msg.text;
        msg.prefix = conf.tg.prefix;
        let res = undefined;
        for(let mod of this.modman.getModules()){
            res = this.modman.pluginlist[mod].mod.getCommand(msg);
            if(res != undefined) {
                let params = res.res.args || "";
                res.cmd.func("tg", msg, this, params);
            }
        }
    }
    shutdown(done) {
        done();
    }
}