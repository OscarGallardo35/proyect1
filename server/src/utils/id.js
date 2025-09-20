import { randomUUID } from 'node:crypto';

export function generateId(prefix) {
  const base = randomUUID().split('-')[0];
  return prefix ? ${prefix}- : base;
}
