"use strict"

let conf = require('../conf');

module.exports = async(m) => {
    // Interaction Create Commands
    /*
    m.bot.createSlashs = async() => {
        let 
            plugins = m.modman.pluginslist,
            mods = m.modman.getPlugins(),
            output = {} 
            
            mods.map(async (m) => {
                let 
                    mdata = plugins[m].modman.getAllCommands(),
                    cmds = mdata.map(async(md) => { 
                        if(0 >= md.rank) {   
                            if(md.name != "" || md.name != null || name != "" || name != null) return { name: `,,${md.name}`, desc: md.desc }
                        }
                    });
                output = cmds.filter((e) => { return e != null });
            });
        for(let cmd of output) {
            m.bot.createCommand({
                name: cmd.name,
                description: cmd.desc,
                options: [],
                type: 1
            });
            await new Promise((res) => setTimeout(res, 5000));
        }
    };
    */

    // interactionCreate Handlers
    m.bot.getIC = async(inter) => {
        let 
            lvl = m.bot.plvl("i", inter),
            r = undefined;
        for(let p in m.bot.core._plugins) {
            r = m.bot.core._plugins[p].module.getCmdI(inter, m);
            if(r != undefined) {
                if(lvl >= r.cmd.rank) r.cmd.func(inter, m, r.res.args || "");
            }
        }
    };
    // messageCreate Handlers
    m.bot.getMC = async(msg) => {
        console.log("Inside getMC");
        if(msg.author.bot) return;
        msg.prefix = conf.dis.p;     
        let 
            lvl = m.bot.pLvl(msg),
            r = undefined;
        for(let p in m.bot.core._plugins) {
            r = m.bot.core._plugins[p].module.getCommand(msg, m);
            if(r != undefined) {
                console.log("arrived after 'r != undefined'");
                if(lvl >= r.cmd.rank) r.cmd.func(msg, m, r.res.args || ""); console.log("on Command!");
            }
        }
    };

    // Main Functions
    m.bot.pLvl = async(t, x) => {
        let 
            plvl = 0,
            porder = m.bot.perm.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
        if(t == "i") {
            while(porder.length) {
                let clvl = porder.shift();
                if(clvl.check(x, m)) {
                    plvl = clvl.level;
                    break;
                }
            }
        } else {
            while(porder.length) {
                let clvl = porder.shift();
                if(clvl.check(x, m)) {
                    plvl = clvl.level;
                    break;
                }
            }
        }   
    };
    m.bot.clean = async(bot, txt) => {
        if(txt && txt.constructor.name == "Promise") txt = await txt;
        if(typeof evaled != "String") txt = await txt;
        txt = txt
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`)
            .replace(m.bot.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");
        return txt;
    };
    m.bot.countMusic = async(chan) => {
        let 
            vclisteners = 0,
            vcusers = [],
            ch = await m.ipc.fetchChannel(chan);
        if(ch.type == 2 && ch.voiceMembers.has(m.bot.user.id)) {
            vclisteners += ch.voiceMembers.map(x => x).length - 1;
            ch.voiceMembers.map(async(x) => {
                let 
                    u = await m.ipc.fetchMember(x.guild, x.user.id),
                    data = { username: u.user.username, id: u.user.id };
                vcusers.push(data);
            });
        }
        return { vclisteners, vcusers };
    };
    m.bot.serverRam = async(ram) => {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if(ram == 0) return "0 GB";
        let i = parseInt(Math.floor(Math.log(ram) / Math.log(1024)));
        return Math.round(ram / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }; 

    /*
    // Grabs Staff members
    m.bot.fetchStaff = async(userid, roleid) => {
        let u = await m.ipc.fetchMember(conf.guild_id, userid);
        return u.roles.includes(roleid);
    };
    m.bot.fetchGuildOwner = async(guild) => {
        let g = await m.ipc.fetchGuild(guild);
        return g.ownerID;
    }
    */

    // Permission System Storage
    m.bot.perm = [
        { 
            level: 0, name: "User", 
            check: () => true 
        },
        /*
        { 
            level: 1, name: "Guild Mod", 
            check: (x, m) => false
        },
        { 
            level: 2, name: "Guild Admin", 
            check: (x, m) => false
        },
        { 
            level: 3, name: "Guild Owner", 
            check: (x, m) => false //m.bot.fetchGuildOwner(x.guild_id) 
        },
        { 
            level: 4, name: "Bot Mod", 
            check: (x, m) => m.bot.fetchStaff(x.user.id, conf.role.mod)
        },
        { 
            level: 5, name: "Bot Admin", 
            check: (x, m) => m.bot.fetchStaff(x.user.id, conf.role.admin) 
        },
        { 
            level: 6, name: "Bot Dev", 
            check: (x, m) => m.bot.fetchStaff(x.user.id, conf.role.dev) 
        },
        */
        { 
            level: 7, name: "Bot Owner", 
            check: (x, m) => conf.owners.includes(x.user.id)
        }
    ];

}