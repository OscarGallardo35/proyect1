import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultState } from './default-state.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = resolve(__dirname, '../../data');
const DB_PATH = resolve(DATA_DIR, 'db.json');

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function normalizeState(partial) {
  const base = JSON.parse(JSON.stringify(defaultState));
  return Object.assign(base, partial || {});
}

function loadState() {
  ensureDataDir();
  if (!existsSync(DB_PATH)) {
    return normalizeState();
  }
  try {
    const raw = readFileSync(DB_PATH, 'utf-8');
    if (!raw) {
      return normalizeState();
    }
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    console.error('No se pudo leer db.json. Se usará estado por defecto.', error);
    return normalizeState();
  }
}

let state = loadState();

function persist() {
  ensureDataDir();
  writeFileSync(DB_PATH, JSON.stringify(state, null, 2), 'utf-8');
}

export function getState() {
  return state;
}

export function updateState(updater) {
  const draft = JSON.parse(JSON.stringify(state));
  const updated = updater(draft) || draft;
  state = normalizeState(updated);
  persist();
  return state;
}

export function overwriteState(nextState) {
  state = normalizeState(nextState);
  persist();
  return state;
}

export function getDbPath() {
  return DB_PATH;
}
