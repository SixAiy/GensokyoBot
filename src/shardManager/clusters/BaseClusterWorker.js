"use strict"

Object.defineProperty(exports, "__esModule", { value: true });

exports.BaseClusterWorker = void 0;

let 
    modman = require('../../util/mod.Eris'),
    ipc = require('../util/IPC');

class BaseClusterWorker {
    constructor(setup) {
        this.bot = setup.bot;
        this.clusterID = setup.clusterID;
        this.workerID = setup.workerID;
        this.ipc = new ipc.IPC();
        this.modman = new modman.M(`${process.cwd()}/src/plugins/`);
    }
}
exports.BaseClusterWorker = BaseClusterWorker;