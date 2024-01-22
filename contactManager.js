// contactManager.js
const fs = require('fs');
const contactsPath = './contacts.json';

class ContactManager {
    static getContactInfo(contactId) {
        const contactsData = fs.readFileSync(contactsPath);
        const contacts = JSON.parse(contactsData);
        return contacts.find(contact => contact.id === contactId);
    }

    static saveContactInfo(contact) {
        const contactsData = fs.readFileSync(contactsPath);
        const contacts = JSON.parse(contactsData);
        const index = contacts.findIndex(c => c.id === contact.id);

        if (index > -1) {
            contacts[index] = contact;
        } else {
            contacts.push(contact);
        }

        fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 4));
    }

    static getContactInfoByGroupId(groupId) {
        const contactsData = fs.readFileSync(contactsPath);
        const contacts = JSON.parse(contactsData);
        return contacts.find(contact => contact.group === groupId);
    }
}

module.exports = ContactManager;