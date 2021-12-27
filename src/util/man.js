"use strict"

let 
	fs = require("fs"),
	resolve = require('resolve'),
	_ = require("underscore");

function ModuleManager(path) {
	this.moduleslist = {};
	this.pathBFU = path
};
ModuleManager.prototype.LoadModules = function() {
	let self = this;
	var pluginsDir = fs.readdirSync(self.pathBFU);
    pluginsDir.forEach(function (file) {
        self.moduleslist[file] = require(self.pathBFU + file);
	});
};
ModuleManager.prototype.load = function(mod) {
	var mod = mod.replace(/\.js$/i, "");
	var mod = mod + ".js";
    if (fs.existsSync(this.pathBFU + mod)) {
        this.moduleslist[mod] = require(this.pathBFU + mod);
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
	if(this.moduleslist.hasOwnProperty(mod)) {
		delete this.moduleslist[mod];
		return true;
	}
	else {
		return false;
	}
};
ModuleManager.prototype.isLoaded = function(mod) {
	if(this.moduleslist.hasOwnProperty(mod)) {
		return true;
	}
	else {
		return false;
	}
};
ModuleManager.prototype.getModules = function() {
	return _.keys(this.moduleslist);
};
exports.ModuleManager = ModuleManager;