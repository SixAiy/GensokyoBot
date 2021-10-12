/*
    #####################################################################
    # File: mod.js
    # Title: A simple command handler for discord
    # Author: sorch/theholder <sorch@protonmail.ch>
    # Version: 2020.p1
    #####################################################################

    #####################################################################
    # License
    #####################################################################
    # Copyright 2020 Contributing Authors
    # This program is distributed under the terms of the GNU GPL.
    ######################################################################
*/

/*
    #####################################################################
    # File: mod.js
    # Title: A Radio Music Bot
    # Author: SixAiy <me@sixaiy.com>
    # Version: 5.2
    # Description:
    #  A Discord bot for playing the Gensokyo Radio.
    #####################################################################

    #####################################################################
    # License
    #####################################################################
    # Copyright 2021 Contributing Authors
    # This program is distributed under the terms of the GNU GPL.
    ######################################################################
*/

"use strict"

function Module(name) {
    if(name == undefined) throw new Error("Module name undefined.");
    this._name = name;
    this._commands = [];
    this._aliases = [];
    this._desc = {};
    this._cmdindex = {};
};

Module.prototype.getName = function() { return this._name };

function makematch(name) {
    let nsp = name.replace(/\./g, " ");
    return function(body) {
        if(body.token == undefined) {
            if(body && body.prefix) {
                let 
                    bdy = body.content.slice(body.prefix.length),
                    bsp = bdy.slice(0, name.length);
                
                if ((bsp.toLowerCase() === name.toLowerCase() || bsp.toLowerCase() === nsp.toLowerCase()) && (bdy.length === name.length || bdy[name.length] === " ")) {
                    return {
                        type: "name",
                        args: bdy.slice(name.length + 1)
                    }
                }
            } else {
                return undefined;
            }
        } else {
            if(body) {
                if(nsp == body.data.name) {
                    if(body.data.options == undefined) return { type: "name", args: "" };
                    return { type: "name", args: `${body.data.options.name}|${body.data.options.value}` }
                }
            } else {
                return undefined;
            }
        }
    }
};

Module.prototype.command = function(name, opts) {
    let cobj = {
        name: name,
        rank: opts.rank,
        desc: opts.desc,
        func: opts.func,
        interaction: opts.interaction,
        match: opts.match || makematch(name)
    }
    this._cmdindex[name] = cobj;
    this._commands.push(cobj);
    if(opts.desc != undefined) {
        this._desc[opts.desc] = true;
    }
};

Module.prototype.getCommand = function(body) {
        for (var i = 0; i < this._commands.length; i++) {
            let 
                cmd = this._commands[i],
                res = cmd.match(body);

            if (res !== undefined) {
                return {
                    cmd: cmd,
                    res: res
                };
            }
        }
        for (var i = 0; i < this._aliases.length; i++) {
            var
                alias = this._aliases[i],
                res = alias.match(body);

            if (res !== undefined) {
                return {
                    cmd: this._cmdindex[alias.cmd],
                    res: res
                };
            }
        }
        return undefined;
};

Module.prototype.getAllCommands = function() { return this._commands; };

Module.prototype.alias = function (match, cmd) {
    if (typeof match === "string") {
        match = makematch(match, undefined);
    }
    this._aliases.push({
        match: match,
        cmd: cmd
    });
};

exports.Module = function(name) { return new Module(name); };