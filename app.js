"use strict"

let     
    { isMaster } = require('cluster'),
    { Fleet } = require('./src/shardManager'),
    path = require("path"),
    { clear } = require("console"),
    conf = require('./src/conf');

const fleetSettings = { 
    name: "GensokyoBot", path: path.join(__dirname, "./src/app/discord.js"), token: conf.discord.token, 
    //services: [
        //{ name: "telegram", path: path.join(__dirname, "./src/app/telegram.js") },
        //{ name: "gensokyobot.com", path: path.join(__dirname, "./src/app/web.js") },
    //]
};
const Master = new Fleet(fleetSettings);

if(isMaster) {
    clear();
    Master.on("log", (m) => console.log(m));
    Master.on("debug", (m) => console.log(m));
    Master.on("warn", (m) => console.log(m));
    Master.on("error", (m) => console.log(m));
}