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
    buildPage(app, '/playing', "Now Playing", "music");
    buildPage(app, '/privacy', "Privacy Policy", "inc/legal/privacy");

    redirectPage(app, '/status', "http://status.sixaiy.com");
    redirectPage(app, '/discord', conf.guild_invite);
    redirectPage(app, '/invite', `https://discord.com/oauth2/authorize?client_id=${app.bot.user.id}&scope=bot%20applications.commands&permissions=${conf.invite_perms}`);
    
    app.web.get('/team', async(req, res) => {
        let 
            guild = app.bot.guilds.get(conf.guild_id),

            ownid = conf.bot_owner,
            admid = conf.bot_admin,
            modid = conf.bot_mod,
            conid = conf.bot_contributor,

            ownr = guild.roles.get(ownid),
            admr = guild.roles.get(admid),
            modr = guild.roles.get(modid),
            conr = guild.roles.get(conid),
            owner = [],
            admin = [],
            mod = [],
            con = [];
        
        ownr.color = componentToHex(ownr.color);
        admr.color = componentToHex(admr.color);
        modr.color = componentToHex(modr.color);
        conr.color = componentToHex(conr.color);

        guild.members.map((m) => {
            let 
                u = m.user,
                r = m.roles;

            if(r.includes(ownid)) return owner.push({id:u.id, username:u.username, avatar:u.avatarURL.replace("?size=128", "?size=256"), role:ownr});
            if(r.includes(admid)) return admin.push({id:u.id, username:u.username, avatar:u.avatarURL.replace("?size=128", "?size=256"), role:admr});
            if(r.includes(modid)) return mod.push({id:u.id, username:u.username, avatar:u.avatarURL.replace("?size=128", "?size=256"), role:modr});
            if(r.includes(conid)) return con.push({id:u.id, username:u.username, avatar:u.avatarURL.replace("?size=128", "?size=256"), role:conr});
        });

        res.render(path.resolve(`${site}/team.ejs`), {
            title: "Team",
            data: {owner, admin, mod, con}
        });
    });
    app.web.get('/cmds', async(req, res) => {
        let
            mods = app.modman.getPlugins(),
            cmds = [];

        mods.map((m) => {
            let 
                data = app._plugins[m].mod.getAllCommands(),
                loaded = data.map((md) => {
                    if(0 >= md.rank) {
                        return {name: `▫️ ${md.name}`, desc: `${md.desc}`};
                    }
                });
            for(let cmd of loaded) {
                if(cmd != undefined) {
                    cmds.push({ name: cmd.name, desc: cmd.desc });
                }
            }
        });

        res.render(path.resolve(`${site}/cmds.ejs`), {
            title: "Commands",
            cmds
        });

    });
    app.web.get('/api/playing', async(req, res) => {
        let x = await fetch(`${conf.gr_url}${conf.gr_api}${conf.gr_api_playing}`).then((r) => r.json());
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
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}