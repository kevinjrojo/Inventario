export function filterTools(tools, searchTerm) {
  const term = searchTerm.trim().toLowerCase();

  if (!term) return tools;

  return tools.filter((tool) => {
    const valuesToSearch = [tool.name, tool.codigo, tool.category]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());

    return valuesToSearch.some((value) => value.includes(term));
  });
}
