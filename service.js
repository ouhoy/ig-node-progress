"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Service = require('node-windows').Service;
const path = require("path");
const svc = new Service({
    name: 'Update IG Bio',
    description: 'Node.js service that updates my IG bio everyday, posting a progress bar',
    script: path.join(__dirname, "server.js")
});
svc.on('install', function () {
    svc.start();
});
svc.install();
//# sourceMappingURL=service.js.map