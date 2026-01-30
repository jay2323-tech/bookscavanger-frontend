'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import BrowseCard from './components/BrowseCard'

const suggestedBooks = [
  { title: 'Atomic Habits', author: 'James Clear' },
  { title: 'Clean Code', author: 'Robert C. Martin' },
  { title: 'The Alchemist', author: 'Paulo Coelho' },
  { title: 'Deep Work', author: 'Cal Newport' },
  { title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki' },
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (!query.trim()) return
    router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <main className="min-h-screen px-4">
      {/* HERO SECTION */}
      <section className="flex items-center justify-center min-h-[70vh]">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold text-[#D4AF37] mb-4">
            BookScavenger
          </h1>

          <p className="text-gray-400 mb-10">
            Your local book discovery engine. Find books available in libraries near you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author or ISBN"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-[#D4AF37] outline-none"
            />

            <button
              onClick={handleSearch}
              disabled={!query.trim()}
              className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* BROWSE SECTION */}
      <section className="max-w-6xl mx-auto pb-20">
        <h2 className="text-2xl font-semibold mb-6">
          Browse Popular Books
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {suggestedBooks.map((book, i) => (
            <BrowseCard key={i} {...book} />
          ))}
        </div>
      </section>
    </main>
  )
}
