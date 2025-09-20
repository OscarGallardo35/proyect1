import { repository } from "../data/repository.js";
import { generateId } from "../utils/id.js";
import { dropshippingService } from "./dropshippingService.js";
import { eventBus } from "../utils/eventBus.js";

function record(event) {
  repository.insert("events", {
    id: generateId("evt"),
    createdAt: new Date().toISOString(),
    ...event
  });
  eventBus.emit(event.type, event);
}

function calculateTotal(items) {
  return items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
}

export const orderService = {
  listOrders({ status } = {}) {
    const orders = repository.list("orders");
    if (!status) return orders;
    return orders.filter((order) => order.status === status);
  },
  getOrder(id) {
    return repository.findById("orders", id);
  },
  async createOrder(payload) {
    const now = new Date().toISOString();
    const order = {
      id: generateId("ord"),
      status: "new",
      createdAt: now,
      updatedAt: now,
      total: calculateTotal(payload.items || []),
      ...payload
    };
    repository.insert("orders", order);
    record({
      entity: "order",
      entityId: order.id,
      type: "order.created",
      message: `Pedido ${order.id} creado`
    });

    const processed = await dropshippingService.fulfillOrder(order);
    return processed || order;
  },
  updateOrder(id, patch) {
    const updated = repository.update("orders", id, {
      ...patch,
      updatedAt: new Date().toISOString()
    });
    if (updated) {
      record({
        entity: "order",
        entityId: id,
        type: "order.updated",
        message: `Pedido ${id} actualizado`
      });
    }
    return updated;
  }
};
