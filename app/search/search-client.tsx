"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import BookResultCard from "../components/BookResultCard";
import EmptyState from "../components/EmptyState";
import LoadingSkeleton from "../components/LoadingSkeleton";
import SearchBar from "../components/SearchBar";

export default function SearchClient() {
  const params = useSearchParams();
  const initialQuery = params.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    if (!query) return;

    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Location access is required");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/search?q=${encodeURIComponent(
              query
            )}&lat=${pos.coords.latitude}&lng=${pos.coords.longitude}`
          );

          if (!res.ok) throw new Error("Failed to fetch");

          const data = await res.json();

          const mapped = data.map((b: any) => ({
            ...b,
            libraryName: b.library_name,
          }));

          setResults(mapped);
        } catch {
          setError("Failed to fetch books");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    if (initialQuery) fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">
        Search books near you
      </h2>

      <SearchBar
        query={query}
        setQuery={setQuery}
        onSearch={fetchBooks}
        loading={loading}
      />

      <div className="mt-8 space-y-4">
        {loading && <LoadingSkeleton />}
        {!loading && error && (
          <p className="text-red-400 text-center">{error}</p>
        )}
        {!loading && !error && results.length === 0 && <EmptyState />}

        {results.map((book, i) => (
          <BookResultCard key={i} book={book} />
        ))}
      </div>
    </div>
  );
}
