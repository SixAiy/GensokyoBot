"use strict"

let 
    // Configuration Information
    conf = require('./src/conf'),
    
    // Fleet Requirements
    { isMaster } = require('cluster'),
    { Fleet } = require('./src/util/shardManager'),

    // General Requirements
    path = require("path"),
    { clear } = require("console"),
    
    // Final Stage
    fleetSettings = { 
        name: "Gensokyobot", path: path.join(__dirname, "./src/dis.js"), token: conf.api.dis//, 
        //services: [
            //{ name: "GWeb", path: path.join(__dirname, "./src/gw.js") },
            //{ name: "SWeb", path: path.join(__dirname, "./src/sc.js") },
            //{ name: "Telegram", path: path.join(__dirname, "./src/tel.js") },
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