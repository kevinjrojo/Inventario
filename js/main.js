import { getTools, addTool, updateTool, deleteTool } from "./toolsService.js";
import { renderTable } from "./ui.js";
import { filterTools } from "./searchTools.js";

const form = document.getElementById("toolForm");
const tableBody = document.getElementById("tableBody");
const cancelBtn = document.getElementById("cancelEdit");
const searchInput = document.getElementById("searchInput");
const downloadToolsBtn = document.getElementById("downloadToolsBtn");
const downloadWordBtn = document.getElementById("downloadWordBtn");

let tools = [];
let editId = null;

function renderFilteredTools() {
  const filteredTools = filterTools(tools, searchInput.value);
  renderTable(filteredTools, tableBody);
}

async function loadTools() {
  tools = await getTools();
  renderTable(tools, tableBody);
  renderFilteredTools();
}

loadTools();

/* FORM */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const tool = {
    name: form.name.value.trim(),
    category: form.category.value.trim(),
    codigo: form.codigo.value.trim(),
    day: form.day.value.trim(),
    ubication: form.ubication.value.trim(),
  };

  if (editId) {
    await updateTool(editId, tool);

    tools = tools.filter((t) => t.id !== editId);
    tools.unshift({ id: editId, ...tool });

    renderFilteredTools();

    // ⬇️ SALIR DEL MODO EDICIÓN
    editId = null;
    form.classList.remove("editing");
    cancelBtn.hidden = true;

    form.querySelector("button[type='submit']").textContent = "Agregar";
  } else {
    await addTool(tool);
    await loadTools();
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
    form.day.value = tool.day;
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

searchInput.addEventListener("input", () => {
  renderFilteredTools();
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

downloadToolsBtn.addEventListener("click", () => {
  if (!tools.length) {
    alert("No hay instrumentos para descargar.");
    return;
  }

  const headers = ["Nombre", "Categoría", "Código", "Fecha", "Ubicación"];

  const escapeCsvValue = (value) => {
    const safeValue = String(value ?? "").replace(/"/g, '""');
    return `"${safeValue}"`;
  };

  const rows = tools.map((tool) => [
    tool.name,
    tool.category,
    tool.codigo || "-",
    tool.day,
    tool.ubication || "-",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");

  const csvWithBom = `\uFEFF${csvContent}`;
  const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "instrumentos_de_medicion.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});

downloadWordBtn.addEventListener("click", () => {
  if (!tools.length) {
    alert("No hay instrumentos para descargar.");
    return;
  }

  const escapeHtml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const rowsHtml = tools
    .map(
      (tool) => `
      <tr>
        <td>${escapeHtml(tool.name)}</td>
        <td>${escapeHtml(tool.category)}</td>
        <td>${escapeHtml(tool.codigo || "-")}</td>
        <td>${escapeHtml(tool.day)}</td>
        <td>${escapeHtml(tool.ubication || "-")}</td>
      </tr>
    `,
    )
    .join("");

  const wordDocumentHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <title>Inventario de instrumentos</title>
        <style>
          body { font-family: Arial, sans-serif; }
          h1 { margin-bottom: 16px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #000; padding: 6px; text-align: left; }
          th { background: #dbeafe; }
        </style>
      </head>
      <body>
        <h1>Inventario de elementos de medición</h1>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Código</th>
              <th>Fecha</th>
              <th>Ubicación</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", wordDocumentHtml], {
    type: "application/msword;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "instrumentos_de_medicion.doc";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
});
