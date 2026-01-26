import "./globals.css";

export const metadata = {
  title: "Lexoria",
  description: "Where Knowledge Finds Its Place",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0F172A] text-[#F8F5F0]">
        <nav className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-6 border-b border-gray-700">
          <h1 className="text-2xl text-[#D4AF37] font-serif mb-4 md:mb-0">LEXORIA</h1>
          <div className="space-x-4 md:space-x-6">
            <a href="/" className="hover:text-[#D4AF37]">Home</a>
            <a href="/search" className="hover:text-[#D4AF37]">Search</a>
            <a href="#" className="hover:text-[#D4AF37]">Premium</a>
          </div>
        </nav>
        
        {children}
      </body>
    </html>
  );
}
