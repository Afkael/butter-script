const fs = require('fs');
const path = require('path');

function logEvent(...eventData) { // Utilizar el operador de propagación '...'
  const filePath = path.join(__dirname, 'eventos.txt');
  const timestamp = new Date().toISOString();
  const logLine = `${timestamp} | ${eventData.join(' | ')}\n`;

  fs.appendFile(filePath, logLine, (err) => {
    if (err) {
      console.error('Error al guardar el evento:', err);
    }
  });
}

module.exports = {
  logEvent,
};