"use strict"

Module.prototype.command = function(name, opts) {
    let cobj = {
        name: name,
        desc: opts.desc,
        options: opts.options ? opts.options : [],
        masterGuild: opts.masterGuild ? opts.masterGuild : false,
        func: opts.func,
        match: makematch(name)
    }
    this._cmdindex[name] = cobj;
    this._commands.push(cobj);
    if(opts.desc != undefined) this._desc[opts.desc] = true;
};
Module.prototype.getCommand = function(body) {
    for (var i = 0; i < this._commands.length; i++) {
        let 
            cmd = this._commands[i],
            res = cmd.match(body);

        if(res !== undefined) return { cmd: cmd, res: res };
    }
    return undefined;
};
Module.prototype.getAllCommands = function() { 
    return this._commands; 
};
exports.Module = function(name) { 
    return new Module(name); 
};

function Module(name) {
    if(name == undefined) throw new Error("Module name undefined.");
    this._name = name;
    this._commands = [];
    this._desc = {};
    this._cmdindex = {};
};
function makematch(name) {
    let cmd = name.replace(/\./g, " ");
    return function(body) {
        if(body.token != undefined) {
            if(cmd == body.data.name) return { type: "name", cmd: body.data.name, value: body.data.value };
            return undefined;
        };
        return undefined;
    };
};