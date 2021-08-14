"use strict";

Object.defineProperty(exports, "__esModule", { value: true });

exports.BaseServiceWorker = void 0;

let 
    modman = require('../../util/man.Eris'),
    ipc = require('../util/IPC');

class BaseServiceWorker {
    constructor(setup) {
        this.serviceName = setup.serviceName;
        this.workerID = setup.workerID;
        this.ipc = new ipc.IPC();
        this.modman = new modman.ModuleManager(`${process.cwd()}/src/modules/`);
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