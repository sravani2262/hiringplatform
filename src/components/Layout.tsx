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
      <aside className="w-64 border-r border-sidebar-border bg-sidebar-background shadow-xl">
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <h1 className="text-2xl font-bold gradient-text">
              TalentFlow
            </h1>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 scale-105'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:translate-x-1'
                )}
              >
                <Icon className={cn('h-5 w-5 transition-transform', isActive ? 'scale-110' : 'group-hover:scale-110')} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60 text-center">
            TalentFlow v1.0
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-background to-muted/20">
        {children}
      </main>
    </div>
  );
}
