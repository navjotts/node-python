const spawn = require('child_process').spawn;
const path = require('path');
const zerorpc = require('zerorpc');
const Utils = require('./Utils.js');

const TIMEOUT = 60; // in seconds (adjust as per how long your server calls can take)
const IP = '127.0.0.1';
const PORT = '4242';

class PythonConnector {
    static server() {
        if (!PythonConnector.connected) {
            console.log('PythonConnector – making a new connection to the python layer');
            PythonConnector.zerorpcProcess = spawn('python3', ['-u', path.join(__dirname, 'PythonServer.py')]);
            PythonConnector.zerorpcProcess.stdout.on('data', function(data) {
                console.info('python:', data.toString());
            });
            PythonConnector.zerorpcProcess.stderr.on('data', function(data) {
                console.error('python:', data.toString());
            });
            PythonConnector.zerorpc = new zerorpc.Client({'timeout': TIMEOUT, 'heartbeatInterval': TIMEOUT*1000});
            PythonConnector.zerorpc.connect('tcp://' + IP + ':' + PORT);
            PythonConnector.connected = true;
        }
        return PythonConnector.zerorpc;
    }

    static async invoke(method, ...args) {
        try {
            const zerorpc = PythonConnector.server();
            return await Utils.promisify(zerorpc.invoke, zerorpc, method, ...args);
        }
        catch (e) {
            return Promise.reject(e)
        }
    }
}

module.exports = PythonConnector;
