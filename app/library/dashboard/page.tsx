"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LibraryDashboard() {
  const router = useRouter();
  const [library, setLibrary] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [books, setBooks] = useState<any[]>([]);

  const fetchBooks = async (token: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/library/my-books`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books", err);
    }
  };

  useEffect(() => {
    const session = localStorage.getItem("library_session");
    if (!session) {
      router.push("/library/login");
    } else {
      const parsed = JSON.parse(session);
      setLibrary(parsed.user);
      fetchBooks(parsed.access_token);
    }
  }, []);

  const handleFileUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const session = JSON.parse(localStorage.getItem("library_session")!);
      const token = session.access_token;

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/library/upload/books`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      alert(data.message || data.error);

      // refresh books after upload
      fetchBooks(token);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F172A] text-white p-10">
      <h1 className="text-3xl text-[#D4AF37] font-serif">Library Dashboard</h1>

      <div className="mt-6 bg-white text-black p-6 rounded-xl max-w-3xl">
        <h2 className="text-xl font-bold">Welcome!</h2>
        {library && <p className="mt-2">Email: {library.email}</p>}

        {/* Excel Upload Section */}
        <div className="mt-6">
          <label className="block font-semibold mb-2">
            Upload Books via Excel
          </label>
          <input
            type="file"
            accept=".xlsx,.xls"
            className="border p-2 rounded w-full"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          {uploading && (
            <p className="text-sm text-gray-500 mt-2">Uploading...</p>
          )}
        </div>

        {/* Books Table */}
        {books.length > 0 && (
          <div className="mt-10">
            <h3 className="text-lg font-bold mb-3">Your Books</h3>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">Title</th>
                    <th className="p-2 border">Author</th>
                    <th className="p-2 border">ISBN</th>
                    <th className="p-2 border">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, i) => (
                    <tr key={i}>
                      <td className="p-2 border">{book.title}</td>
                      <td className="p-2 border">{book.author}</td>
                      <td className="p-2 border">{book.isbn}</td>
                      <td className="p-2 border">
                        {book.available ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={() => {
              localStorage.removeItem("library_session");
              router.push("/library/login");
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
