// groupManager.js
const fs = require('fs');
const path = require('path');
const ContactManager = require('./contactManager');
const MediaManager = require('./mediaManager');

class GroupManager {
    constructor(client) {
        this.client = client;
        this.mediaManager = new MediaManager();
    }

    static createGroupDataFile(groupId, ticketNumber) {
        const directoryPath = path.join(__dirname, 'cases');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }

        const filePath = path.join(directoryPath, `${groupId}.json`);
        const groupData = {
            ticket: ticketNumber,
            open: new Date().toISOString(),
            take: [],
            resolved: null,
            close: null,
            tagging: [],
            id: []
        };

        fs.writeFileSync(filePath, JSON.stringify(groupData, null, 4));
    }

    async handleGroupCommand(groupId, command, commandValue, agentNumber) {
        try {
            let agentInfo, agentFullNumber, groupFilePath, groupData, chat, media;

            groupFilePath = path.join(__dirname, 'cases', `${groupId}.json`);
            groupData = JSON.parse(fs.readFileSync(groupFilePath));

            switch (command) {
                case 'take':
                    agentFullNumber = `${agentNumber}@c.us`;
                    agentInfo = this.loadAgents().find(agent => agent.number === agentFullNumber);
                    if (!agentInfo) throw new Error('Agent not found');

                    this.updateGroupDataTake(groupData, agentInfo);
                    media = await this.mediaManager.loadImageFromPath(`./media/${agentInfo.id}.png`);
                    break;

                case 'global':
                    agentInfo = { name: 'Soporte Global' };
                    this.updateGroupDataTake(groupData, agentInfo);
                    media = await this.mediaManager.loadImageFromPath('./media/global.png');
                    break;

                case 'resolved':
                    groupData.resolved = new Date().toISOString();
                    media = await this.mediaManager.loadImageFromPath('./media/resolved.png');
                    break;

                case 'close':
                    groupData.close = new Date().toISOString();
                    media = await this.mediaManager.loadImageFromPath('./media/close.png');
                    this.updateContactGroup(groupId);
                    break;

                case 'id':
                    groupData.id.push(commandValue);
                    break;

                case 'tag':
                    groupData.tagging.push(commandValue);
                    break;

                default:
                    throw new Error('Unrecognized command');
            }

            fs.writeFileSync(groupFilePath, JSON.stringify(groupData, null, 4));
            
            if (this.client && ['take', 'global', 'resolved', 'close'].includes(command)) {
                chat = await this.client.getChatById(groupId);
                await chat.setPicture(media);
            }

        } catch (error) {
            console.error('Error in handleGroupCommand:', error);
        }
    }

    updateGroupDataTake(groupData, agentInfo) {
        if (!Array.isArray(groupData.take)) groupData.take = [];
        let newEntry = { name: agentInfo.name, timestamp: new Date().toISOString() };
        groupData.take.push(newEntry);
    }

    updateContactGroup(groupId) {
        const contact = ContactManager.getContactInfoByGroupId(groupId);
        if (contact) {
            contact.group = "";
            ContactManager.saveContactInfo(contact);
        } else {
            console.error('Contact not found for update:', groupId);
        }
    }

    loadAgents() {
        const agentsFilePath = path.join(__dirname, 'agents.json');
        try {
            const agentsData = fs.readFileSync(agentsFilePath, 'utf8'); 
            const agents = JSON.parse(agentsData);
            return agents;
        } catch (error) {
            console.error('Error loading agents:', error);
            return [];
        }
    }
}

module.exports = GroupManager;
