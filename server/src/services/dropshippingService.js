import { repository } from "../data/repository.js";
import { generateId } from "../utils/id.js";
import { eventBus } from "../utils/eventBus.js";
import { config } from "../config.js";

async function simulateSupplierOrder({ supplier, order }) {
  // Simula llamada HTTP al proveedor. En producción se sustituyen endpoints reales.
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    supplierOrderId: generateId("supOrd"),
    trackingCode: `${supplier.id.toUpperCase()}-${order.id}`,
    estimatedDispatch: new Date(Date.now() + supplier.leadTimeHours * 3600 * 1000).toISOString()
  };
}

function record(event) {
  repository.insert("events", {
    id: generateId("evt"),
    createdAt: new Date().toISOString(),
    ...event
  });
  eventBus.emit(event.type, event);
}

export const dropshippingService = {
  selectSupplierForItems(items) {
    const suppliers = repository.list("suppliers");
    const products = repository.list("products");

    const candidateScores = suppliers
      .map((supplier) => {
        const canFulfill = items.every((item) => {
          const product = products.find(
            (p) => p.id === item.productId && p.supplierId === supplier.id
          );
          return product && product.stock >= item.quantity;
        });
        if (!canFulfill) return null;
        const ratingScore = supplier.rating || 0;
        const speedScore = supplier.leadTimeHours ? 1 / supplier.leadTimeHours : 0;
        const feeScore = supplier.feePercentage ? 1 / supplier.feePercentage : 0;
        return {
          supplier,
          score: ratingScore * 0.5 + speedScore * 0.3 + feeScore * 0.2
        };
      })
      .filter(Boolean);

    if (!candidateScores.length) return null;
    candidateScores.sort((a, b) => b.score - a.score);
    return candidateScores[0].supplier;
  },

  async fulfillOrder(order) {
    const supplier = this.selectSupplierForItems(order.items);
    if (!supplier) {
      record({
        entity: "order",
        entityId: order.id,
        type: "order.pending",
        message: "Sin proveedor disponible"
      });
      return null;
    }
    const response = await simulateSupplierOrder({ supplier, order });
    const patched = repository.update("orders", order.id, {
      supplierId: supplier.id,
      status: config.dropshipping.autoFulfill ? "processing" : "pending_approval",
      supplierOrderId: response.supplierOrderId,
      shipping: {
        ...(order.shipping || {}),
        trackingCode: response.trackingCode,
        estimatedDispatch: response.estimatedDispatch
      },
      updatedAt: new Date().toISOString()
    });
    record({
      entity: "order",
      entityId: order.id,
      type: "order.assigned",
      message: `Asignado proveedor ${supplier.name}`
    });
    return patched;
  }
};
