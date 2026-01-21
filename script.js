const form = document.getElementById("toolForm");
const tableBody = document.getElementById("tableBody");

let tools = JSON.parse(localStorage.getItem("tools")) || [];

/* =========================
   MOSTRAR DATOS AL CARGAR
========================= */
function renderTable() {
  tableBody.innerHTML = "";

  tools.forEach((tool) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${tool.name}</td>
      <td>${tool.category}</td>
      <td>${tool.quantity}</td>
    <td>${tool.ubication || "-"}</td>
    `;

    tableBody.appendChild(row);
  });
}

renderTable();

/* =========================
   AGREGAR HERRAMIENTA
========================= */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const quantity = document.getElementById("quantity").value;
  const ubication = document.getElementById("ubication").value.trim();

  if (!name || !category || !quantity || !ubication) return;

  const newTool = {
    name,
    category,
    quantity,
    ubication,
  };

  tools.push(newTool);
  localStorage.setItem("tools", JSON.stringify(tools));

  renderTable();
  form.reset();
});
