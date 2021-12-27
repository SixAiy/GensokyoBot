"use strict"

let 
    flatfile = require('flat-file-db'),
    shardsDB = flatfile(`${process.cwd()}/src/db/shards.db`);

module.exports = (app) => {

    /* Global */
    app.core.figlet = async(title) => { 
        require('figlet')(title, (e, r) => { 
            if(e) return console.log(e); 
            console.log(r); 
        }); 
    };
    app.core.log = async(title, subtitle) => { 
        console.log(`[${timestamp()}] ${title}:`, subtitle); 
    };
    app.core.humanize = async(time) => { 
        return require('moment').duration(time, 'milliseconds').format('lll'); 
    };
    app.core.randomName = async() => {
        let 
            { uniqueNamesGenerator, names } = require('unique-names-generator'),
            name = uniqueNamesGenerator({ dictionaries: [names] });
        return name;
    };
    app.core.getRemote = async(url) => {
        let data;
        await require('node-fetch')(url)
            .then((r) => r.json())
            .then((d) => { data = { error: false, data: d } })
            .then((e) => { data = { error: true, data: e } });
        return data;
    };
    app.core.postRemote = async(url, token, body) => {
        let data;
        await require('node-fetch')(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": token },
            body
        })
            .then((r) => r.json())
            .then((d) => { data = { error: false, data: d } })
            .then((e) => { data = { error: true, data: e } });
        return data;
    };
    app.core.sleep = async(time) => {
        await sleep(time);
    };

    /* Bot */
    app.core.bot = async() => {
        app.bot.connect();
        app.bot.on("error", (e) => app.core.log("error", e.stack));
        app.bot.on("ready", () => { 
            if(app.conf.firstRegister) app.core.iCommands(); 
            buildShards(app);
            app.core.log("Ready", "Discord"); 
            app.core.status("online", "in Developement");
        });
        app.bot.on("shardReady", (x) => app.core.log("Shard", `${x} Ready`));
        app.bot.on("shardDisconnect", (e, x) => app.core.log("Shard", `${x} Disconnected`));
        app.bot.on("interactionCreate", (msg) => app.core.gCommand(msg));
        app.bot.on("messageCreate", (msg) => {
            let prefix = "ur";
            if(msg.author.bot || msg.author.id != "188571987835092992" || msg.content.indexOf(prefix) !== 0) return;
            let 
                body = msg.content.slice(prefix.length).split(" "),
                cmd = body[0],
                args = body.slice(1).join(" ");
            if(cmd == "e") {
                try {
                    let
                        returned = eval(args),
                        str = require('util').inspect(returned, {depth: 1}),
                        embed = {
                            title: "evaluation Results",
                            color: 0x8BC34A,
                            fields: [
                                { name: "Input", value: `\`\`\`js\n${args}\`\`\`` },
                                { name: "Output", value: `\`\`\`js\n${str}\`\`\`` }
                            ]
                        };
                    msg.channel.createMessage({ embeds: [embed] });
                } catch(e) {
                    let embed = {
                        title: "Evaluation Results",
                        color: 0xF44336,
                        fields: [
                            { name: "Input", value: `\`\`\`js\n${args}\`\`\`` },
                            { name: "Output", value: `\`\`\`js\n${e}\`\`\`` }
                        ]
                    };
                    msg.channel.createMessage({ embeds: [embed] });
                };
            };
        });
    };
    app.core.createMD = (msg, time, content) => {
        let msgid = 0;
        msg.createMessage(content)
            .then(() => {
                msg.channel.messages.map((m) => {
                    if(m.author.id == app.bot.user.id && m.author.bot && m.interaction.user.id == msg.member.id) {
                        msgid = m.id;
                    }   
                });
                sleep(time);
                msg.deleteMessage(msgid);
            });
    };
    app.core.createMU = (msg, time, content) => {
        let msgid = 0;
        msg.createMessage(content)
            .then(() => {
                msg.channel.messages.map((m) => {
                    if(m.author.id == app.bot.user.id && m.author.bot && m.interaction.user.id == msg.member.id) {
                        msgid = m.id
                    }
                });

            });
    };
    app.core.stats = async() => { 
        return botStats(app); 
    };
    app.core.ModuleHandler = async(type, mod) => {
        if(type == "rl") {
            let state = app.modman.reload(mod);
            if(state) return `**${mod}** Reloaded`;
            return `Failed to reload **${mod}**`;
        };
        if(type == "l") {
            let state = app.modman.load(mod);
            if(state) return `${mod} Enabled ^^`;
            return `Failed to enable **${mod}**`;
        };
        if(type == "ul") {
            let state = app.modman.unload(mod);
            if(state) return `**${mod}** Disabled`;
            return `Failed to disable **${mod}**`;
        };
    };
    app.core.status = async(state, details) => {
        app.bot.editStatus(state, { name: details, type: 0 });
    };
    app.core.gCommand = async(msg) => {
        if(!msg.token) return
        if(app.conf.reGuilds.includes(msg.guildID) && app.conf.reChannels.includes(msg.channel.id)) return restrictedGuildRepsonse(app, msg);
        for(let x in app._modules) {
            let res = app._modules[x].mod.getCommand(msg);
            if(res != undefined) {
                res.cmd.func(app, msg, res.res.args || "");
            };
        };
    };
    app.core.aCommands = async() => {
        let 
            mods = app.modman.getModules(),
            cmdx = [];
        mods.map((mod) => {
            let cmds = app._modules[mod].mod.getAllCommands();
            cmds.map((cmd) => {
                cmdx.push(cmd);
            });
        });
        return cmdx;
    };
    app.core.iCommands = async() => {
        let 
            mods = app.modman.getModules(),
            dcmds = await app.bot.getCommands();    
        
        for(let mod of mods) {
            let cmds = app._modules[mod].mod.getAllCommands();
            for(let cmd of cmds) {
                if(cmd.masterGuild) {
                    let mcmds = await app.bot.getGuildCommands(app.conf.mguild);
                    if(!mcmds.length) { 
                        console.log("createGuildCommand:", cmd.name);
                        app.bot.createGuildCommand(app.conf.mguild, {
                            name: cmd.name,
                            description: cmd.desc,
                            options: cmd.options,
                            type: 1
                        });
                        sleep(5000);
                    };
                    for(let mcmd of mcmds) {
                        console.log(mcmd);
                        if(mcmd.name != cmd.name || mcmd.options != cmd.options || mcmd.description != cmd.desc || mcmd.type != cmd.type) {
                            console.log("editGuildCommand:", cmd.name);
                            app.bot.editGuildCommand(app.conf.mguild, mcmd.id, {
                                name: cmd.name,
                                description: cmd.desc,
                                options: cmd.options,
                                type: 1
                            });
                            sleep(5000);
                        }
                    }
                }
                /*
                if(!dcmds.length) { 
                    console.log("createCommand:", cmd.name);
                    app.bot.createCommand({
                        name: cmd.name,
                        description: cmd.desc,
                        options: cmd.options,
                        type: 1
                    });
                    sleep(5000);
                };
                for(let dcmd of dcmds) {
                    if(dcmd.name != cmd.name || dcmd.options != cmd.options || dcmd.description != cmd.desc || dcmd.type != cmd.type) {
                        console.log("editCommand:", cmd.name);
                        app.bot.editCommand(dcmd.id, {
                            name: cmd.name,
                            description: cmd.desc,
                            options: cmd.options,
                            type: 1
                        });
                        sleep(5000);
                    };
                };
                */
            };
        };
    };
    app.core.postStats = async() => {
        let 
            id = app.bot.user.id,
            shards = app.bot.shards.size,
            guilds = app.bot.guilds.size,
            b = { id, shards, guilds };
            x = await app.core.postRemote(`${app.conf.api}/bot/gb`, app.conf.api_rKey, b);
        app.core.log("postStats", Object.keys(x.data));
    };

    /* Web */
    app.core.web = async() => {
        let web = require('express')();
        web.use(require('cors')());
        web.post('/', async(req, res) => {
            if(req.headers['authorization'] != app.conf.api_lKey) return res.json({ error: true, msg: "Failed to authenticate token" });
            let 
                stats = await botStats(app),
                cmds = await app.core.aCommands();
            res.json({stats, cmds});
        });
        web.get("*", (req, res) => res.status(404));
        web.listen(app.conf.api_port, app.core.log(`API`, "Online"));
    };


    /* Timeouts */
    if(app.conf.env != "dev") {
        app.core.postStats();
    }
}; 

