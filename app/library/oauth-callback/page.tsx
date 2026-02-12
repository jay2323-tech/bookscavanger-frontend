"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabaseClient";

export default function OAuthCallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const handleOAuth = async () => {
            // Wait for Supabase to process OAuth hash
            const { data: sessionData } = await supabase.auth.getSession();
            const user = sessionData.session?.user;

            if (!user) {
                router.replace("/library/login");
                return;
            }

            const role = user.user_metadata?.role;

            // =========================
            // 📚 LIBRARIAN FLOW
            // =========================
            if (role === "librarian") {
                const { data: library, error } = await supabase
                    .from("libraries")
                    .select("approved, rejected")
                    .eq("supabase_user_id", user.id)
                    .maybeSingle();

                if (error || !library) {
                    router.replace("/library/pending");
                    return;
                }

                if (library.rejected) {
                    await supabase.auth.signOut();
                    router.replace("/library/rejected");
                    return;
                }

                if (!library.approved) {
                    router.replace("/library/pending");
                    return;
                }

                // ✅ Approved
                router.replace("/");
                return;
            }

            // =========================
            // 👤 CUSTOMER FLOW
            // =========================
            if (role === "customer") {
                router.replace("/");
                return;
            }

            // Unknown role
            router.replace("/library/login");
        };

        handleOAuth();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
            <p>Signing you in...</p>
        </div>
    );
}
