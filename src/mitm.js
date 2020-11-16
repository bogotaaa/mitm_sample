const moment = require('moment');
const net = require('net');
const Parser = require('./utils/parser');

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

            socket.on('data', function (data) {
                console.log(`[${moment().format('HH:mm:ss')}] CLIENT: PacketId ${Parser.getPacketId(data)}`);
                socket['client'].write(data);
            });

            socket.on('close', function () {
                console.log('close Connection');
            });
        
            socket.on('error', function (error) {
                console.log('error:', error)
            });
        });
    }

    connectAuth(socket) {
        socket['client'] = new net.Socket().connect({host: dofus.authIp, port: dofus.port});

        socket['client'].on('connect', function () {
            console.log(`[${moment().format('HH:mm:ss')}] Connecté au serveur d'authentification`);
        });
        socket['client'].on('data', async function (data) {
            console.log(`[${moment().format('HH:mm:ss')}] SERVER: PacketId ${Parser.getPacketId(data)}`);
            socket.write(data);
        });
        socket['client'].on('close', function () {
            console.log(`[${moment().format('HH:mm:ss')}] Connexion au serveur d'authentification fermé`);
        });
        socket['client'].on('error', function (err) {
            console.log(`[${moment().format('HH:mm:ss')}] erreur avec le serveur d'authentification`);
            console.log(err);
        });
    }
}

module.exports = Mitm;