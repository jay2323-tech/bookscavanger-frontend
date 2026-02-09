"use client";

import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PendingApprovalPage() {
  const router = useRouter();

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.replace("/library/login");
    };
    check();
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
