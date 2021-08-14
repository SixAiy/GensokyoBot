"use strict"

function Module(name) {
    if(name == undefined) throw new Error("Module name undefined.");
    this._name = name;
    this._cmds = [];
    this._aliases = [];
    this._desc = [];
    this._cmdi = [];
};

Module.prototype.getName = function() { return this._name };

function makematch(name) {
    return function(body) {
        if(body && body.prefix) {
            let 
                nsp = name.replace(/\./g, " "),
                bdy = body.content.slice(body.prefix.length),
                bsp = bdy.slice(0, name.length),
                nspLow = nsp.toLowerCase(),
                bspLow = bsp.toLowerCase(),
                nameLow = name.toLowerCase();
            if((bspLow == nameLow || bspLow == nspLow) && (body.length == name.length || bdy[name.length] == " ")) return { type: "name", args: bdy.slice(name.length + 1) };
        } else { 
            return undefined; 
        }
    }
}

Module.prototype.command = function(name, opts) {
    let obj = { name: name, match: opts.match || makematch(name), rank: opts.rank, func: opts.func, desc: opts.desc };
    this._cmdi[name] = obj;
    this._cmds.push(obj);
    if(opts.desc != undefined) this._desc[opts.desc] = true;
}

Module.prototype.getCommand = function(body) {
    for(let i = 0; i < this._cmds.length; i++) {
        let 
            cmd = this._cmds[i],
            res = cmd.match(body);
        if(res != undefined) return { cmd: cmd, res: res };
    }
    for(let i = 0; i < this._aliases.length; i++) {
        let
            alias = this._aliases[i],
            res = alias.match(body);
        if(res != undefined) return { cmd: this._cmdi[alias.cmd], res: res }; 
    }
    return undefined;
}

Module.prototype.getIC = function(body, m) {
    
}

Module.prototype.getAllCommands = function() {return this._cmds; };

Module.prototype.alias = function(match, cmd) {
    match = makematch(match);
    this._aliases.push({ match: match, cmd: cmd });
}

exports.mdoule = function(name) { return new Module(name); };