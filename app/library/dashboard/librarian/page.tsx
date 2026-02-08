"use client";

import StatCard from "@/app/components/StatCard";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LibrarianDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/library/login");
        return;
      }

      if (data.user.user_metadata?.role !== "librarian") {
        router.replace("/");
        return;
      }

      setUser(data.user);

      // 📚 Fetch books
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/library/my-books`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const dataBooks = await res.json();
      setBooks(dataBooks);

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return null;

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "28px" }}>Librarian Dashboard</h1>

      <StatCard title="Total Books" value={books.length.toString()} />
    </div>
  );
}
