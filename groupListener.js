async function groupListener(client, message, supportAgents) { // Añade supportAgents como argumento
    console.log('Procesando mensaje de grupo');
  
    try {
      // Obtener la lista de miembros del grupo usando el ID del grupo
      const groupMembers = await client.getGroupMembers(message.chatId);
  
      // Extraer solo los valores _serialized de cada miembro del grupo
      const serializedMembers = groupMembers.map(member => member.id._serialized);
  
      // Crear un nuevo array que contenga solo los miembros que no están en supportAgents
      const userInvited = serializedMembers.filter(member => !supportAgents.includes(member));
  
      // Imprimir la lista de miembros del grupo en la consola
      console.log('Miembros del grupo:', serializedMembers);
      console.log('Usuarios invitados:', userInvited);
  
    } catch (error) {
      console.error('Error al obtener información del grupo:', error);
    }
  
    // Aquí irán las tareas relacionadas con los mensajes de grupo
  }
  
  module.exports = {
    groupListener,
  };  