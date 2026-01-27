"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalLibraries: number;
  totalBooks: number;
  platform: string;
  status: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_ADMIN_KEY}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch stats");

        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError("Unable to load admin data");
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return <p className="p-10 text-red-500">{error}</p>;
  }

  if (!stats) {
    return <p className="p-10">Loading Admin Dashboard...</p>;
  }

  return (
    <main className="min-h-screen bg-[#0F172A] text-white p-10">
      <h1 className="text-3xl text-[#D4AF37] mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Total Libraries" value={stats.totalLibraries} />
        <Card title="Total Books" value={stats.totalBooks} />
        <Card title="Platform Status" value={stats.status} />
      </div>
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
