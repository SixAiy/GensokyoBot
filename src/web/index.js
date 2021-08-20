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
    express = require('express'),
    bodyParser = require('body-parser'),
    expressJS = require('ejs').renderFile,
    path = require('path'),
    fetch = require('node-fetch'),
    conf = require('../conf'),
    dir = path.resolve('./src/web'),
    site = path.resolve(`${dir}/site`);

module.exports = (app) => {

    app.web = express();
    app.web.set('trust proxy', 5);
    app.web.use('/_gb', express.static(path.resolve(`${dir}/_gb`), { maxAge: '10d' }));
    app.web.use(require("morgan")("combined"));
    app.web.engine('html', expressJS);
    app.web.set('view engine', 'html');
    app.web.use(bodyParser.json());
    app.web.use(bodyParser.urlencoded({ extended: true }));

    buildPage(app, "/", "Home", "index");
    buildPage(app, '/music', "Now Playing", "music");
    buildPage(app, '/privacy', "Privacy Policy", "inc/legal/privacy");

    redirectPage(app, '/status', "http://status.sixaiy.com");
    redirectPage(app, '/discord', conf.guild_invite);
    redirectPage(app, '/invite', `https://discord.com/oauth2/authorize?client_id=${app.bot.user.id}&scope=bot%20applications.commands&permissions=${conf.invite_perms}`);

    app.web.get('/team', async(req, res) => {
        let 
            guild = app.bot.guilds.get(conf.guild_id),
            team = [],
            role = "",
            team_admin = conf.bot_admin,
            team_mod = conf.bot_mod;

        res.json({team_admin, team_mod, guild});
    });
    app.web.get('/cmds', async(req, res) => {
        let
            mods = app.modman.getPlugins(),
            commands = {};

        mods.map((m) => {
            let 
                d = app._plugins[m].mod.getAllCommands(),
                name = "",
                cmds = d.map((md) => {
                    if(0 >= md.rank) {
                        name = m.replace(/\.js$/i, "");
                        if(md.name != "" || md.name != null || name != "" || name != null) {
                            return { cmd: md.name, desc: md.desc }
                        }
                    }
                });
            commands[name] = cmds.filter((e) => { return e != nill });
        });

        res.render(path.resolve(`${site}/cmds.ejs`), {
            title: "Commands",
            commands
        });

    });
    app.web.get('/api/playing', async(req, res) => {
        let x = await fetch(conf.music_api).then((r) => r.json());
        res.json(x);
    });

    app.web.listen(conf.web_port, () => console.log("Web", "Ready!"));   
};

function buildPage(app, url, title, file, data) {
    app.web.get(url, async(req, res) => {
        res.render(path.resolve(`${site}/${file}.ejs`), {
            title,
            data
        });
    });
};
function redirectPage(app, url, redirect) {
    app.web.get(url, async(req, res) => res.redirect(redirect));
};
function handleErrorMsg(msg) {
    return {
        error: true,
        msg: msg
    }
}