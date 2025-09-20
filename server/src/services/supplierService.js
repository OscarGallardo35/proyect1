import { repository } from '../data/repository.js';
import { generateId } from '../utils/id.js';

export const supplierService = {
  listSuppliers() {
    return repository.list('suppliers');
  },
  getSupplier(id) {
    return repository.findById('suppliers', id);
  },
  createSupplier(payload) {
    const supplier = {
      id: generateId('sup'),
      leadTimeHours: 24,
      rating: 4.5,
      shippingZones: [],
      feePercentage: 0.05,
      ...payload
    };
    return repository.insert('suppliers', supplier);
  },
  updateSupplier(id, payload) {
    return repository.update('suppliers', id, payload);
  }
};
