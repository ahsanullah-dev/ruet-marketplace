import './globals.css';
import NavBar from './NavBar';

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
        <NavBar />
        <main className="max-w-5xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}