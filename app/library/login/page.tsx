"use client";

import { supabase } from "@/app/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LibraryLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Authenticate user
      const { data, error: loginErr } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginErr) throw loginErr;

      const user = data.user;
      if (!user) throw new Error("Authentication failed.");

      const role = user.user_metadata?.role;

      // 2️⃣ Librarian flow
      if (role === "librarian") {
        const { data: library, error: libErr } = await supabase
          .from("libraries")
          .select("approved")
          .eq("supabase_user_id", user.id)
          .single();

        // Not approved OR library missing → pending page
        if (libErr || !library?.approved) {
          router.replace("/library/pending");
          return;
        }

        router.replace("/");
        return;
      }

      // 3️⃣ Customer flow
      if (role === "customer") {
        router.replace("/");
        return;
      }

      // 4️⃣ Fallback
      throw new Error("User role not recognized.");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0F172A]">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 text-white">
        <h1 className="text-2xl font-bold text-[#D4AF37] mb-4 text-center">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link href="/library/signup" className="text-[#D4AF37]">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
