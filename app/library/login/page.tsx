"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LibraryLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
      } else {
        localStorage.setItem("library_session", JSON.stringify(data.session));
        router.push("/library/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
      <div className="bg-white text-black p-8 rounded-xl w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Library Login</h2>

        <input
          type="email"
          className="w-full p-2 border mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 border mb-3 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-2 rounded mt-3"
        >
          Login
        </button>
      </div>
    </main>
  );
}
