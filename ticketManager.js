// ticketManager.js
const fs = require('fs');
const TICKET_FILE = './tickets.json';

const loadTickets = () => {
    if (fs.existsSync(TICKET_FILE)) {
        const data = fs.readFileSync(TICKET_FILE, 'utf-8');
        return JSON.parse(data);
    }
    return [];
};

const saveTickets = (tickets) => {
    fs.writeFileSync(TICKET_FILE, JSON.stringify(tickets, null, 4));
};

const generateTicketNumber = (currentCount) => {
    return `TK-${String(currentCount + 1).padStart(5, '0')}`;
};

const createTicket = (groupId) => {
    const tickets = loadTickets();
    const newTicket = {
        groupId: groupId,
        ticketNumber: generateTicketNumber(tickets.length),
        timestamp: new Date().toISOString()
    };
    tickets.push(newTicket);
    saveTickets(tickets);
    return newTicket;
};

module.exports = {
    createTicket
};