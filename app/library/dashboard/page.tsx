"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LibraryDashboard() {
  const router = useRouter();
  const [library, setLibrary] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loadingBooks, setLoadingBooks] = useState(false);

  /* 📚 Fetch library books */
  const fetchBooks = async (token: string) => {
    try {
      setLoadingBooks(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/library/my-books`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch books");

      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Fetch books failed:", err);
      alert("Failed to load books");
    } finally {
      setLoadingBooks(false);
    }
  };

  /* 🔐 Load session */
  useEffect(() => {
    const raw = localStorage.getItem("library_session");

    if (!raw) {
      router.push("/library/login");
      return;
    }

    try {
      const session = JSON.parse(raw);

      // ✅ correct shape from backend login
      setLibrary(session.user);
      fetchBooks(session.access_token);
    } catch {
      localStorage.removeItem("library_session");
      router.push("/library/login");
    }
  }, []);

  /* ⬆️ Upload Excel */
  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const session = JSON.parse(
        localStorage.getItem("library_session")!
      );

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/library/upload/books`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      alert(data.message || data.error);

      fetchBooks(session.access_token);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white p-10">
      <h1 className="text-3xl text-[#D4AF37] mb-6">
        Library Dashboard
      </h1>

      <div className="bg-white text-black p-6 rounded-xl max-w-4xl">
        {library && (
          <p className="mb-4 text-sm text-gray-600">
            Logged in as <b>{library.email}</b>
          </p>
        )}

        {/* 📤 Upload */}
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        {uploading && (
          <p className="text-sm text-gray-500 mt-2">
            Uploading…
          </p>
        )}

        {/* 📚 Books */}
        <h3 className="mt-8 mb-2 font-semibold">
          Your Books
        </h3>

        {loadingBooks ? (
          <p className="text-gray-500">Loading books…</p>
        ) : books.length === 0 ? (
          <p className="text-gray-500">No books uploaded yet.</p>
        ) : (
          <table className="w-full mt-2 border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Author</th>
                <th className="p-2 border">ISBN</th>
                <th className="p-2 border">Available</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b, i) => (
                <tr key={i}>
                  <td className="p-2 border">{b.title}</td>
                  <td className="p-2 border">{b.author}</td>
                  <td className="p-2 border">{b.isbn}</td>
                  <td className="p-2 border">
                    {b.available ? "Yes" : "No"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 🚪 Logout */}
        <button
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            localStorage.removeItem("library_session");
            router.push("/library/login");
          }}
        >
          Logout
        </button>
      </div>
    </main>
  );
}
