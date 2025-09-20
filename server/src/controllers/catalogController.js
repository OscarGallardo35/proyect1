import { catalogService } from '../services/catalogService.js';

export const catalogController = {
  list(req, res) {
    const products = catalogService.listProducts(req.query);
    res.json(products);
  },
  get(req, res) {
    const product = catalogService.getProduct(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  },
  create(req, res) {
    const product = catalogService.createProduct(req.body);
    res.status(201).json(product);
  },
  update(req, res) {
    const updated = catalogService.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(updated);
  },
  delete(req, res) {
    const deleted = catalogService.deleteProduct(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Producto no encontrado' });
    res.status(204).end();
  }
};
