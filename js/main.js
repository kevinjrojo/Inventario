import { getTools, addTool, updateTool, deleteTool } from "./toolsService.js";
import { renderTable } from "./ui.js";

const form = document.getElementById("toolForm");
const tableBody = document.getElementById("tableBody");
const cancelBtn = document.getElementById("cancelEdit");

let tools = [];
let editId = null;

async function loadTools() {
  tools = await getTools();
  renderTable(tools, tableBody);
}

loadTools();

/* FORM */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tool = {
    name: form.name.value.trim(),
    category: form.category.value.trim(),
    codigo: form.codigo.value.trim(),
    quantity: Number(form.quantity.value),
    ubication: form.ubication.value.trim(),
  };

  if (editId) {
    await updateTool(editId, tool);

    tools = tools.filter((t) => t.id !== editId);
    tools.unshift({ id: editId, ...tool });

    renderTable(tools, tableBody);

    // ⬇️ SALIR DEL MODO EDICIÓN
    editId = null;
    form.classList.remove("editing");
    cancelBtn.hidden = true;

    form.querySelector("button[type='submit']").textContent = "Agregar";
  } else {
    await addTool(tool);
  }

  form.reset();
  return;
});

tableBody.addEventListener("click", async (e) => {
  const editBtn = e.target.closest(".edit-btn");
  const deleteBtn = e.target.closest(".delete-btn");

  /* BORRAR */
  if (deleteBtn) {
    if (!confirm("¿Seguro que querés borrar esta herramienta?")) return;
    await deleteTool(deleteBtn.dataset.id);
    loadTools();
    return;
  }

  /* EDITAR */
  if (editBtn) {
    const tool = tools.find((t) => t.id == editBtn.dataset.id);

    cancelBtn.hidden = false;
    form.classList.add("editing");

    form.codigo.value = tool.codigo || "";
    form.name.value = tool.name;
    form.category.value = tool.category;
    form.quantity.value = tool.quantity;
    form.ubication.value = tool.ubication;

    editId = tool.id;
    form.querySelector("button[type='submit']").textContent = "Guardar cambios";

    form.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    form.querySelector("input").focus();
  }
});

cancelBtn.addEventListener("click", () => {
  editId = null;
  form.reset();

  form.classList.remove("editing");
  cancelBtn.hidden = true;

  form.querySelector("button[type='submit']").textContent = "Agregar";

  document
    .querySelectorAll("tr.editing")
    .forEach((tr) => tr.classList.remove("editing"));
});
