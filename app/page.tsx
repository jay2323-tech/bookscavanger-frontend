"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-[#F8F5F0] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-5xl text-[#D4AF37] font-serif">LECTÈRE</h1>
      <p className="mt-4 text-lg md:text-xl">Find books near you</p>

      <form onSubmit={handleSearch} className="w-full flex justify-center mt-10">
        <input
          className="px-6 py-4 w-full max-w-md rounded-lg text-black"
          placeholder="Search book title, author or ISBN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
    </main>
  );
}
