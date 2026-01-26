"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Book = {
  id: number;
  title: string;
  author: string;
  library_name: string;
  distance: number | null;
};

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) return;

    if (!navigator.geolocation) {
      setError("Location access is required to show nearest libraries.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/search?q=${encodeURIComponent(
              query
            )}&lat=${lat}&lng=${lng}`
          );

          if (!res.ok) throw new Error("Failed to fetch results");

          const data = await res.json();
          setBooks(data);
        } catch (err) {
          console.error(err);
          setError("Unable to fetch book results.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Location permission denied.");
        setLoading(false);
      }
    );
  }, [query]);

  return (
    <div className="p-10 bg-[#0F172A] min-h-screen text-white">
      <h2 className="text-3xl text-[#D4AF37] mb-6">
        Results for "{query}"
      </h2>

      {loading && <p>Loading results...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && books.length === 0 && !error && (
        <p>No books found near you.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl text-[#D4AF37]">{book.title}</h3>
            <p className="mt-1">{book.author}</p>
            <p className="text-sm text-gray-400 mt-2">
              Available at:{" "}
              <span className="text-white">{book.library_name}</span>
            </p>

            {book.distance !== null && (
              <p className="text-sm mt-2 text-[#D4AF37]">
                📍 {book.distance.toFixed(2)} km away
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
