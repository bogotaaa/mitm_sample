const moment = require('moment');
const net = require('net');

const dofus = {
    authIp: '34.252.21.81',
    gameIp: '',
    port: 5555,
};

class Mitm {

    constructor() {
        this.socketServer = null;
        this.socketClient = null;
    }

    start() {
        this.socketServer = new net.Server().listen(dofus.port);
        console.log(`[${moment().format('HH:mm:ss')}] Server is listening...`);

        const self = this;
        this.socketServer.on('connection', function (socket) {
            console.log(`[${moment().format('HH:mm:ss')}] Nouvelle connexion...`);
            self.connectAuth(socket);
        });
    }

    connectAuth(socket) {
        this.socketClient = new net.Socket().connect({host: dofus.authIp, port: dofus.port});

        this.socketClient.on('connect', function () {
            console.log(`[${moment().format('HH:mm:ss')}] Connecté au serveur d'authentification`);
        });
        this.socketClient.on('data', async function (data) {
            console.log(`[${moment().format('HH:mm:ss')}] RCV`);
            console.log(data);
            socket.write(data);
        });
        this.socketClient.on('close', function () {
            console.log(`[${moment().format('HH:mm:ss')}] Connexion au serveur d'authentification fermé`);
        });
        this.socketClient.on('error', function (err) {
            console.log(`[${moment().format('HH:mm:ss')}] erreur avec le serveur d'authentification`);
            console.log(err);
        });
    }
}

module.exports = Mitm;