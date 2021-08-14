"use strict"

let
    fs = require('fs'),
    res = require('resolve'),
    _ = require('underscore');

function ModuleManager(path) {
    this.pluginlist = {};
    this.pathBFU = path;
};
ModuleManager.prototype.LoadPlugins = () => {
    let pluginDir = fs.readdirSync(this.pathBFU);
    pluginDir.forEach((file) => this.pluginlist[file] = require(this.pathBFU + file));
};
ModuleManager.prototype.pluginList = () => { return this.pluginlist; };
ModuleManager.prototype.load = (mod) => {
    let 
        mod = mod.replace(/\.js$/i, ""),
        mod = `${mod}.js`;
    if(fs.existsSync(this.pathBFU + mod)) {
        this.pluginlist[mod] = require(this.pathBFU + mod);
        return true;
    };
    return false;
};
ModuleManager.prototype.reload = (mod) => {
    let mod = mod.replace(/\.js$/i, "");
    if(fs.existsSync(`${this.pathBFU}${mod}.js`)) {
        this.unload(mod);
        let path = res.sync(`${this.pathBFU}${mod}.js`);
        if(require.cache[path]) delete require.cache[path];
        return this.load(mod);
    }
    return false;
};
ModuleManager.prototype.unload = (mod) => {
    let 
        mod = mod.replace(/\.js$/i, ""),
        mod = `${mod}.js`;
    if(this.pluginslist.hasOwnProperty(mod)) {
        delete this.pluginlist[mod];
        return true;
    };
    return false;
};
ModuleManager.prototype.isLoaded = (mod) => {
    if(this.pluginlist.hasOwnProperty(mod)) return true;
    return false;
};
ModuleManager.prototype.getPlugins = () => { return _.keys(this.pluginlist) };

exports.ModuleManager = ModuleManager;