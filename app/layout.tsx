import Link from 'next/link'
import './globals.css'

export const metadata = {
  title: 'BookScavenger',
  description: 'Discover books available in libraries near you',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-[#0F172A] text-[#F8F5F0] min-h-screen">
        {/* Navbar */}
        <nav className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-5 border-b border-gray-800">
          {/* Brand */}
          <Link
            href="/"
            className="text-2xl font-bold text-[#D4AF37] font-serif mb-4 md:mb-0"
          >
            BookScavenger
          </Link>

          {/* Navigation */}
          <div className="flex gap-4 md:gap-6 text-sm">
            <Link href="/" className="hover:text-[#D4AF37]">
              Home
            </Link>
            <Link href="/search" className="hover:text-[#D4AF37]">
              Search
            </Link>
            <Link href="/library/login" className="hover:text-[#D4AF37]">
              Login/Signup
            </Link>
          </div>
        </nav>

        {/* Page Content */}
        {children}
      </body>
    </html>
  )
}
