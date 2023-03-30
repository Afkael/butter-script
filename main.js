const venom = require('venom-bot');
const { supportAgents } = require('./constants');
const { handleQrCode } = require('./qrCodeHandler');
const { handleMessage } = require('./messageHandler');
const { groupCreator } = require('./groupCreator');

venom.create().then((client) => {
  client.onStateChange((state) => {
    console.log('State changed:', state);
    handleQrCode(state);
  });

  client.onMessage(async (message) => {
    await handleMessage(client, message, supportAgents);
  });
});
