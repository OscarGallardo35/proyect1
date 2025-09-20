import { eventService } from '../services/eventService.js';

export const eventController = {
  list(req, res) {
    const limit = Number(req.query.limit || 50);
    res.json({ events: eventService.list(limit) });
  }
};
