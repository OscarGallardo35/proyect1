export const seedData = {
  suppliers: [
    {
      id: "sup-aurora",
      name: "Aurora Gadgets",
      leadTimeHours: 24,
      rating: 4.7,
      catalogUrl: "https://mock-supplier.local/aurora",
      shippingZones: ["US", "CA", "MX"],
      feePercentage: 0.04
    },
    {
      id: "sup-zen",
      name: "Zen Living",
      leadTimeHours: 48,
      rating: 4.4,
      catalogUrl: "https://mock-supplier.local/zen",
      shippingZones: ["US", "EU"],
      feePercentage: 0.035
    }
  ],
  products: [
    {
      id: "prd-001",
      name: "Aurora Smart Speaker",
      description: "Altavoz inteligente con asistente virtual integrado",
      supplierId: "sup-aurora",
      price: 149.99,
      cost: 95,
      stock: 120,
      category: "Electrónica",
      status: "published"
    },
    {
      id: "prd-002",
      name: "Aurora Airbuds",
      description: "Auriculares inalámbricos con cancelación de ruido",
      supplierId: "sup-aurora",
      price: 89.0,
      cost: 52,
      stock: 200,
      category: "Electrónica",
      status: "published"
    },
    {
      id: "prd-003",
      name: "Zen Aroma Diffuser",
      description: "Difusor inteligente con programación remota",
      supplierId: "sup-zen",
      price: 59.0,
      cost: 28,
      stock: 80,
      category: "Hogar",
      status: "draft"
    }
  ],
  customers: [
    {
      id: "cus-valeria",
      name: "Valeria Ríos",
      email: "valeria@example.com",
      phone: "+52 55 1234 5678",
      lifetimeValue: 420.5,
      segments: ["vip", "newsletter"],
      address: {
        street: "Av. Reforma 123",
        city: "CDMX",
        country: "MX"
      }
    },
    {
      id: "cus-luis",
      name: "Luis Martínez",
      email: "luis@example.com",
      phone: "+34 612 345 678",
      lifetimeValue: 195.0,
      segments: ["lead"],
      address: {
        street: "Calle Gran Vía 45",
        city: "Madrid",
        country: "ES"
      }
    }
  ],
  orders: [
    {
      id: "ord-1001",
      customerId: "cus-valeria",
      items: [
        {
          productId: "prd-001",
          quantity: 1,
          unitPrice: 149.99
        }
      ],
      total: 149.99,
      status: "fulfilled",
      supplierId: "sup-aurora",
      channel: "web",
      createdAt: "2024-09-01T10:15:00.000Z",
      updatedAt: "2024-09-02T12:00:00.000Z",
      shipping: {
        address: "Av. Reforma 123",
        trackingCode: "AUR-TRACK-001"
      }
    }
  ],
  tickets: [
    {
      id: "tkt-5001",
      orderId: "ord-1001",
      customerId: "cus-valeria",
      subject: "Seguimiento de pedido",
      status: "open",
      priority: "medium",
      notes: [
        {
          id: "note-1",
          author: "system",
          body: "Ticket creado automáticamente tras entrega",
          createdAt: "2024-09-02T12:30:00.000Z"
        }
      ]
    }
  ],
  events: [
    {
      id: "evt-1",
      entity: "order",
      entityId: "ord-1001",
      type: "order.fulfilled",
      message: "Pedido enviado por proveedor Aurora",
      createdAt: "2024-09-02T12:00:00.000Z"
    }
  ]
};
