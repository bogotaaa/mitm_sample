const moment = require('moment');
const find = require('find-process');
const exec = require('child_process').exec;

class Frida {
    
    constructor() {
        this.started = false;
    }

    async start() {
        return new Promise(async resolve => {
            console.log(`[${moment().format('HH:mm:ss')}] Checking Dofus...`);
            let d2Process = await new Promise(resolve => find('name', 'Dofus', true).then(l => resolve(l.length ? l[0] : null)));
            if (!d2Process) {
                console.log(`[${moment().format('HH:mm:ss')}] Dofus is not running :/\n`);
                this.started = false;
                resolve();
                return;
            }
            console.log(`[${moment().format('HH:mm:ss')}] Dofus is running :)`);
            console.log(`[${moment().format('HH:mm:ss')}] Starting Injection...`);
            await exec('frida -n dofus.exe -l src/frida_script.js', (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log(`[${moment().format('HH:mm:ss')}] Ready...`);
            this.started = true;
            resolve();
        })
    }
}

module.exports = Frida;