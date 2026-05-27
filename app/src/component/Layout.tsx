import type { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh]" style={{ background: '#050B14' }}>
      <Navbar />
      <Sidebar />
      <main
        className="pt-16 pr-16 pb-8"
        style={{ minHeight: '100dvh' }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
