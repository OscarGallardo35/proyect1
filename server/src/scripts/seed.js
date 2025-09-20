import { seedData } from '../data/seed-data.js';
import { overwriteState, getDbPath } from '../data/persistence.js';
import { logger } from '../utils/logger.js';

overwriteState(seedData);
logger.info('Datos de ejemplo cargados en', getDbPath());
