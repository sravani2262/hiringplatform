import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Users, ClipboardCheck, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/jobs', label: 'Jobs', icon: Briefcase },
  { path: '/candidates', label: 'Candidates', icon: Users },
  { path: '/assessments', label: 'Assessments', icon: ClipboardCheck },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white shadow-lg flex flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <h1 className="text-xl font-semibold tracking-wide">TalentFlow</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-transform',
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-white/10 text-xs text-gray-400 text-center">
          © 2025 TalentFlow
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
        {children}
      </main>
    </div>
  );
}
