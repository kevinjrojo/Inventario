const SUPABASE_URL = "https://xaplplzqxhyjjcebhtvz.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhhcGxwbHpxeGh5ampjZWJodHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxMjExNjAsImV4cCI6MjA4NDY5NzE2MH0.T5SNqohHrSPZiMLPt_b2RzFZdGiGxTqddHiWKG1aIEk";
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);
const form = document.getElementById("toolForm");
const tableBody = document.getElementById("tableBody");
let editId = null;
let tools = [];

console.log("SCRIPT CARGADO");

/* =========================
   funciones
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
      <td>
       <button class="edit-btn" data-id="${tool.id}">
  <i class="fa-solid fa-pen"></i>
</button>
<button class="delete-btn" data-id="${tool.id}">
  <i class="fa-solid fa-trash"></i>
</button>
      </td>
</td>

    `;

    tableBody.appendChild(row);
  });
}
async function loadTools() {
  const { data, error } = await supabaseClient.from("tools").select("*");

  if (error) {
    console.error("Error cargando herramientas:", error);
    return;
  }

  tools = data;
  renderTable();
}

loadTools();

/* =========================
   Eventos
========================= */

/* AGREGAR HERRAMIENTA */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const category = document.getElementById("category").value.trim();
  const quantity = document.getElementById("quantity").value;
  const ubication = document.getElementById("ubication").value.trim();

  if (!name || !category || !quantity || !ubication) return;

  if (editId !== null) {
    const { error } = await supabaseClient
      .from("tools")
      .update({
        name,
        category,
        quantity: Number(quantity),
        ubication,
      })
      .eq("id", editId);

    if (error) {
      console.error("Error al editar herramienta:", error);
      return;
    }

    editId = null;
    form.querySelector("button").textContent = "Agregar";
  } else {
    const { error } = await supabaseClient.from("tools").insert([
      {
        name,
        category,
        quantity: Number(quantity),
        ubication,
      },
    ]);

    if (error) {
      console.error("Error al agregar herramienta:", error);
      return;
    }
  }
  document
    .querySelectorAll("tr.editing")
    .forEach((tr) => tr.classList.remove("editing"));
  loadTools();
  form.reset();
});

/* BORRAR PRODUCTO */
tableBody.addEventListener("click", async (e) => {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");

  if (deleteBtn) {
    const id = deleteBtn.dataset.id;

    const confirmDelete = confirm(
      "¿Seguro que querés borrar esta herramienta?",
    );

    if (!confirmDelete) return;

    const { error } = await supabaseClient.from("tools").delete().eq("id", id);

    if (error) {
      console.error("Error al borrar:", error);
      return;
    }

    loadTools();
    return;
  }

  if (editBtn) {
    const id = editBtn.dataset.id;
    const tool = tools.find((t) => t.id == id);
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

    editId = id;
    form.querySelector("button").textContent = "Guardar cambios";
  }
});
