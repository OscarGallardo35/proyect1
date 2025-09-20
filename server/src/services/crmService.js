import { repository } from "../data/repository.js";
import { generateId } from "../utils/id.js";
import { eventBus } from "../utils/eventBus.js";

function record(event) {
  repository.insert("events", {
    id: generateId("evt"),
    createdAt: new Date().toISOString(),
    ...event
  });
  eventBus.emit(event.type, event);
}

export const crmService = {
  listTickets({ status } = {}) {
    const tickets = repository.list("tickets");
    if (!status) return tickets;
    return tickets.filter((ticket) => ticket.status === status);
  },
  getTicket(id) {
    return repository.findById("tickets", id);
  },
  createTicket(payload) {
    const now = new Date().toISOString();
    const ticket = {
      id: generateId("tkt"),
      status: "open",
      priority: "low",
      notes: [],
      createdAt: now,
      updatedAt: now,
      ...payload
    };
    repository.insert("tickets", ticket);
    record({
      entity: "ticket",
      entityId: ticket.id,
      type: "ticket.created",
      message: `Ticket ${ticket.subject}`
    });
    return ticket;
  },
  addNote(id, note) {
    const ticket = this.getTicket(id);
    if (!ticket) return null;
    const newNote = {
      id: generateId("note"),
      author: note.author || "agent",
      body: note.body,
      createdAt: new Date().toISOString()
    };
    const updated = repository.update("tickets", id, {
      notes: [...(ticket.notes || []), newNote],
      updatedAt: new Date().toISOString()
    });
    record({
      entity: "ticket",
      entityId: id,
      type: "ticket.note",
      message: `Nota añadida a ticket ${id}`
    });
    return updated;
  },
  updateTicket(id, patch) {
    const updated = repository.update("tickets", id, {
      ...patch,
      updatedAt: new Date().toISOString()
    });
    if (updated) {
      record({
        entity: "ticket",
        entityId: id,
        type: "ticket.updated",
        message: `Ticket ${id} actualizado`
      });
    }
    return updated;
  }
};
