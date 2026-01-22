const form = document.getElementById("toolForm");
const tableBody = document.getElementById("tableBody");
let editIndex = null;
let tools = JSON.parse(localStorage.getItem("tools")) || [];

/* =========================
   funciones
========================= */

function renderTable() {
  tableBody.innerHTML = "";

  tools.forEach((tool, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${tool.name}</td>
      <td>${tool.category}</td>
      <td>${tool.quantity}</td>
      <td>${tool.ubication || "-"}</td>
      <td>
        <button class="edit-btn" data-index="${index}">
  <i class="fa-solid fa-pen"></i>
</button>
<button class="delete-btn" data-index="${index}">
  <i class="fa-solid fa-trash"></i>
</button>
      </td>
</td>

    `;

    tableBody.appendChild(row);
  });
}

/* =========================
   Eventos
========================= */

/* AGREGAR HERRAMIENTA */

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const quantity = document.getElementById("quantity").value;
  const ubication = document.getElementById("ubication").value.trim();

  if (!name || !category || !quantity || !ubication) return;

  if (editIndex !== null) {
    // MODO EDITAR
    tools[editIndex] = { name, category, quantity, ubication };
    editIndex = null;
    form.querySelector("button").textContent = "Agregar";
  } else {
    // MODO AGREGAR
    tools.push({ name, category, quantity, ubication });
  }
  document
    .querySelectorAll("tr.editing")
    .forEach((tr) => tr.classList.remove("editing"));
  localStorage.setItem("tools", JSON.stringify(tools));
  renderTable();
  form.reset();
});

/* BORRAR PRODUCTO */
tableBody.addEventListener("click", (e) => {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");

  if (deleteBtn) {
    const index = deleteBtn.dataset.index;
    tools.splice(index, 1);
    localStorage.setItem("tools", JSON.stringify(tools));
    renderTable();
    return;
  }

  if (editBtn) {
    const index = editBtn.dataset.index;
    const tool = tools[index];

    // limpiar ediciones anteriores
    document
      .querySelectorAll("tr.editing")
      .forEach((tr) => tr.classList.remove("editing"));

    // marcar fila
    editBtn.closest("tr").classList.add("editing");

    document.getElementById("name").value = tool.name;
    document.getElementById("category").value = tool.category;
    document.getElementById("quantity").value = tool.quantity;
    document.getElementById("ubication").value = tool.ubication;

    editIndex = index;
    form.querySelector("button").textContent = "Guardar cambios";
  }
});
