"use strict"

Object.defineProperty(exports, "__esModule", { value: true });

exports.BaseClusterWorker = void 0;

let 
    modman = require('../../util/man'),
    ipc = require('../util/IPC');

class BaseClusterWorker {
    constructor(setup) {
        this.bot = setup.bot;
        this.clusterID = setup.clusterID;
        this.workerID = setup.workerID;
        this.ipc = new ipc.IPC();
        this.modman = new modman.ModuleManager(`${process.cwd()}/src/modules/`);
    }
}
exports.BaseClusterWorker = BaseClusterWorker;