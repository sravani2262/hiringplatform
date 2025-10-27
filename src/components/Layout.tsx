import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Users, ClipboardCheck, LayoutDashboard, Menu, X, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/jobs', label: 'Jobs', icon: Briefcase },
  { path: '/candidates', label: 'Candidates', icon: Users },
  { path: '/assessments', label: 'Assessments', icon: ClipboardCheck },
  { path: '/analytics', label: 'Analytics', icon: TrendingUp },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavigationContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Logo section with enhanced background */}
      <div className="flex h-16 items-center px-6 border-b border-white/10 relative overflow-hidden backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/10 to-transparent"></div>
        <div className="absolute inset-0 bg-grid-slate-200/10 dark:bg-grid-slate-800/10 bg-fixed pointer-events-none"></div>
        <div className="flex items-center gap-4 relative">
          <Logo size="medium" />
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
              TalentFlow
            </h1>
            <span className="text-xs text-white/60">Talent Acquisition Platform</span>
          </div>
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
              onClick={() => {
                if (isMobile) {
                  setIsMobileMenuOpen(false);
                }
              }}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300',
                'relative overflow-hidden',
                isActive
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Icon
                className={cn(
                  'h-5 w-5 transition-all duration-300',
                  isActive ? 'scale-110 rotate-3' : 'group-hover:scale-105 group-hover:-rotate-3'
                )}
              />
              <span className="relative">{item.label}</span>
              {isActive && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white/80 shadow-glow"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Enhanced Footer */}
      <div className="mt-auto p-6 border-t border-white/10">
        <div className="flex flex-col items-center gap-4">
         
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 mobile-layout">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-2xl flex-col relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-accent/5"></div>
        <div className="absolute inset-0 bg-grid-slate-800/10 bg-fixed pointer-events-none opacity-30"></div>
        <div className="relative z-10">
          <NavigationContent isMobile={false} />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl relative z-10 backdrop-blur-lg">
          <div className="flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <Logo size="small" />
              <div className="flex flex-col">
                <h1 className="text-lg font-bold tracking-wide bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
                  TalentFlow
                </h1>
                <span className="text-[10px] text-white/60 -mt-1">Talent Acquisition Platform</span>
              </div>
            </div>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/10 p-2"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white border-r border-white/10 p-0 [&>button]:text-white backdrop-blur-xl"
                onInteractOutside={() => setIsMobileMenuOpen(false)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-accent/5"></div>
                <div className="absolute inset-0 bg-grid-slate-800/10 bg-fixed pointer-events-none opacity-30"></div>
                <div className="relative flex flex-col h-full z-10">
                  <NavigationContent isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto min-h-0 bg-gradient-to-br from-slate-50 via-white to-slate-50/80 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/80">
          <div className="relative min-h-full">
            {/* Background patterns */}
            <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 bg-bottom mask-fade-out pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-white/90 dark:to-slate-950/90 pointer-events-none" />
            
            {/* Content */}
            <div className="relative h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