function sleep(t) {
    let date = Date.now();
    let curDate = null;
    do { 
        curDate = Date.now(); 
    } while(curDate - date < t);
};
function timestamp() {
    let d = new Date();
    return d.getFullYear() + "-" +
        pad(d.getMonth() + 1, 2, "0") + "-" +
        pad(d.getDate(), 2, "0") + " " +
        pad(d.getHours(), 2, "0") + ":" +
        pad(d.getMinutes(), 2, "0") + ":" +
        pad(d.getSeconds(), 2, "0");
};
function pad(s, len, c) {
    var cur = s.toString();
    while(cur.length < len) {cur = c + cur;}
    return cur;
}
function buildShards(app) {
    let 
        {uniqueNamesGenerator, names} = require('unique-names-generator'),
        shards = [];

    app.bot.shards.map(s => {
        let 
            listeners = 0,
            players = 0;


        s.client.guilds.map((g) => {
            g.channels.map((c) => {
                if(c.type == 2 && c.voiceMembers.has(app.bot.user.id)) {
                    players++;
                    c.voiceMembers.map((vm) => {
                        if(vm.id != app.bot.user.id && (!vm.voiceState.selfDeaf || !vm.voiceState.deaf)) {
                            listeners++;
                        }
                    });
                }
            }); 
        });
        if(shardsDB.has(`shard:${s.id}`)) {
            let 
                db = shardsDB.get(`shard:${s.id}`),
                build = {
                    id: s.id,
                    name: db,
                    ready: s.ready,
                    status: s.status,
                    latency: s.latency,
                    guilds: s.client.guilds.size,
                    listeners: listeners,
                    players: players
                };
            shards.push(build);
        } else {
            let name = uniqueNamesGenerator({ dictionaries: [names] });
            shardsDB.put(`shard:${s.id}`, name);
            let build = {
                id: s.id,
                name: name,
                ready: s.ready,
                status: s.status,
                latency: s.latency,
                guilds: s.client.guilds.size,
                listeners: listeners,
                players: players
            };
            shards.push(build);
        }
    }); 
    return shards
};
function fromSecondsToHumanUptime(time) {
    let 
        moment = require('moment'),
        now = moment.utc(),
        timer = moment.utc(moment.duration(time, 's').asMilliseconds()),
        t = now - timer,
        started = moment.utc(t).format('lll');
    return started;
}
function botStats(app) {
    let
        moment = require('moment'),
        shards = buildShards(app),
        uptime = process.uptime(),
        total_players = 0,
        total_listeners = 0,
        total_shards = 0,
        online_shards = 0,
        loadavg = require('os').loadavg(),
        ram = { 
            total: process.memoryUsage().heapTotal / 1024 / 1024,  
            used: process.memoryUsage().heapUsed / 1024 / 1024,
        };

    app.bot.shards.map((s) => {  
        total_shards++;      
        if(!s.connecting) {
            online_shards++;
        }
    });
    shards.map(s => {
        total_players += s.players;
        total_listeners += s.listeners;
    });
    let 
        now = moment.utc(),
        upms = moment.utc(moment.duration(uptime, 's').asMilliseconds()),
        upset = now - upms,
        started = moment.utc(upset).format('lll'),
        build = {
            env: app.conf.env,
            server: require('os').hostname(),
            version: app.conf.version,
            total_guilds: app.bot.guilds.size.toLocaleString(),
            total_players,
            total_listeners,
            total_shards,
            online_shards,
            uptime: uptime,
            started,
            ram,
            loadavg,
            shards
    };
    
    return build;
};
async function restrictedGuildRepsonse(app, msg) {
    if(msg.guildID == "174820236481134592") {
        app.core.createMD(msg, 30000, `<@${msg.member.id}>: Please read  <#219483023257763842> for server rules and only use commands in <#174821093633294338>`);
    }
    if(msg.guildID == "269896638628102144") {
        app.core.createMD(msg, 30000, `<@${msg.member.id}>: Please read <#919975803108864021> for server rules and only use commands in <#919974561322266694>`);
    }
};