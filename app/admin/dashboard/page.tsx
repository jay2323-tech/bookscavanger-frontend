"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Stats = {
  totalLibraries: number;
  totalBooks: number;
  platform: string;
  status: string;
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [error, setError] = useState("");

  const fetchAnalytics = async (token: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/analytics`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setAnalytics(data);
  };

  useEffect(() => {
    const token = localStorage.getItem("admin_token");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Unauthorized");

        const data = await res.json();
        setStats(data);
        fetchAnalytics(token);
      } catch (err) {
        console.error(err);
        setError("Access denied or failed to load admin data");
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      }
    };

    fetchStats();
  }, []);

  if (error) return <p className="p-10 text-red-500">{error}</p>;
  if (!stats) return <p className="p-10">Loading Admin Dashboard...</p>;

  return (
    <main className="min-h-screen bg-[#0F172A] text-white p-10">
      <h1 className="text-3xl text-[#D4AF37] mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Libraries" value={stats.totalLibraries} />
        <Card title="Total Books" value={stats.totalBooks} />
        <Card title="Platform Status" value={stats.status} />
      </div>

      {/* 📊 Recent Activity */}
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
        onClick={() => {
          localStorage.removeItem("admin_token");
          router.push("/admin/login");
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
