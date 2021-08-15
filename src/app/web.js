"use strict"

let 
    // Packages
    express = require('express'),
    ejs = require('ejs'),
    bodyParser = require('body-parser'),
    path = require('path'),
    morgan = require('morgan'),

    // Local
    { BaseServiceWorker } = require('../shardManager'),
    conf = require('../conf'),
    dir = path.resolve('./src/web'),
    site = path.resolve(`${dir}/site`);

module.exports = class ServiceWorker extends BaseServiceWorker {
    constructor(setup) {
        super(setup);

        this.w = express();
        this.w.set('trust proxy', 5);
        this.w.use('/_gb', express.static(path.resolve(`${dir}/_gb`), { maxAge: '10d' }));
        this.w.use(morgan("combined"));
        this.w.engine('html', ejs);
        this.w.set('view engine', 'html');
        this.w.use(bodyParser.json());
        this.w.use(bodyParser.urlencoded({ extended: true }));


        this.buildPage("/", "Home", "index");
        this.buildPage("/cmds", "Commands", "cmds");
        //this.buildPage("/team", "Team", "team");
        this.buildPage("/privacy", "Privacy Policy", "privacy");
        this.redirectPage("/team", "/");
        this.redirectPage('/playing', conf.w.p.gr);
        this.redirectPage("/status", conf.w.p.n);
        this.redirectPage("/support", conf.w.p.s);
        this.redirectPage("/inv/gb", conf.w.p.i);
        this.redirectPage("/inv/ex", conf.w.p.ei);

        this.w.listen(conf.w.port, () => this.serviceReady());

    }
    async buildPage(url, title, file) {
        this.w.get(url, async(req, res) => {
            res.render(path.resolve(`${site}/${file}.ejs`), { title });
        });
    }
    async redirectPage(url, redirect) {
        this.w.get(url, async(req, res) => {
            res.redirect(redirect);
        });
    }
    shutdown(done) {
        done();
    }
}