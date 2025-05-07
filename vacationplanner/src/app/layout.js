import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="navbar">
          <nav className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/flights">Flights</Link>
            <Link href="/stays">Stays</Link>
            <Link href="/activities">Activities</Link>
            <Link href="/food">Food</Link>
            </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
