"use client";

import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Stats = {
  totalLibraries: number;
  totalBooks: number;
  status: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/admin/login");
        return;
      }

      if (session.user.user_metadata?.role !== "admin") {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      try {
        const token = session.access_token;

        const statsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const analyticsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/analytics`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!statsRes.ok || !analyticsRes.ok) {
          throw new Error("Unauthorized");
        }

        if (mounted) {
          setStats(await statsRes.json());
          setAnalytics(await analyticsRes.json());
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load admin data");
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [router]);

  if (loading)
    return <p className="p-10 text-white">Loading Admin Dashboard...</p>;
  if (error) return <p className="p-10 text-red-500">{error}</p>;

  return (
    <main className="min-h-screen bg-[#0F172A] text-white p-10">
      <h1 className="text-3xl text-[#D4AF37] mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Libraries" value={stats!.totalLibraries} />
        <Card title="Total Books" value={stats!.totalBooks} />
        <Card title="Platform Status" value={stats!.status} />
      </div>

      <h2 className="mt-10 text-2xl text-[#D4AF37]">Recent Activity</h2>

      <ul className="mt-4 space-y-2">
        {analytics.map((a, i) => (
          <li key={i} className="bg-gray-800 p-3 rounded">
            <b>{a.event_type}</b> —{" "}
            {new Date(a.created_at).toLocaleString()}
          </li>
        ))}
      </ul>

      <button
        className="mt-10 bg-red-500 px-4 py-2 rounded"
        onClick={async () => {
          await supabase.auth.signOut();
          router.replace("/admin/login");
        }}
      >
        Logout Admin
      </button>
    </main>
  );
}

function Card({ title, value }: { title: string; value: any }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-lg text-gray-400">{title}</h2>
      <p className="text-3xl text-[#D4AF37] mt-2">{value}</p>
    </div>
  );
}
