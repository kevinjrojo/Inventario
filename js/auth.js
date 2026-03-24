import { supabase } from "./supabaseClient.js";

/**
 * Verifica si hay sesión activa.
 * Si no hay sesión, redirige al login.
 * Llamar esta función al inicio de index.html.
 */
export async function requireAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "./login.html";
    return null;
  }

  return session;
}

/**
 * Cierra la sesión y redirige al login.
 */
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "./login.html";
}
