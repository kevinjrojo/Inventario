import { supabase } from "./supabaseClient.js";

export async function getTools() {
  const { data, error } = await supabase.from("tools").select("*");
  if (error) throw error;
  return data;
}

export async function addTool(tool) {
  const { error } = await supabase.from("tools").insert([tool]);
  if (error) throw error;
}

export async function updateTool(id, tool) {
  const { error } = await supabase.from("tools").update(tool).eq("id", id);
  if (error) throw error;
}

export async function deleteTool(id) {
  const { error } = await supabase.from("tools").delete().eq("id", id);
  if (error) throw error;
}
