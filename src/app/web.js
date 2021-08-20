/*
    #####################################################################
    # File: web.js
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
        this.buildPage('/music', "Now Playing", "music");
        //this.buildPage("/team", "Team", "team");
        this.buildPage("/privacy", "Privacy Policy", "inc/legal/privacy");
        //this.buildPage("/terms", "Terms of Use", "inc/legal/terms");
        //this.buildPage("/dmca", "Copyright Infringement Policy (DMCA)", "inc/legal/dmca");

    
        this.redirectPage('/sponsor', conf.web.links.bladenode);
        this.redirectPage("/status", conf.web.links.network);
        this.redirectPage("/discord", conf.web.links.discord);
        this.redirectPage('/telegram', conf.web.links.telegram);
        this.redirectPage("/invite", conf.web.links.gensokyobot);

        // Team Page - because staff love changing there profile pic :/
        this.web.get('/team', async(req, res) => {
            let
                guild = await this.ipc.fetchGuild(conf.discord.guild),
                team = [],
                role = "",
                roles = conf.discord.roles;

            console.log(guild);
            /*
            guild.members.map(m => {
                if(!m.roles.includes(roles.admin || roles.mod)) return;
                if(m.roles.includes(roles.admin)) role = guild.roles.get(roles.admin);
                if(m.roles.includes(roles.mod)) role = guild.roles.get(roles.mod);

                let 
                    roleColor = role.color,
                    roleName = role.name,
                    bt = {
                        username: m.user.username,
                        avatar: m.user.avatarURL,
                        role: { name: roleName, color: roleColor }
                    }

                team.push(bt);
            });
            */

            res.render(path.resolve(`${site}/team.ejs`, { title: "Team", team: team }))
        });

        // Commands Page
        this.web.get("/cmds", async(req, res) => {

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

            res.render(path.resolve(`${site}/cmds.ejs`), {
                title: "Commands",
                output
            })
        });

        // API Functions
        this.web.get("/api/playing", async(req, res) => {
            let x = await fetch(conf.lists.gr.url).then(r => r.json());
            res.json(x);
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