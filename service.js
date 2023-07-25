const Service = require('node-windows').Service;
const svc = new Service({
    name: 'Update IG Bio',
    description: 'Node.js service that updates my IG bio everyday, posting a progress bar',
    script: 'C:\\Users\\abdel\\Desktop\\DEV\\ig-node-progress\\server.js'
});
svc.on('install', function () {
    svc.start();
});
svc.install();
//# sourceMappingURL=service.js.map