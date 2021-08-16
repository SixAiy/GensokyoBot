"use strict"

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
        //this.buildPage("/team", "Team", "team");
        this.buildPage("/privacy", "Privacy Policy", "privacy");
        this.redirectPage("/team", "/");
        this.redirectPage('/sponsor', conf.web.links.bladenode);
        this.redirectPage('/playing', conf.web.links.radio);
        this.redirectPage("/status", conf.web.links.network);
        this.redirectPage("/support", conf.web.links.support);
        this.redirectPage("/inv/gb", conf.web.links.gensokyobot);
        this.redirectPage("/inv/ex", conf.web.links.gbextreme);

        // API Functions
        this.web.get("/api/commands", async(req, res) => {
            let 
                output = {},
                mods = this.modman.getPlugins(),
                x = {};

            mods.map((m) => {
                let 
                    d = this._plugins[m].mod.getAllCommands(),
                    a = this._plugins[m].mod.getAllAliases(),
                    name = "",
                    aliases = a.map((md) => {
                        return md
                    }),
                    cmds = d.map((md) => {
                        if(0 >= md.rank) {
                            name = m.replace(/\.js$/i, "");
                            if(md.name != "" || md.name != null || name != "" || name != null) {
                                return { cmd: md.name, alias: md.alias, desc: md.feature }
                            }
                        }
                    });
                
                output[name] = cmds.filter((e) => { return e != null });
                x[name] = aliases.filter((e) => { return e != null }); 
            });
            res.json({ x, output });
        });
        this.web.get("/api/playing", async(req, res) => {
            let x = await fetch(conf.lists.gr.url).then(r => r.json());
            res.json(x);
        });

        this.web.listen(conf.web.port, () => this.serviceReady());

    }
    async buildPage(url, title, file) {
        this.web.get(url, async(req, res) => {
            res.render(path.resolve(`${site}/${file}.ejs`), { title });
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