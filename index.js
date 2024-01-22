// index.js
const qrcode = require('qrcode-terminal');
const { forwardMessageToGroup, initializeMessageHandler } = require('./messageHandler');
const { Client, LocalAuth } = require('whatsapp-web.js');
const fs = require('fs');

let config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
let chromePath = config.chromeExecutablePath;


const client = new Client({
    authStrategy: new LocalAuth({ clientId: "dropplet" }),
    puppeteer: {
        executablePath: chromePath,
    }
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
    initializeMessageHandler(client);
});

client.initialize();