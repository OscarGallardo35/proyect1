import { repository } from "../data/repository.js";
import { generateId } from "../utils/id.js";
import { eventBus } from "../utils/eventBus.js";

function record(event) {
  repository.insert("events", {
    id: generateId("evt"),
    createdAt: new Date().toISOString(),
    ...event
  });
  eventBus.emit(event.type, event);
}

export const customerService = {
  listCustomers({ segment } = {}) {
    return repository.list("customers").filter((customer) => {
      if (segment) {
        return customer.segments?.includes(segment);
      }
      return true;
    });
  },
  getCustomer(id) {
    return repository.findById("customers", id);
  },
  createCustomer(payload) {
    const now = new Date().toISOString();
    const customer = {
      id: generateId("cus"),
      lifetimeValue: 0,
      segments: [],
      createdAt: now,
      updatedAt: now,
      ...payload
    };
    repository.insert("customers", customer);
    record({
      entity: "customer",
      entityId: customer.id,
      type: "customer.created",
      message: `Alta de cliente ${customer.email}`
    });
    return customer;
  },
  updateCustomer(id, payload) {
    const existing = this.getCustomer(id);
    if (!existing) return null;
    const updated = repository.update("customers", id, {
      ...payload,
      updatedAt: new Date().toISOString()
    });
    record({
      entity: "customer",
      entityId: id,
      type: "customer.updated",
      message: `Cliente ${id} actualizado`
    });
    return updated;
  }
};
