// mediaManager.js
const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');

class MediaManager {
    async downloadMedia(message) {
        try {
            const media = await message.downloadMedia();
            return media;
        } catch (error) {
            throw new Error('Error descargando media: ' + error.message);
        }
    }

    loadImageFromPath(path) {
        const file = fs.readFileSync(path);
        const mimeType = 'image/png';
        const media = new MessageMedia(mimeType, file.toString('base64'));
        return media;
    }
}

module.exports = MediaManager;