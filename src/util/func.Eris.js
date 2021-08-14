"use strict"

let conf = require('../conf');

module.exports = async(m) => {

    // Interaction Create Commands

    m.dis.createSlashs = async() => {
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
            m.dis.createCommand({
                name: cmd.name,
                description: cmd.desc,
                options: [],
                type: 1
            });
            await new Promise((res) => setTimeout(res, 5000));
        }
    };

    // interactionCreate Handlers
    m.dis.getIC = async(inter) => {
        let 
            lvl = m.dis.plvl("i", inter),
            r = undefined;
        for(let p in m.dis.core._plugins) {
            r = m.dis.core._plugins[p].module.getCmdI(inter, m);
            if(r != undefined) {
                if(lvl >= r.cmd.rank) r.cmd.func(inter, m, r.res.args || "");
            }
        }
    };
    // messageCreate Handlers
    m.dis.getMC = async(msg) => {
        let 
            lvl = m.dis.pLvl(msg),
            r = undefined;
        for(let p in m.dis.core._plugins) {
            r = m.dis.core._plugins[p].module.getCmdM(msg, m);
            if(r != undefined) {
                if(lvl >= r.cmd.rank) r.cmd.func(msg, m, r.res.args || "");
            }
        }
    };

    // Main Functions
    m.dis.pLvl = async(t, x) => {
        let 
            plvl = 0,
            porder = m.dis.perm.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
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
    m.dis.clean = async(bot, txt) => {
        if(txt && txt.constructor.name == "Promise") txt = await txt;
        if(typeof evaled != "String") txt = await txt;
        txt = txt
            .replace(/`/g, `\`${String.fromCharCode(8203)}`)
            .replace(/@/g, `@${String.fromCharCode(8203)}`)
            .replace(m.dis.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");
        return txt;
    };
    m.dis.countMusic = async(chan) => {
        let 
            vclisteners = 0,
            vcusers = [],
            ch = await m.ipc.fetchChannel(chan);
        if(ch.type == 2 && ch.voiceMembers.has(m.dis.user.id)) {
            vclisteners += ch.voiceMembers.map(x => x).length - 1;
            ch.voiceMembers.map(x => {
                let 
                    u = await m.ipc.fetchMember(x.guild, x.user.id),
                    data = { username: u.user.username, id: u.user.id };
                vcusers.push(data);
            });
        }
        return { vclisteners, vcusers };
    };
    m.dis.serverRam = async(ram) => {
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if(ram == 0) return "0 GB";
        let i = parseInt(Math.floor(Math.log(ram) / Math.log(1024)));
        return Math.round(ram / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }; 

    /*
    // Grabs Staff members
    m.dis.fetchStaff = async(userid, roleid) => {
        let u = await m.ipc.fetchMember(conf.guild_id, userid);
        return u.roles.includes(roleid);
    };
    m.dis.fetchGuildOwner = async(guild) => {
        let g = await m.ipc.fetchGuild(guild);
        return g.ownerID;
    }
    */

    // Permission System Storage
    m.dis.perm = [
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
            check: (x, m) => false //m.dis.fetchGuildOwner(x.guild_id) 
        },
        { 
            level: 4, name: "Bot Mod", 
            check: (x, m) => m.dis.fetchStaff(x.user.id, conf.role.mod)
        },
        { 
            level: 5, name: "Bot Admin", 
            check: (x, m) => m.dis.fetchStaff(x.user.id, conf.role.admin) 
        },
        { 
            level: 6, name: "Bot Dev", 
            check: (x, m) => m.dis.fetchStaff(x.user.id, conf.role.dev) 
        },
        */
        { 
            level: 7, name: "Bot Owner", 
            check: (x, m) => conf.owners.includes(x.user.id)
        }
    ];

}