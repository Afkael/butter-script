// messageHandler.js
const fs = require("fs");
const path = require("path");
const ContactManager = require("./contactManager");
const GroupManager = require("./groupManager");
const MediaManager = require("./mediaManager");
const mediaManager = new MediaManager();
const ticketManager = require("./ticketManager");

let messageQueue = [];
let isProcessing = false;

const contactsPath = "./contacts.json";
const agentsPath = "./agents.json";

const loadAgents = () => {
  const agentsData = fs.readFileSync(agentsPath);
  return JSON.parse(agentsData);
};

const forwardMessageFromGroupToContact = async (
  message,
  client,
  groupManager
) => {
  try {
    if (message.fromMe || message.body.startsWith("@")) {
      return;
    }

    const groupId = message.from;
    const contactInfo = ContactManager.getContactInfoByGroupId(groupId);

    if (!contactInfo) {
      console.error(`No contact information found for group ${groupId}`);
      return;
    }

    if (message.body.startsWith("#")) {
      const parts = message.body.split(" ");
      const command = parts[0].slice(1);
      const commandValue = parts.slice(1).join(" ");
      const agentNumber = message.author.split("@")[0];

      if (
        ["take", "global", "resolved", "close", "id", "tag"].includes(command)
      ) {
        await groupManager.handleGroupCommand(
          groupId,
          command,
          commandValue,
          agentNumber,
          client
        );
        return;
      }
    }

    const originalContactId = contactInfo.id;

    try {
      if (message.hasMedia) {
        const media = await mediaManager.downloadMedia(message);
        await client.sendMessage(originalContactId, media, {
          caption: media.filename,
        });
      } else if (message.type === "chat") {
        await client.sendMessage(originalContactId, message.body);
      }
    } catch (error) {
      console.error("Error forwarding message from group to contact:", error);
    }
  } catch (error) {
    console.error("Error forwarding message from group to contact:", error);
  }
};

const processQueue = async () => {
  if (isProcessing || messageQueue.length === 0) {
    return;
  }

  isProcessing = true;
  const { message, client, groupManager } = messageQueue.shift();

  try {
    await forwardMessageToGroup(message, client, groupManager);
  } catch (error) {
    console.error("Error processing message:", error);
  } finally {
    isProcessing = false;
    processQueue();
  }
};

const enqueueMessage = (message, client, groupManager) => {
  messageQueue.push({ message, client, groupManager });
  processQueue();
};

const forwardMessageToGroup = async (message, client, groupManager) => {
  try {
    let contact = ContactManager.getContactInfo(message.from);
    console.log("Información del contacto obtenida");

    if (!contact) {
      console.log("Contacto no encontrado, creando nuevo contacto...");
      contact = {
        id: message.from,
        group: "",
        name: "",
        ibms: [],
      };
      ContactManager.saveContactInfo(contact);
      console.log("Nuevo contacto guardado:");
    }

    if (!contact.group) {
      console.log(
        "El contacto no tiene un grupo asignado. Creando ticket y grupo..."
      );
      const newTicket = ticketManager.createTicket(contact.id);
      console.log("Ticket creado:", newTicket);

      const agents = loadAgents();
      console.log("Agentes cargados");

      const agentNumbers = agents.map((agent) => agent.number);
      console.log("Números de agentes");

      const groupName = `${contact.name || "Unknown"} (${
        newTicket.ticketNumber
      })`;
      console.log("Nombre del grupo generado:", groupName);

      try {
        const groupCreationResponse = await client.createGroup(
          groupName,
          agentNumbers
        );
        contact.group = groupCreationResponse.gid._serialized;
        console.log("Grupo creado. ID del grupo");

        GroupManager.createGroupDataFile(contact.group, newTicket.ticketNumber);
        console.log("Archivo de datos del grupo creado");

        ContactManager.saveContactInfo(contact);
        console.log("Información del contacto actualizada con el grupo");

        console.log("Configurando imagen de perfil y descripción del grupo...");
        const profileImagePath = await mediaManager.loadImageFromPath(
          "./media/open.png"
        );
        console.log("Imagen de perfil obtenida");

        const chat = await client.getChatById(contact.group);
        console.log("Chat obtenido por ID");

        await chat.setPicture(profileImagePath);
        console.log("Imagen de perfil establecida");

        if (contact.ibms && contact.ibms.length > 0) {
          try {
            const groupDescription = contact.ibms.join("\n");
            await chat.setDescription(groupDescription);
            console.log("Descripción del grupo establecida");
          } catch (error) {
            console.error(
              "Error al establecer la descripción del grupo:",
              error
            );
          }
        }
      } catch (error) {
        console.error("Error al crear o configurar el grupo:", error);
      }
    } else {
      console.log(
        "El contacto ya tiene un grupo asignado. No se requiere la creación de un nuevo grupo."
      );
    }

    if (contact.group) {
      console.log("Reenviando mensaje al grupo");
      const chat = await client.getChatById(contact.group);
      console.log("Chat obtenido para reenvío");

      if (message.hasMedia) {
        console.log("El mensaje tiene multimedia. Descargando y enviando...");
        const media = await mediaManager.downloadMedia(message);
        console.log("Multimedia descargada:");

        await chat.sendMessage(media, { caption: media.filename });
        console.log("Mensaje multimedia enviado");
      } else {
        await chat.sendMessage(message.body);
        console.log("Mensaje de texto enviado");
      }
    } else {
      console.log("No se pudo enviar el mensaje. No hay grupo asignado.");
    }
  } catch (error) {
    console.error("Error forwarding message to group:", error);
  }
};

const initializeMessageHandler = (client) => {
  const groupManager = new GroupManager(client);

  client.on("message", async (message) => {
    try {
      if (message.from === "status@broadcast") {
        console.log("Ignoring message from status@broadcast...");
        return;
      }

      if (message.from.includes("@g.us")) {
        forwardMessageFromGroupToContact(message, client, groupManager);
        return;
      }

      if (message.type === "system") {
        console.log("System message, ignoring...");
        return;
      }

      if (message.fromMe) {
        console.log("Message sent by me, ignoring...");
        return;
      }

      console.log(
        `Handling message from an individual contact: ${message.from}`
      );

      enqueueMessage(message, client, groupManager);
    } catch (error) {
      console.error("Error handling incoming message:", error);
    }
  });
};

module.exports = {
  forwardMessageToGroup,
  initializeMessageHandler,
};