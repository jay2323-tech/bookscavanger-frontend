"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function AdminOAuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                router.replace("/admin/login");
                return;
            }

            // Let backend verify admin role
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/stats`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            if (res.status === 403 || res.status === 401) {
                await supabase.auth.signOut();
                router.replace("/admin/login");
                return;
            }

            router.replace("/admin/dashboard");
        };

        checkAdmin();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
            Verifying admin access...
        </div>
    );
}
