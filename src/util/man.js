var fs = require("fs");
var resolve = require('resolve');
var _ = require("underscore");

function ModuleManager(path) {
	//console.log(path);
	this.pluginslist = {};
	this.pathBFU = path

};
ModuleManager.prototype.LoadPlugins = function() {
	var self = this;
	var pluginsDir = fs.readdirSync(self.pathBFU);
	//console.log(self.pathBFU);
    pluginsDir.forEach(function (file) {
		//console.log(file);
        self.pluginslist[file] = require(self.pathBFU + file);
		//self.isLoaded(file);
	});
};
ModuleManager.prototype.pl = function() {
	return this.pluginslist;
};
ModuleManager.prototype.load = function(mod) {
	//console.log("LOAD " + mod)
	var mod = mod.replace(/\.js$/i, "");
	var mod = mod + ".js";
    if (fs.existsSync(this.pathBFU + mod)) {
        //var file = self.pathBFU + mod;
        this.pluginslist[mod] = require(this.pathBFU + mod);
		return true;
	} else {
		return false;
	}
};
ModuleManager.prototype.reload = function(mod) {
	var mod = mod.replace(/\.js$/i, "");
    if (fs.existsSync(`${this.pathBFU}${mod}.js`)) {
		this.unload(mod);
        var path = resolve.sync(`${this.pathBFU}${mod}.js`);
		if (require.cache[path]){
			delete require.cache[path];
		}
		return this.load(mod);
	} else {
		return false;
	}
};
ModuleManager.prototype.unload = function(mod) {
	var mod = mod.replace(/\.js$/i, "");
	var mod = mod + ".js";
	if(this.pluginslist.hasOwnProperty(mod)) {
		delete this.pluginslist[mod];
		return true;
	}
	else {
		return false;
	}
};
ModuleManager.prototype.isLoaded = function(mod) {
	if(this.pluginslist.hasOwnProperty(mod)) {
		return true;
	}
	else {
		return false;
	}
};
ModuleManager.prototype.getPlugins = function() {
	return _.keys(this.pluginslist);
};
exports.ModuleManager = ModuleManager;

/*

"use strict"

function Module(name) {
    if(name == undefined) throw new Error("Module name undefined.");
    this._name = name;
    this._commands = [];
    this._aliases = [];
    this._description = {};
    this._cmdPreview = {};
};

Module.prototype.getName = function() {
    return this._name;
};

function makematch(name) {
    let nsp = name.replace(/\./g, " ");
    return function(body) {
        if(body && body.prefix) {
            let 
                bdy = body.content.slice(body.prefix.length),
                bsp = bdy.slice(0, name.length);
            if((bsp.toLowerCase() === name.toLowerCase() || bsp.toLowerCase() === nsp.toLowerCase()) && (bdy.length === name.length || bdy[name.length] === " ")) {
                return { type: "name", args: bdy.slice(name.length + 1)}
            }
        }
    }
}



// Plugin loader
let 
    fs = require("fs"),
    res = require('resolve'),
    _ = require('underscore');

function Plugin(path) {
    this.plugins = {};
    this.pathLocation = path;
};
Plugin.prototype.LoadPlugins = function() {
    let Directory = fs.readFileSync(this.pathLocation);
    Directory.forEach((fileName) => {
        this.pluginsList[fileName] = require(`${this.pathLocation}${fileName}`);
        this.Loaded(fileName);
    });
};
*/