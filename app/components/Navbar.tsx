"use client";

import { supabase } from "@/app/lib/supabaseClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Initial fetch
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDashboard = () => {
    const role = user?.user_metadata?.role;

    if (role === "librarian") {
      router.push("/library/dashboard/librarian");
    } else if (role === "customer") {
      router.push("/library/dashboard/customer");
    }

    setOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
    router.push("/"); // ✅ HOME after logout
  };

  return (
    <nav className="flex items-center justify-between px-10 py-5 border-b border-gray-800 bg-[#0F172A] text-white">
      <Link href="/" className="text-2xl font-bold text-[#D4AF37]">
        BookScavenger
      </Link>

      {!user ? (
        <Link href="/library/login">Login / Signup</Link>
      ) : (
        <div className="relative">
          {/* Avatar */}
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center"
          >
            {(user.user_metadata?.name || user.email)[0].toUpperCase()}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-44 bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={handleDashboard}
                className="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm"
              >
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-gray-800 text-sm text-red-400"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}