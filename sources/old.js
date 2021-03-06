const net = require('net');

const constants = {
    logs: true,
    dofusAuthIp: '34.252.21.81',
    dofusPort: 5555,
    auth: false
};

const log = function (log) {
    if (constants.logs) {
        console.log(log);
    }
};

const domain = '.ankama-games.com';
const gameServers = ["agride", "brumen", "furye", "ilyzaelle", "jahash", "julith", "merkator", "meriana", "nidas", "pandore", "ush", "ombre"];
for (let i in gameServers) {
    gameServers[i] += domain;
}

const socketerver = new net.Server().listen(constants.dofusPort);

log("start server on port " + constants.dofusPort);

server.on('connection', function (socket) {

    console.log('new Connection');

    connectToDofus(
        socket,
        constants.auth ? constants.ipGameServer : constants.dofusAuthIp,
        constants.dofusPort
    );

    socket.on('data', function (data) {
        console.log(`Received ${data}`);
        socket['client'].write(data);
    });

    socket.on('close', function () {
        console.log('close Connection');
    });

    socket.on('error', function (error) {
        console.log('error:', error)
    });

});

function connectToDofus(socket, ip, port) {

    const serverType = constants.auth ? 'game' : 'authentication';

    socket['client'] = new net.Socket().connect({host: ip, port: port});

    if (serverType === 'game') {
        constants.auth = false;
    }

    socket['client'].on('connect', function () {
        console.log('connected with dofus ' + serverType + ' server');
    });

    socket['client'].on('data', async function (data) {
        if (ip === constants.dofusAuthIp) {
            const s = data.toString();
            if (s.includes(domain)) {
                for (let i in gameServers) {
                    if (s.includes(gameServers[i])) {
                        constants.ipGameServer = gameServers[i];
                        constants.auth = true;
                        socket.write(data);
                        socket.destroy();
                        return;
                    }
                }
            }
        }
        socket.write(data);
    });

    socket['client'].on('close', function () {
        console.log('close connection with dofus ' + serverType + ' server');
    });

    socket['client'].on('error', function (err) {
        console.log('error connection with dofus ' + serverType + ' server');
        console.log(err);
    });
}
