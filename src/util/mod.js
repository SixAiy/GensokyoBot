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

function Module(name) {
    if (name === undefined) {
        throw new Error("Module name undefined.");
    }
    this._name = name;
    this._commands = [];
    this._aliases = [];
    this._conds = [];
    this._hooks = [];
    this._features = {};
    this._cmdindex = {};
};
Module.prototype.getName = function () {
    return this._name;
};
function makematch(name, regex) {
    if (regex !== undefined) {
        return function (body) {
            var m = body.content.match(regex);
            if (m === null) {
                return undefined;
            }
            else {
                return {
                    type: "regex",
                    match: m
                };
            }
        }
    } else {
        var nsp = name.replace(/\./g, " ");
        return function (body) {
            //console.log(body, body.prefix);
            if (body && body.prefix) {
                var
                    bdy = body.content.slice(body.prefix.length),
                    bsp = bdy.slice(0, name.length);
                if ((bsp.toLowerCase() === name.toLowerCase() || bsp.toLowerCase() === nsp.toLowerCase()) && (bdy.length === name.length || bdy[name.length] === " ")) {
                    return {
                        type: "name",
                        args: bdy.slice(name.length + 1)
                    };
                }
            } else {
                return undefined;
            }
        }
    }
};
Module.prototype.command = function (name, opts) {
    var cobj = {
        name: name,
        regex: opts.regex,
        match: opts.match || makematch(name, opts.regex),
        rank: opts.rank || 0,
        rfmt: opts.rfmt,
        func: opts.func,
        feature: opts.feature
    };
    this._cmdindex[name] = cobj;
    this._commands.push(cobj);
    if (opts.feature !== undefined) {
        this._features[opts.feature] = true;
    }
};
Module.prototype.getCommand = function (body) {
    //console.log("CORE GETCOMMAND " + this._prefix)
    for (var i = 0; i < this._commands.length; i++) {
        var
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
            alias = this._aliases[i];
        res = alias.match(body)
        if (res !== undefined) {
            return {
                cmd: this._cmdindex[alias.cmd],
                res: res
            };
        }
    }
    return undefined;
};
Module.prototype.getAllCommands = function () {
    return this._commands;
};
Module.prototype.getAllAliases = function() {
    console.log(this._aliases);
    return this._aliases;
}
Module.prototype.alias = function (match, cmd) {
    if (typeof match === "string") {
        match = makematch(match, undefined);
    }
    else if (match instanceof RegExp) {
        match = makematch(undefined, match);
    }
    this._aliases.push({
        match: match,
        cmd: cmd
    });
};
exports.module = function (name) {
    return new Module(name);
};
