"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!token) {
      setError("Enter admin token");
      return;
    }

    localStorage.setItem("admin_token", token);
    router.push("/admin/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
      <div className="bg-white text-black p-8 rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        <input
          type="password"
          className="w-full p-2 border mb-3 rounded"
          placeholder="Admin Secret Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 rounded mt-3"
        >
          Enter Admin Panel
        </button>
      </div>
    </main>
  );
}
