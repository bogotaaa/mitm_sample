(async () => {
    // MITM Server
    console.log(`#######################\n###                 ###\n###   Mitm Server   ###\n###                 ###\n#######################\n`);

    // Frida Part
    const fridaStarted = await require('./frida').start();
    if (!fridaStarted) process.exit();

    // Mitm Part
    require('./mitm').start();
})();
