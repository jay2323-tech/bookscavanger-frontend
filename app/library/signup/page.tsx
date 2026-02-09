"use client";

import RoleSelector from "@/app/components/RoleSelector";
import { supabase } from "@/app/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<"librarian" | "customer">("customer");
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

    // ✅ Password validation
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          // ✅ ONLY VALID ENUM VALUES
          role: role === "librarian" ? "librarian" : "customer",
          name: form.name,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // ✅ Redirects
    if (role === "librarian") {
      router.push("/library/pending");
    } else {
      router.push("/library/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0F172A]">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-xl p-8 text-white">
        <h1 className="text-2xl font-bold text-[#D4AF37] mb-4">
          Create an Account
        </h1>

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
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/library/login" className="text-[#D4AF37]">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
