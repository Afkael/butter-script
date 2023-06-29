// Importar librerias
const venom = require('venom-bot');
const shortid = require('shortid');
const fs = require('fs');
const { Console } = require('console');

// Variables globales
const agenteSoporte = ['5493534253426@c.us', '5493492414226@c.us', '5493536579337@c.us', '5493534797239@c.us'];
const casos = {};

// Funciones

// Procesar mensajes de grupos
function mensajeGrupal(message, client) {
  const ticket = buscarTicket(message.from);
  const numero = buscarOrigen(ticket);

  if (agenteSoporte.includes(message.author)) {
    if (message.body.includes('#close')) {
      capturarRegistro(message.sender.pushname, message.author, ticket, '#close', message.from, new Date().toISOString());
      eliminarCasosAntiguos(numero);

      setTimeout(() => {
        client.sendText(message.from, 'El agente ha marcado tu caso como "resuelto" y ya no se dará seguimiento a los mensajes recibidos dentro de este grupo. Para crear un nuevo caso, puedes solicitarlo escribiendo a nuestro número de soporte.\nTe invitamos a responder nuestra encuesta de satisfacción a través de este enlace: https://forms.office.com/r/ycHk4FphuH\nTu opinión nos ayuda a mejorar. ¡Gracias!').then(() => {
        }).catch((error) => {
        });
      }, 30000); // Establecer un retraso de 30 segundos en milisegundos
    }

    if (message.body.includes('#monitoring')) {
      capturarRegistro(message.sender.pushname, message.author, ticket, '#monitoring', message.from, new Date().toISOString());
    }

    if (message.body.includes('#sorting')) {
      capturarRegistro(message.sender.pushname, message.author, ticket, '#sorting', message.from, new Date().toISOString());
    }

    if (message.body.includes('#milking')) {
      capturarRegistro(message.sender.pushname, message.author, ticket, '#milking', message.from, new Date().toISOString());
    }

    if (message.body.includes('#warranty')) {
      capturarRegistro(message.sender.pushname, message.author, ticket, '#warranty', message.from, new Date().toISOString());
    }

    if (message.body.includes('#blank')) {
      crearSesionAgente(client, message);
    }

    if (message.body.includes('#status')) {
      client.sendText(message.from, 'Estoy Bien, Gracias');
    }

    if (message.body.includes('#clean')) {
      const cleanCommand = message.body.split(' ');
      if (cleanCommand.length > 1) {
        const numberToRemove = cleanCommand[1];
        eliminarCasosAntiguos(numberToRemove);
      } else {
        console.log('El comando #clean requiere un número de teléfono como argumento');
      }
    }

    if (message.body.includes('#pending')) {
      const filteredCases = obtenerCasosFiltrados();
      console.log(filteredCases);
      filteredCases.forEach(caso => {
        enviarDatosAgente(client, caso);
      });
    }
  } else {
    console.log("mensaje de usuario");
  }
}

// Procesar mensajes directos
function mensajeDirecto(message, client) {
  if (agenteSoporte.includes(message.from)) {
    crearCaso(message, client);
  } else {
    const remitente = message.from;
    crearSesion(client, message);
  }
}

// Capturar registro
function capturarRegistro(nombre, telefono, ticket, estado, origen, fecha) {
  const registro = `${fecha},${nombre},${telefono},${ticket},${estado},${origen}\n`;
  fs.appendFile('Registros.txt', registro, (err) => {  
    if (err) throw err;
  });
}

// Crear un grupo
async function crearCaso(message, client) {
  if (message.isForwarded && message.body.includes('#caso')) {
    const ticket = message.body.match(/Ticket: (.*)/)[1];
    const groupName = `VN-Tech ${ticket}`;
    const agentNumber = message.from;
    const userNumber = message.body.match(/Teléfono: (.*)/)[1];
    const groupParticipants = [agentNumber, userNumber];
    const groupId = await client.createGroup(groupName, groupParticipants);
    Console.log(groupId);
    const origen = groupId.gid._serialized;
    const fecha = new Date().toISOString();
    client.sendText(origen, `Bienvenido, hemos creado este grupo para resolver su caso.`);
    capturarRegistro(message.sender.pushname, userNumber, ticket, '#take', origen, fecha);
  }
}

// Enviar nuevo caso
function enviarDatos(client, caso) {
  const mensaje = `Nombre: ${caso.nombre}\nTeléfono: ${caso.telefono}\nTipo: #caso\nTicket: ${caso.ticket}`;
  const nombreCompleto = caso.nombre;
  const nombreArray = nombreCompleto.split(" ");
  const nombreCorto = nombreArray[0];
  client.sendText('120363094061748798@g.us', mensaje);
  client.sendText(caso.telefono, `Hola ${nombreCorto}, gracias por contactarnos. En breve un agente se comunicará con usted.`);
}

