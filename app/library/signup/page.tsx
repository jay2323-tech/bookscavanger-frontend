"use client";

import RoleSelector from "@/app/components/RoleSelector";
import { supabase } from "@/app/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Role = "customer" | "librarian";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = async () => {
    setError("");
    if (form.password.length < 8) return setError("Password must be at least 8 characters");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match");

    setLoading(true);

    try {
      if (role === "librarian") {
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        
        // Use standard fetch here to AVOID authfetch.js interference
        const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            password: form.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Librarian signup failed");

        router.replace("/library/pending");
      } else {
        // Customer flow remains direct to Supabase
        const { error: signupError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { role: "customer", name: form.name },
          },
        });

        if (signupError) throw signupError;
        router.replace("/library/login");
      }
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl text-white">
        <h1 className="text-2xl font-bold text-[#D4AF37] mb-4">Create an Account</h1>
        <RoleSelector role={role} setRole={setRole} />
        <input
          placeholder={role === "librarian" ? "Library Name" : "Full Name"}
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full mb-4 px-4 py-3 rounded bg-gray-800"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
        />
        {error && <p className="text-red-400 mb-3">{error}</p>}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account? <Link href="/library/login" className="text-[#D4AF37]">Login</Link>
        </p>
      </div>
    </div>
  );
}