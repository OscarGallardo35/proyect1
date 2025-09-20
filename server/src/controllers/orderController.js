import { orderService } from '../services/orderService.js';

export const orderController = {
  list(req, res) {
    const orders = orderService.listOrders(req.query);
    res.json(orders);
  },
  get(req, res) {
    const order = orderService.getOrder(req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(order);
  },
  async create(req, res, next) {
    try {
      const order = await orderService.createOrder(req.body);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },
  update(req, res) {
    const updated = orderService.updateOrder(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Pedido no encontrado' });
    res.json(updated);
  }
};
