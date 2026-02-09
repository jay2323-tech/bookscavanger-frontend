import { supabase } from "@/app/lib/supabaseClient";

/**
 * A wrapper around fetch that automatically injects the Supabase JWT.
 * Use this for protected routes like /api/library/my-books.
 */
export async function authFetch(url, options = {}) {
  // 1. Get the current session from Supabase SDK
  // This is the source of truth for your JWT
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  
  const accessToken = session?.access_token;

  // 2. Prepare headers
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // 3. ONLY add Authorization if the token actually exists
  // This prevents sending "Bearer null" or "Bearer undefined"
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    // 4. Handle Unauthorized (e.g., if the user was deleted or banned)
    if (res.status === 401) {
      console.warn("Unauthorized request. Redirecting to login...");
      // Optional: Clear session and redirect
      // await supabase.auth.signOut();
      // window.location.href = "/library/login";
    }

    return res;
  } catch (err) {
    console.error("authFetch Error:", err);
    throw err;
  }
}