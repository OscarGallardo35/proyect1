import { customerService } from '../services/customerService.js';

export const customerController = {
  list(req, res) {
    const customers = customerService.listCustomers(req.query);
    res.json(customers);
  },
  get(req, res) {
    const customer = customerService.getCustomer(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(customer);
  },
  create(req, res) {
    const customer = customerService.createCustomer(req.body);
    res.status(201).json(customer);
  },
  update(req, res) {
    const updated = customerService.updateCustomer(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(updated);
  }
};
