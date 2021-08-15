"use strict"

let     
    // Fleet Requirements
    { isMaster } = require('cluster'),
    { Fleet } = require('./src/shardManager'),

    // General Requirements
    path = require("path"),
    { clear } = require("console"),
    
    // Configuration Information
    conf = require('./src/conf'),
    
    // Final Stage
    fleetSettings = { 
        name: "GensokyoBot", path: path.join(__dirname, "./src/bot/dis.js"), token: conf.api.a.dis //, 
        //services: [
            // Other Bot Services
            //{ name: "telegram", path: path.join(__dirname, "./src/bot/tel.js") },
            //{ name: "twitch", path: path.join(__dirname, "./src/bot/ttv.js") },
            //{ name: "irc", path: path.join(__dirname, "./src/bot/irc.js") },

            // Websites
            //{ name: "gensokyobot.com", path: path.join(__dirname, "./src/web/index.js") },
        //]
    },
    Master = new Fleet(fleetSettings);

if(isMaster) {
    clear();
    Master.on("log", (m) => console.log(m));
    Master.on("debug", (m) => console.log(m));
    Master.on("warn", (m) => console.log(m));
    Master.on("error", (m) => console.log(m));
}