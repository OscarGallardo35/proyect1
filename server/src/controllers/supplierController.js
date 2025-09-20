import { supplierService } from '../services/supplierService.js';

export const supplierController = {
  list(_req, res) {
    res.json(supplierService.listSuppliers());
  },
  get(req, res) {
    const supplier = supplierService.getSupplier(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(supplier);
  },
  create(req, res) {
    const supplier = supplierService.createSupplier(req.body);
    res.status(201).json(supplier);
  },
  update(req, res) {
    const updated = supplierService.updateSupplier(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(updated);
  }
};
