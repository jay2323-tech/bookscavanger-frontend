"use client";

import StatCard from "@/app/components/StatCard";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LibrarianDashboard() {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/library/login");
        return;
      }

      // ⛔ Pending → pending page
      if (data.user.user_metadata?.role === "pending_librarian") {
        router.replace("/library/pending");
        return;
      }

      // ⛔ Not librarian
      if (data.user.user_metadata?.role !== "librarian") {
        router.replace("/");
        return;
      }

      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/library/my-books`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBooks(await res.json());
      setLoading(false);
    };

    check();
  }, [router]);

  if (loading) return null;

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Librarian Dashboard</h1>
      <StatCard title="Total Books" value={books.length.toString()} />
    </div>
  );
}
