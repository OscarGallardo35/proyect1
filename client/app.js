const API_BASE =
  localStorage.getItem("apiBase") ||
  window.API_BASE ||
  `${window.location.origin.replace(/\/$/, "")}/api`;
const statusIndicator = document.getElementById("status-indicator");
const apiUrlEl = document.getElementById("api-url");
apiUrlEl.textContent = API_BASE;

document.addEventListener("DOMContentLoaded", () => {
  bindActions();
  bootstrap();
});

function bindActions() {
  document.getElementById("reload-products").addEventListener("click", loadProducts);
  document.getElementById("reload-orders").addEventListener("click", loadOrders);
  document.getElementById("reload-tickets").addEventListener("click", loadTickets);
  document.getElementById("reload-events").addEventListener("click", loadEvents);
  document.getElementById("product-form").addEventListener("submit", createProduct);
}

async function bootstrap() {
  await Promise.all([loadProducts(), loadOrders(), loadTickets(), loadEvents()]);
}

async function api(path, options = {}) {
  try {
    statusIndicator.textContent = "Sincronizando...";
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || "Error inesperado");
    }
    statusIndicator.textContent = "Actualizado";
    return response.status === 204 ? null : response.json();
  } catch (error) {
    console.error(error);
    statusIndicator.textContent = "Error de sincronizacion";
    throw error;
  }
}

async function loadProducts() {
  const tbody = document.querySelector("#products-table tbody");
  tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
  try {
    const products = await api("/catalog");
    if (!products.length) {
      tbody.innerHTML = '<tr><td colspan="5">Sin productos</td></tr>';
      return;
    }
    tbody.innerHTML = products
      .map(
        (product) => `
        <tr>
          <td>${product.name}</td>
          <td>${product.supplierId ?? "N/A"}</td>
          <td>$${product.price?.toFixed?.(2) ?? "0.00"}</td>
          <td>${product.stock ?? 0}</td>
          <td><span class="status ${product.status}">${product.status}</span></td>
        </tr>`
      )
      .join("");
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
  }
}

async function loadOrders() {
  const tbody = document.querySelector("#orders-table tbody");
  tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
  try {
    const orders = await api("/orders");
    if (!orders.length) {
      tbody.innerHTML = '<tr><td colspan="5">Sin pedidos</td></tr>';
      return;
    }
    tbody.innerHTML = orders
      .map(
        (order) => `
        <tr>
          <td>${order.id}</td>
          <td>${order.customerId ?? "N/A"}</td>
          <td>$${Number(order.total ?? 0).toFixed(2)}</td>
          <td>${order.status}</td>
          <td>${order.supplierId ?? "-"}</td>
        </tr>`
      )
      .join("");
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
  }
}

async function loadTickets() {
  const tbody = document.querySelector("#tickets-table tbody");
  tbody.innerHTML = '<tr><td colspan="5">Cargando...</td></tr>';
  try {
    const tickets = await api("/crm");
    if (!tickets.length) {
      tbody.innerHTML = '<tr><td colspan="5">Sin tickets</td></tr>';
      return;
    }
    tbody.innerHTML = tickets
      .map(
        (ticket) => `
        <tr>
          <td>${ticket.id}</td>
          <td>${ticket.orderId ?? "-"}</td>
          <td>${ticket.customerId ?? "-"}</td>
          <td>${ticket.status}</td>
          <td>${ticket.priority}</td>
        </tr>`
      )
      .join("");
  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="5">${error.message}</td></tr>`;
  }
}

async function loadEvents() {
  const list = document.getElementById("events-list");
  list.innerHTML = "<li>Cargando...</li>";
  try {
    const { events } = await api("/events");
    renderEvents(events || []);
  } catch (error) {
    list.innerHTML = `<li>${error.message}</li>`;
  }
}

function renderEvents(events) {
  const list = document.getElementById("events-list");
  if (!events.length) {
    list.innerHTML = "<li>Sin eventos recientes</li>";
    return;
  }
  list.innerHTML = events
    .slice(0, 20)
    .map(
      (event) => `
      <li>
        <strong>${event.type}</strong>
        <span>${event.message ?? ""}</span>
        <small>${new Date(event.createdAt).toLocaleString()}</small>
      </li>`
    )
    .join("");
}

async function createProduct(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = Object.fromEntries(new FormData(form).entries());
  data.price = Number(data.price);
  data.cost = Number(data.cost);
  data.stock = Number(data.stock);
  try {
    await api("/catalog", {
      method: "POST",
      body: JSON.stringify(data)
    });
    form.reset();
    await loadProducts();
  } catch (error) {
    alert(`No se pudo crear el producto: ${error.message}`);
  }
}



