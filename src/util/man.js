/*
#####################################################################
# File: man.js
# Title: A simple file manager
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