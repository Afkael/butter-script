const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const shortid = require('shortid');

const client = new Client({
  authStrategy: new LocalAuth(),
});

const supportAgents = ['5493534253426@c.us']; // Agregar otros agentes

client.on('qr', qr => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();

function groupCreator(message) {  
  // Extraer el número de teléfono del mensaje
  const phoneRegex = /Teléfono:\s*([^\n\r]*)/;
  const phoneMatch = message.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[1] : message.body;

  // Extraer el ticket del mensaje
  const ticketRegex = /Ticket:\s*([^\n\r]*)/;
  const ticketMatch = message.match(ticketRegex);
  const ticket = ticketMatch ? ticketMatch[1] : '';

  // Extraer número del agente
  const agentNumber = message.id.remote;

  
  console.log(`Teléfono: ${phone}`);
  console.log(`Ticket: ${ticket}`);
  console.log(`Agente: ${agentNumber}`);
  
  // Crear el grupo con el remitente del mensaje y el número de teléfono extraído
  const participants = ['5493534253426@c.us', '5493535653695@c.us'];
  console.log(`Miembros: ${participants}`);

  client.groupMetadataCreate('VN-Tech ' + ticket, participants)
  .then(metadata => {
    console.log(`Grupo creado: ${metadata.subject}`);
    const groupId = metadata.id._serialized;
    // enviar mensaje al grupo recién creado
    client.sendMessage(groupId, '¡Bienvenidos al grupo!');
  })
  .catch(error => console.error(error));

}

const messageQueue = {};
const messageTimeouts = {};
const lastForwarded = {};

client.on('message', message => {
  console.log('Mensaje recibido:', message.body);
  console.log('Remitente del mensaje: ', message.from);
  const sender = message.from;
  const now = Date.now();

  if (supportAgents.includes(sender)) {
    groupCreator(message.body);
    console.log('Es un agente')
    return;
  }

  if (lastForwarded[sender] && now - lastForwarded[sender] < 3600000) {
    console.log(`No se ha reenviado mensaje a ${sender}, se ha reenviado un mensaje hace menos de una hora.`);
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
    client.sendMessage('5493534253426@c.us', `Nombre: ${message._data.notifyName}\nTeléfono: ${sender}\nTicket: ${ticket}\nMensajes:\n${messages}`);
    delete messageQueue[sender];

    // Registrar el mensaje reenviado
    lastForwarded[sender] = now;

    console.log(`Mensaje reenviado a ${sender} a las ${new Date().toLocaleString()}`);
  }, 60000); // 1 minute timeout
});