import { repository } from '../data/repository.js';

export const eventService = {
  list(limit = 50) {
    const events = repository.list('events');
    return events.slice(-limit).reverse();
  }
};
