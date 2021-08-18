/*
#####################################################################
# File: app.js
# Title: A Radio Music Bot
# Author: SixAiy <me@sixaiy.com>
# Version: 0.5a
# Description:
#  A GensokyoRadio.net Discord bot for playing the radio on discord.
#####################################################################

#####################################################################
# License
#####################################################################
# Copyright 2021 Contributing Authors
# This program is distributed under the terms of the GNU GPL.
######################################################################
*/

"use strict"

let     
    { isMaster } = require('cluster'),
    { Fleet } = require('./src/shardManager'),
    path = require("path"),
    { clear } = require("console"),
    conf = require('./src/conf');

const fleetSettings = {
    name: "GensokyoBot", 
    path: path.join(__dirname, "./src/app/discord.js"), 
    token: conf.discord.token, 
    fetchTimeout: 300000,
    services: [{ name: "Web", path: path.join(__dirname, "./src/app/web.js") }]
};
const Master = new Fleet(fleetSettings);

if(isMaster) {
    clear();
    Master.on("log", (m) => console.log(m));
    Master.on("debug", (m) => console.log(m));
    Master.on("warn", (m) => console.log(m));
    Master.on("error", (m) => console.log(m));
}