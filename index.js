//importar librerias

const venom = require('venom-bot');
const shortid = require('shortid');
const fs = require('fs');


// Variables globales

const agenteSoporte = ['5493534253426@c.us', '5493492414226@c.us', '5493536579337@c.us'];
const casos = {};


// Funciones

  //Procesar mensajes de grupos
  
  function mensajeGrupal(message, client) {
    if (agenteSoporte.includes(message.author)) {
      if (message.body.includes('#close')) {
        const ticket = buscarTicket(message.from);
        console.log("cerrando caso");
        capturarRegistro(message.sender.pushname, message.author, ticket, '#close', message.from, new Date().toISOString());

        setTimeout(() => {
          client.sendText(message.from, 'https://forms.office.com/r/ycHk4FphuH').then(() => {
            console.log('Mensaje enviado con éxito');
          }).catch((error) => {
            console.error('Error al enviar el mensaje:', error);
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

      if (message.body.includes('#status')) {
        client.sendText(message.from, 'Estoy Bien, Gracias')
      }

    } else {
      console.log("mensaje de usuario");
    }
  }


  //Procesar mensajes directos

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
      console.log('El registro ha sido agregado al archivo');
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
      const origen = groupId.gid._serialized;
      const fecha = new Date().toISOString();
      client.sendText(origen, `Bienvenido, hemos creado éste grupo para resolver su caso.`);
      capturarRegistro(message.sender.pushname, userNumber, ticket, '#take', origen, fecha);
    }
  }


  //Enviar nuevo caso

  function enviarDatos(client, caso) {
    console.log(caso.nombre);
    const mensaje = `Nombre: ${caso.nombre}\nTeléfono: ${caso.telefono}\nTipo: #caso\nTicket: ${caso.ticket}`;
    console.log(mensaje);
    const nombreCompleto = caso.nombre;
    const nombreArray = nombreCompleto.split(" ");
    const nombreCorto = nombreArray[0];

    client.sendText('120363094061748798@g.us', mensaje);
    client.sendText(caso.telefono, `Hola ${nombreCorto}, gracias por contactarnos. En breve un agente se comunicará con usted.`);

  }


  // Crear una sesión

  function crearSesion( client, message) {
    const telefono = message.from;
    
    if (casos.hasOwnProperty(telefono)) {
      console.log("ignorado");
       } else { 
      console.log("creando caso");
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
    
    // Si no encontramos un ticket correspondiente, devolvemos null o una cadena vacía
    return null;
  }
  


//*****************//
// Iniciar sesión  //
//*****************//

setInterval(eliminarCasosAntiguos, 60 * 1000); // se ejecuta cada 60 segundos

venom.create().then((client) => {
    client.onMessage((message) => {
      if (message.chatId.endsWith('g.us')) {
        mensajeGrupal(message, client);
      } else {
        mensajeDirecto(message, client);
      }
    });
  });


  // Funciones de prueba

  function eliminarCasosAntiguos() {
    const tiempoActual = Date.now();
    const tiempoLimite = 60 * 60 * 1000; // 60 minutos en milisegundos
    for (let i = 0; i < casos.length; i++) {
      const tiempoDeCreacion = casos[i].tiempoDeCreacion;
      if (tiempoActual - tiempoDeCreacion > tiempoLimite) {
        casos.splice(i, 1);
        i--;
      }
    }
  }