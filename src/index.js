var Frida = require('./frida');
var Mitm = require('./mitm');

(async () => {
    // MITM Server
    console.log(`#######################\n###                 ###\n###   Mitm Server   ###\n###                 ###\n#######################\n`);

    // Frida Part
    var frida = new Frida();
    await frida.start();
    if (!frida.started) process.exit();

    // Mitm Part
    var mitm = new Mitm();
    await mitm.start();
})();
