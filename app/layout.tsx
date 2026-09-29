import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Shivam Shukla — Senior MERN Stack Developer | Portfolio & ATS Resume',
  description:
    'Senior MERN Stack Developer specializing in Node.js, TypeScript, React, Express, MongoDB, Redis, RabbitMQ, and Docker.',
  openGraph: {
    title: 'Shivam Shukla — Senior MERN Stack Developer | Portfolio & ATS Resume',
    description:
      'Senior MERN Stack Developer specializing in Node.js, TypeScript, React, Express, MongoDB, Redis, RabbitMQ, and Docker.',
    type: 'website',
  },
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232563eb'/><text x='50' y='65' font-size='45' font-family='monospace' font-weight='bold' fill='white' text-anchor='middle'>SS</text></svg>",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen bg-[#0b0f17] text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
