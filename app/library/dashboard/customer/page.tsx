"use client";

import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/library/login");
        return;
      }

      if (data.user.user_metadata?.role !== "customer") {
        router.replace("/");
        return;
      }

      setUser(data.user);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return null;

  return (
    <div style={{ padding: "40px" }}>
      <h1 style={{ fontSize: "28px" }}>Customer Profile</h1>

      <p style={{ marginTop: "12px" }}>
        Welcome, <b>{user.user_metadata?.name ?? user.email}</b>
      </p>
    </div>
  );
}
