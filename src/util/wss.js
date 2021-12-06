"use strict"

let 
    express = require('express'),
    cors = require('cors'),
    conf = require('../conf');

module.exports = (app) => {
    let http = express();
    http.use(cors());
    http.get("/", (req, res) => res.json({ status: "Online", time: new Date() / 1000 }));
    http.listen(conf.port, () => console.log(`[${app.func.timestamp(new Date())}] WSS:`, `Live ${conf.port}`));
};
