import { crmService } from '../services/crmService.js';

export const crmController = {
  list(req, res) {
    const tickets = crmService.listTickets(req.query);
    res.json(tickets);
  },
  get(req, res) {
    const ticket = crmService.getTicket(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket no encontrado' });
    res.json(ticket);
  },
  create(req, res) {
    const ticket = crmService.createTicket(req.body);
    res.status(201).json(ticket);
  },
  addNote(req, res) {
    const updated = crmService.addNote(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Ticket no encontrado' });
    res.json(updated);
  },
  update(req, res) {
    const updated = crmService.updateTicket(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Ticket no encontrado' });
    res.json(updated);
  }
};
