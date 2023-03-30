const { logEvent } = require('./logEvent');

function groupCreator(client, message, agentNumber) {
  
    // Extraer el número de teléfono del mensaje
    const phoneRegex = /Teléfono:\s*([^\n\r]*)/;
    const phoneMatch = message.match(phoneRegex);
    const phone = phoneMatch ? phoneMatch[1] : message.body;

    // Extraer el nombre del mensaje
    const nameRegex = /Nombre:\s*([^\n\r]*)/;
    const nameMatch = message.match(nameRegex);
    const name = nameMatch ? nameMatch[1] : '';

    // Extraer el ticket del mensaje
    const ticketRegex = /Ticket:\s*([^\n\r]*)/;
    const ticketMatch = message.match(ticketRegex);
    const ticket = ticketMatch ? ticketMatch[1] : '';

    // Crear el grupo con el remitente del mensaje y el número de teléfono extraído
    const participants = ['5493534253426@c.us', phone];

    client.createGroup(`VN-Tech ${ticket}`, participants)
    .then(() => {
        // Llamar a logEvent para registrar el evento de creación de grupo
        console.log('Valores antes de llamar a logEvent:', name, phone, ticket, '#take', agentNumber); // Agregar esta línea
        logEvent(name, phone, ticket, '#take', agentNumber);
    })
    .catch(error => console.error(error));
}

module.exports = {
  groupCreator,
};