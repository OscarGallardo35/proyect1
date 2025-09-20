import { repository } from "../data/repository.js";
import { generateId } from "../utils/id.js";
import { eventBus } from "../utils/eventBus.js";

function emit(event) {
  eventBus.emit(event.type, event);
  repository.insert("events", {
    id: generateId("evt"),
    createdAt: new Date().toISOString(),
    ...event
  });
}

export const catalogService = {
  listProducts(filters = {}) {
    const { status, supplierId, category, search } = filters;
    return repository.list("products").filter((product) => {
      if (status && product.status !== status) return false;
      if (supplierId && product.supplierId !== supplierId) return false;
      if (category && product.category !== category) return false;
      if (search) {
        const term = search.toLowerCase();
        return (
          product.name.toLowerCase().includes(term) ||
          product.description.toLowerCase().includes(term)
        );
      }
      return true;
    });
  },
  getProduct(id) {
    return repository.findById("products", id);
  },
  createProduct(payload) {
    const timestamp = new Date().toISOString();
    const product = {
      id: generateId("prd"),
      status: "draft",
      createdAt: timestamp,
      updatedAt: timestamp,
      ...payload
    };
    repository.insert("products", product);
    emit({
      entity: "product",
      entityId: product.id,
      type: "product.created",
      message: `Producto ${product.name} creado`
    });
    return product;
  },
  updateProduct(id, payload) {
    const existing = this.getProduct(id);
    if (!existing) return null;
    const updated = repository.update("products", id, {
      ...payload,
      updatedAt: new Date().toISOString()
    });
    emit({
      entity: "product",
      entityId: id,
      type: "product.updated",
      message: `Producto ${id} actualizado`
    });
    return updated;
  },
  deleteProduct(id) {
    const removed = repository.remove("products", id);
    if (removed) {
      emit({
        entity: "product",
        entityId: id,
        type: "product.deleted",
        message: `Producto ${id} eliminado`
      });
    }
    return removed;
  }
};
