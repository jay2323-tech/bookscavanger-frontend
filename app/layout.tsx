import Navbar from "@/app/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "BookScavenger",
  description: "Discover books available in libraries near you",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0F172A] text-[#F8F5F0] min-h-screen">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
