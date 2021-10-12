
/*
    #####################################################################
    # File: wss.js
    # Title: A Radio Music Bot
    # Author: SixAiy <me@sixaiy.com>
    # Version: 5.2
    # Description:
    #  A Discord bot for playing the Gensokyo Radio.
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
    express = require('express'),
    cors = require('cors'),
    port = 4022;

module.exports = (app) => {
    let http = express();
    http.use(cors());
    http.get("/", (req, res) => res.send("live"));
    http.listen(port, () => console.log(`[${app.func.timestamp(new Date())}] WSS:`, `Live ${port}`));
};
