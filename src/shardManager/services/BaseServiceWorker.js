"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.BaseServiceWorker = void 0;

let 
    modman = require('../../util/mod.Eris'),
    ipc = require('../util/IPC');

class BaseServiceWorker {
    constructor(setup) {
        this.serviceName = setup.serviceName;
        this.workerID = setup.workerID;
        this.ipc = new ipc.IPC();
        this.modman = new modman.M(`${process.cwd()}/src/plugins/`);
        this.readyPromise = new Promise((resolve, reject) => {
            this.serviceReady = () => {
                resolve(undefined);
            };
            this.serviceStartingError = (err) => {
                reject(err);
            };
        });
    }
}
exports.BaseServiceWorker = BaseServiceWorker;