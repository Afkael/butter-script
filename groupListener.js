const { logEvent } = require('./logEvent');

async function groupListener(client, message, supportAgents) {
  console.log('Procesando mensaje de grupo');

  if (message.body.includes('#close')) {
    logEvent(
      message.sender.name,
      message.from,
      'N/A', // Puedes reemplazar esto con la información del ticket si es necesario
      '#close',
      message.sender.name
    );

    setTimeout(async () => {
      await client.sendText(message.chatId, 'Hola grupo!');
    }, 120000); // 2 minutos
  }

  // Aquí puedes agregar más código para procesar otros eventos o mensajes en el grupo
}

module.exports = {
  groupListener,
};
