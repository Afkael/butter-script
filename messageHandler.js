const shortid = require('shortid');
const { groupCreator } = require('./groupCreator');
const { groupListener } = require('./groupListener');
const { logEvent } = require('./logEvent');
const fs = require('fs'); // Importa el módulo fs

const messageQueue = {};
const messageTimeouts = {};
const lastForwarded = {}; // Objeto para registrar los mensajes reenviados

async function handleMessage(client, message, supportAgents) {
  const sender = message.from;
  const now = Date.now();

  // Verificar si el mensaje proviene de un grupo usando el ID del chat
  if (message.chatId.endsWith('@g.us')) {
    await groupListener(client, message, supportAgents);
    return;
  }

  // Si el mensaje proviene de un agente, crear un grupo
  if (supportAgents.includes(message.from)) {
    groupCreator(client, message.body, message.from);
    return;
  }

  // Si no viene de grupo y no es un mensaje de un agente, guardar y reenviar
  if (lastForwarded[sender] && now - lastForwarded[sender] < 3600000) {
    return;
  }

  if (messageQueue[sender]) {
    clearTimeout(messageTimeouts[sender]);
    messageQueue[sender].push(message.body);
  } else {
    messageQueue[sender] = [message.body];
  }

  messageTimeouts[sender] = setTimeout(() => {
    const ticket = shortid.generate();
    const messages = messageQueue[sender].join('\n');
    client.sendText('120363094061748798@g.us', `Nombre: ${message.sender.name}\nTeléfono: ${sender}\nTicket: ${ticket}\nMensajes:\n${messages}`);

    logEvent(message.sender.name, sender, ticket, '#open', message.sender.name);
    delete messageQueue[sender];

    lastForwarded[sender] = now;

    console.log(`Mensaje reenviado a ${sender} a las ${new Date().toLocaleString()}`);
  }, 60000); // 1 minute timeout
}

module.exports = {
  handleMessage,
};