function enviarDatosAgente(client, caso) {
  const mensaje = `Nombre: ${caso.nombre}\nTeléfono: ${caso.telefono}\nTipo: #caso\nTicket: ${caso.ticket}`;
  client.sendText('120363094061748798@g.us', mensaje);
}

// Crear una sesión
function crearSesion(client, message) {
  const telefono = message.from;

  if (!casos.hasOwnProperty(telefono)) {
    const caso = {
      fecha: new Date().toISOString(),
      nombre: message.sender.pushname,
      telefono: telefono,
      ticket: shortid.generate(),
      mensajes: [message.body],
    };
    casos[telefono] = caso;
    enviarDatos(client, caso);
    capturarRegistro(caso.nombre, caso.telefono, caso.ticket, '#open', caso.telefono, caso.fecha);
  }
}

function crearSesionAgente(client, message) {
  const telefono = message.author;

  if (!casos.hasOwnProperty(telefono)) {
    const caso = {
      fecha: new Date().toISOString(),
      nombre: message.sender.pushname,
      telefono: telefono,
      ticket: shortid.generate(),
      mensajes: [message.body],
    };
    casos[telefono] = caso;
    enviarDatosAgente(client, caso);
    capturarRegistro(caso.nombre, caso.telefono, caso.ticket, '#open', caso.telefono, caso.fecha);
  }
}

// Buscar ticket
function buscarTicket(numeroOrigen) {
  const registros = fs.readFileSync('Registros.txt', 'utf-8');
  const lineas = registros.split('\n');

  // Recorremos todas las líneas en el archivo
  for (const linea of lineas) {
    const campos = linea.split(',');
    const fecha = campos[0];
    const nombre = campos[1];
    const telefono = campos[2];
    const ticket = campos[3];
    const estado = campos[4];
    const origen = campos[5];

    // Si el número de origen coincide con el origen en la línea, devolvemos el ticket
    if (origen === numeroOrigen) {
      return ticket;
    }
  }

  // Si no se encuentra el ticket, devolvemos un mensaje de error
  return 'Ticket no encontrado';
}

// Buscar origen
function buscarOrigen(ticket) {
  const registros = fs.readFileSync('Registros.txt', 'utf-8');
  const lineas = registros.split('\n');

  // Recorremos todas las líneas en el archivo
  for (const linea of lineas) {
    const campos = linea.split(',');
    const fecha = campos[0];
    const nombre = campos[1];
    const telefono = campos[2];
    const ticketActual = campos[3];
    const estado = campos[4];
    const origen = campos[5];

    // Si el ticket coincide con el ticket actual en la línea, devolvemos el número de origen
    if (ticketActual === ticket) {
      return origen;
    }
  }

  // Si no se encuentra el origen, devolvemos un mensaje de error
  return 'Origen no encontrado';
}

// Eliminar casos antiguos
function eliminarCasosAntiguos(numero) {
  const keysToDelete = Object.keys(casos).filter(key => casos[key].telefono === numero);

  keysToDelete.forEach(key => {
    delete casos[key];
  });
}

// Obtener casos filtrados
function obtenerCasosFiltrados() {
  const registros = fs.readFileSync('Registros.txt', 'utf-8');
  const lineas = registros.split('\n');

  // Crear un mapa de identificadores de casos y sus estados
  const identificadores = new Map();
  for (const linea of lineas) {
    const campos = linea.split(',');
    const identificador = campos[3];
    const estado = campos[4];

    if (!identificadores.has(identificador)) {
      identificadores.set(identificador, estado);
    } else {
      const estadoActual = identificadores.get(identificador);
      if (estado === '#take' || estado === '#close') {
        identificadores.set(identificador, estado);
      } else if (estadoActual !== '#take' && estadoActual !== '#close') {
        identificadores.set(identificador, estado);
      }
    }
  }

  // Filtrar los casos que cumplen las condiciones
  const casosFiltrados = lineas
    .map(linea => {
      const campos = linea.split(',');
      const identificador = campos[3];
      const estado = campos[4];
      if (estado === '#open' && identificadores.get(identificador) === '#open') {
        return {
          fecha: campos[0],
          nombre: campos[1],
          telefono: campos[2],
          ticket: identificador,
          estado,
          origen: campos[5]
        };
      }
    })
    .filter(caso => caso);

  return casosFiltrados;
}

// Configurar el bot de WhatsApp
venom
  .create({ session: 'droplet'})
  .then((client) => {
    client.onMessage(async (message) => {
      if (message.isGroupMsg) {
        mensajeGrupal(message, client);
      } else {
        mensajeDirecto(message, client);
      }
    });
  })
  .catch((error) => {
    console.log('Error al iniciar el bot de WhatsApp:', error);
  });