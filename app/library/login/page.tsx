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

  // =========================================================
  // 🔐 EMAIL/PASSWORD LOGIN (Customers)
  // =========================================================
  const handlePasswordLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { data, error: loginErr } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (loginErr) throw loginErr;

      await handlePostLogin(data.user);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // 🌍 GOOGLE LOGIN
  // =========================================================
  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/library/oauth-callback`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || "Google login failed");
      setLoading(false);
    }
  };

  // =========================================================
  // 🎯 ROLE + APPROVAL CHECK
  // =========================================================
  const handlePostLogin = async (user: any) => {
    if (!user) throw new Error("Authentication failed.");

    const role = user.user_metadata?.role;

    // 🔵 Librarian flow
    if (role === "librarian") {
      const { data: library, error: libErr } = await supabase
        .from("libraries")
        .select("approved, rejected")
        .eq("supabase_user_id", user.id)
        .maybeSingle();

      if (libErr || !library) {
        router.replace("/library/pending");
        return;
      }

      if (library.rejected) {
        await supabase.auth.signOut();
        router.replace("/library/rejected");
        return;
      }

      if (!library.approved) {
        router.replace("/library/pending");
        return;
      }

      router.replace("/");
      return;
    }

    // 🟢 Customer flow
    if (role === "customer") {
      router.replace("/");
      return;
    }

    throw new Error("User role not recognized.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0F172A]">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 text-white">

        <h1 className="text-2xl font-bold text-[#D4AF37] mb-6 text-center">
          Login
        </h1>

        {/* ================= GOOGLE LOGIN ================= */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full mb-4 bg-white text-black py-3 rounded-lg font-semibold"
        >
          Continue with Google
        </button>

        <div className="text-center text-gray-500 text-sm mb-4">OR</div>

        {/* ================= EMAIL LOGIN ================= */}
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
          onClick={handlePasswordLogin}
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
