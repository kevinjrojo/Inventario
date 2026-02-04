export function renderTable(tools, tableBody) {
  tableBody.innerHTML = "";

  tools.forEach((tool) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      
      <td>${tool.name}</td>
      <td>${tool.category}</td>
      <td>${tool.codigo || "-"}</td>
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
    `;

    tableBody.appendChild(row);
  });
}
