import { EventEmitter } from 'node:events';

export const eventBus = new EventEmitter();

// Increment listener limit to avoid warnings in dev when hot reloading
eventBus.setMaxListeners(25);
