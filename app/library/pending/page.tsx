"use client";

import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PendingApprovalPage() {
  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkApprovalStatus = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (!user) {
        router.replace("/library/login");
        return;
      }

      const { data: library, error } = await supabase
        .from("libraries")
        .select("approved, rejected")
        .eq("supabase_user_id", user.id)
        .maybeSingle();

      if (error) return;

      // 🔴 Rejected
      if (library?.rejected) {
        await supabase.auth.signOut();
        router.replace("/library/rejected");
        return;
      }

      // ✅ Approved → go to home
      if (library?.approved) {
        router.replace("/");
        return;
      }
    };

    // Run once immediately
    checkApprovalStatus();

    // Poll every 3 seconds
    interval = setInterval(checkApprovalStatus, 3000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F172A] text-white">
      <h1 className="text-3xl font-bold text-[#D4AF37] mb-4">
        ⏳ Approval Pending
      </h1>
      <p className="text-gray-400 text-center max-w-md">
        Your librarian account is under review.
        <br />
        You’ll get access once approved by the admin.
      </p>
    </div>
  );
}
