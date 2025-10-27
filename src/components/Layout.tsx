import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Users, ClipboardCheck, LayoutDashboard, Menu, X, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { UserDropdown } from '@/components/ui/UserDropdown';
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
        <div className="absolute inset-0 bg-dots opacity-20 pointer-events-none"></div>
        <div className="relative z-10">
          <BrandLogo 
            size="md" 
            variant="dark" 
            animated={true}
            className="animate-fade-in-up"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navItems.map((item, index) => {
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
                'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                'relative overflow-hidden animate-fade-in-up shadow-soft hover:shadow-elegant',
                isActive
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-dreamy animate-glow-pulse'
                  : 'text-gray-300 hover:text-white hover:bg-white/10 backdrop-blur-sm'
              )}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              
              {/* Icon with enhanced animations */}
              <div className="relative">
                <Icon
                  className={cn(
                    'h-5 w-5 transition-all duration-300 relative z-10',
                    isActive 
                      ? 'scale-110 rotate-6 drop-shadow-lg animate-bounce-gentle' 
                      : 'group-hover:scale-110 group-hover:-rotate-3 group-hover:drop-shadow-md'
                  )}
                />
                {/* Glow effect for active item */}
                {isActive && (
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-sm animate-pulse"></div>
                )}
              </div>
              
              <span className="relative font-semibold">{item.label}</span>
              
              {/* Enhanced active indicator */}
              {isActive && (
                <div className="absolute right-3 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white/90 shadow-lg animate-pulse"></span>
                  <span className="w-1 h-1 rounded-full bg-white/60 animate-ping"></span>
                </div>
              )}
              
              {/* Hover arrow */}
              {!isActive && (
                <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className="w-4 h-4 text-white/60">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Enhanced Footer with User Dropdown */}
      <div className="mt-auto p-6 border-t border-white/10">
        <div className="flex flex-col gap-4">
          {/* User Dropdown */}
          <UserDropdown />
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Footer Info */}
          <div className="text-center">
            <p className="text-xs text-white/50">TalentFlow v2.0</p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 mobile-layout">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        <div className="relative z-10 backdrop-blur-sm">
          <NavigationContent isMobile={false} />
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl relative z-10 backdrop-blur-lg">
          <div className="flex h-16 items-center justify-between px-4">
            <BrandLogo 
              size="sm" 
              variant="dark" 
              animated={true}
              className="animate-fade-in"
            />
            
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
        <main className="flex-1 overflow-auto min-h-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950/80 animate-fade-in">
          <div className="relative min-h-full">
            {/* Enhanced background patterns */}
            <div className="absolute inset-0 bg-dots opacity-30 dark:opacity-10 pointer-events-none animate-fade-in" />
            <div className="absolute inset-0 bg-mesh opacity-40 dark:opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-accent/5 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/50 via-transparent to-transparent dark:from-slate-950/50 pointer-events-none" />
            
            {/* Content */}
            <div className="relative h-full backdrop-blur-[0.5px]">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
