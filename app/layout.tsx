import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Pharmacy Management System | EdGrow Tech',
  description: 'Professional Single Pharmacy Management System SaaS Frontend developed by EdGrow Tech (PVT) LTD',
  openGraph: {
    title: 'Pharmacy Management System | EdGrow Tech',
    description: 'Professional Single Pharmacy Management System SaaS Frontend developed by EdGrow Tech (PVT) LTD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pharmacy Management System | EdGrow Tech',
    description: 'Professional Single Pharmacy Management System SaaS Frontend developed by EdGrow Tech (PVT) LTD',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
