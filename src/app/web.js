"use strict"

const { throws } = require('assert');

let 
    // Packages
    express = require('express'),
    bodyParser = require('body-parser'),
    expressJS = require('ejs').renderFile,
    path = require('path'),
    fetch = require('node-fetch'),

    // Local
    { BaseServiceWorker } = require('../shardManager'),
    conf = require('../conf'),
    dir = path.resolve('./src/web'),
    site = path.resolve(`${dir}/site`);

module.exports = class ServiceWorker extends BaseServiceWorker {
    constructor(setup) {
        super(setup);

        this.modman.LoadPlugins();
        this._plugins = this.modman.pluginslist;

        this.web = express();
        this.web.set('trust proxy', 5);
        this.web.use('/_gb', express.static(path.resolve(`${dir}/_gb`), { maxAge: '10d' }));
        this.web.use(require("morgan")("combined"));
        this.web.engine('html', expressJS);
        this.web.set('view engine', 'html');
        this.web.use(bodyParser.json());
        this.web.use(bodyParser.urlencoded({ extended: true }));

        this.buildPage("/", "Home", "index");
        this.buildPage("/cmds", "Commands", "cmds");
        this.buildPage('/music', "Now Playing", "music");
        this.buildPage("/team", "Team", "team");
        this.buildPage("/privacy", "Privacy Policy", "inc/legal/privacy");
        //this.buildPage("/terms", "Terms of Use", "inc/legal/terms");
        //this.buildPage("/dmca", "Copyright Infringement Policy (DMCA)", "inc/legal/dmca");

    
        this.redirectPage('/sponsor', conf.web.links.bladenode);
        this.redirectPage("/status", conf.web.links.network);
        this.redirectPage("/discord", conf.web.links.discord);
        this.redirectPage('/telegram', conf.web.links.telegram);
        this.redirectPage("/invite", conf.web.links.gensokyobot);

        // API Functions
        this.web.get("/api/cmds", async(req, res) => {
            let 
                output = {},
                mods = this.modman.getPlugins();

            mods.map((m) => {
                let 
                    d = this._plugins[m].mod.getAllCommands(),
                    name = "",
                    cmds = d.map((md) => {
                        if(0 >= md.rank) {
                            name = m.replace(/\.js$/i, "");
                            if(md.name != "" || md.name != null || name != "" || name != null) {
                                return { cmd: md.name, desc: md.feature }
                            }
                        }
                    });
                
                output[name] = cmds.filter((e) => { return e != null });
            });
            res.json(output);
        });
        this.web.get("/api/playing", async(req, res) => {
            let x = await fetch(conf.lists.gr.url).then(r => r.json());
            res.json(x);
        });
        this.web.get("/api/stats", async(req, res) => {
            let stats = await this.ipc.getStats();
            res.json(stats);
        });

        this.web.listen(conf.web.port, () => this.serviceReady());

    }
    async buildPage(url, title, file, data) {
        this.web.get(url, async(req, res) => {
            res.render(path.resolve(`${site}/${file}.ejs`), { title, data: data });
        });
    }
    async redirectPage(url, redirect) {
        this.web.get(url, async(req, res) => {
            res.redirect(redirect);
        });
    }
    shutdown(done) {
        done();
    }
}