const venom = require('venom-bot');
const qrcode = require('qrcode-terminal');
const shortid = require('shortid');

const supportAgents = ['5493534253426@c.us']; // Agregar otros agentes
const messageQueue = {};
const messageTimeouts = {};
const lastForwarded = {}; // Objeto para registrar los mensajes reenviados


venom.create().then((client) => {

  client.onStateChange((state) => {
    console.log('State changed:', state);
    if (state.qrCode) {
      qrcode.generate(state.qrCode, { small: true });
    }
  });

  client.onMessage(async (message) => {
    const sender = message.from;
    const now = Date.now();

    //Si el mensaje proviene de un agente, crear un grupo
    if (supportAgents.includes(message.from)) {
      groupCreator(client, message.body);
      return;
    }

    if (lastForwarded[sender] && now - lastForwarded[sender] < 3600000) {
      ;
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
      delete messageQueue[sender];

      // Registrar el mensaje reenviado
      lastForwarded[sender] = now;

      console.log(`Mensaje reenviado a ${sender} a las ${new Date().toLocaleString()}`);
    }, 60000); // 1 minute timeout
  });

});

function groupCreator(client, message) {  
  // Extraer el número de teléfono del mensaje
  const phoneRegex = /Teléfono:\s*([^\n\r]*)/;
  const phoneMatch = message.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[1] : message.body;

  // Extraer el ticket del mensaje
  const ticketRegex = /Ticket:\s*([^\n\r]*)/;
  const ticketMatch = message.match(ticketRegex);
  const ticket = ticketMatch ? ticketMatch[1] : '';

  // Extraer número del agente
  const agentNumber = message.from;
  
  // Crear el grupo con el remitente del mensaje y el número de teléfono extraído
  const participants = ['5493534253426@c.us', phone];

  client.createGroup(`VN-Tech ${ticket}`, participants)

  .catch(error => console.error(error));
}