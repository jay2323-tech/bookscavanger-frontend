export async function authFetch(
  url: string,
  options: RequestInit = {}
) {
  const accessToken = localStorage.getItem("access_token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  // 🔁 Auto refresh token
  if (res.status === 401) {
    const refreshed = await refreshToken();
    if (!refreshed) throw new Error("Session expired");

    return authFetch(url, options);
  }

  return res;
}

async function refreshToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return false;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    }
  );

  if (!res.ok) return false;

  const data = await res.json();
  localStorage.setItem("access_token", data.accessToken);
  return true;
}
