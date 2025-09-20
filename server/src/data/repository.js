import { getState, updateState } from './persistence.js';

const collections = ['products', 'suppliers', 'customers', 'orders', 'tickets', 'events'];

function getCollection(name) {
  const state = getState();
  if (!collections.includes(name)) {
    throw new Error(Colección desconocida: );
  }
  return state[name];
}

export const repository = {
  list(collection) {
    return [...getCollection(collection)];
  },
  findById(collection, id) {
    return getCollection(collection).find((item) => item.id === id) || null;
  },
  insert(collection, entity) {
    let created;
    updateState((draft) => {
      draft[collection].push(entity);
      created = entity;
    });
    return created;
  },
  update(collection, id, patch) {
    let updated = null;
    updateState((draft) => {
      const index = draft[collection].findIndex((item) => item.id === id);
      if (index >= 0) {
        draft[collection][index] = { ...draft[collection][index], ...patch };
        updated = draft[collection][index];
      }
    });
    return updated;
  },
  remove(collection, id) {
    let removed = false;
    updateState((draft) => {
      const initial = draft[collection].length;
      draft[collection] = draft[collection].filter((item) => item.id !== id);
      removed = draft[collection].length < initial;
    });
    return removed;
  }
};
