"use strict"

let
    fs = require('fs'),
    res = require('resolve'),
    _ = require('underscore');

function ModuleManager(path) {
    this.pluginlist = {};
    this.pathBFU = path;
};
ModuleManager.prototype.LoadPlugins = function() {
    console.log(this.pathBFU);
    let pluginDir = fs.readdirSync(this.pathBFU);
    pluginDir.forEach((file) => this.pluginlist[file] = require(this.pathBFU + file));
};
ModuleManager.prototype.pluginList = function() { return this.pluginlist; };
ModuleManager.prototype.load = function(mod) {
    let modx = mod.replace(/\.js$/i, "");
    if(fs.existsSync(this.pathBFU + modx + ".js")) {
        this.pluginlist[modx] = require(this.pathBFU + modx + ".js");
        return true;
    };
    return false;
};
ModuleManager.prototype.reload = function(mod) {
    let modx = mod.replace(/\.js$/i, "");
    if(fs.existsSync(this.pathBFU + modx + ".js")) {
        this.unload(modx);
        let path = res.sync(this.pathBFU + modx + ".js");
        if(require.cache[path]) delete require.cache[path];
        return this.load(modx);
    }
    return false;
};
ModuleManager.prototype.unload = function(mod) {
    let modx = mod.replace(/\.js$/i, "");
    if(this.pluginslist.hasOwnProperty(modx)) {
        delete this.pluginlist[modx];
        return true;
    };
    return false;
};
ModuleManager.prototype.isLoaded = function(mod) {
    if(this.pluginlist.hasOwnProperty(mod)) return true;
    return false;
};
ModuleManager.prototype.getPlugins = function() { return _.keys(this.pluginlist) };

exports.ModuleManager = ModuleManager;