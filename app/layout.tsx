import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'RUET Student Exchange',
  description: 'Buy, sell, rent, and connect — for RUET students only.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900">
        <nav className="bg-ruet-maroon text-white px-4 py-3 flex items-center justify-between">
          <Link href="/listings" className="font-bold text-lg">
            RUET Exchange
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/listings">Browse</Link>
            <Link href="/listings/new">Sell / Rent</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
