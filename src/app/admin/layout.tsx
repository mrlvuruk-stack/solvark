'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  Briefcase,
  MessageSquare,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const sidebarItems: SidebarItem[] = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Leads Manager', href: '/admin/leads', icon: Users },
  { name: 'Blog Editor', href: '/admin/blog', icon: FileText },
  { name: 'Projects CRUD', href: '/admin/case-studies', icon: Briefcase },
  { name: 'Testimonials CRUD', href: '/admin/testimonials', icon: MessageSquare },
  { name: 'Global Settings', href: '/admin/settings', icon: SettingsIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't render dashboard shell on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
        router.refresh();
      }
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-[#0a0a0a] border-b border-white/5 z-20">
        <Link href="/" className="flex items-center">
          <div className="bg-white px-3 py-1 rounded-lg flex items-center justify-center h-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Solvark Logo"
              className="h-6 w-auto object-contain"
            />
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-brand-gray-400 hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-350 ease-in-out md:relative md:flex flex-col w-64 bg-[#0a0a0a] border-r border-white/5 z-30`}
      >
        {/* Branding */}
        <div className="hidden md:flex items-center px-6 py-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-white px-3 py-1.5 rounded-lg flex items-center justify-center h-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Solvark Logo"
                className="h-6.5 w-auto object-contain"
              />
            </div>
            <span className="text-[9px] font-bold tracking-wider bg-brand-accent/20 text-brand-accent border border-brand-accent/30 rounded px-1.5 py-0.2">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-grow px-4 py-6 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-accent text-white border border-brand-accent/20'
                    : 'text-brand-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-brand-gray-450'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User / Session section */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-2 bg-[#090909]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-[10px] font-medium text-brand-gray-500 hover:text-white px-4 py-2 hover:bg-white/5 rounded-lg transition-all"
          >
            <span>Visit Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all border border-transparent text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 md:hidden z-10"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-10 max-w-7xl mx-auto w-full min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
