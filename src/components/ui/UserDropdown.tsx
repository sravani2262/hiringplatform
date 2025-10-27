import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Settings,
  LogOut,
  Shield,
  Bell,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function UserDropdown() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative flex items-center gap-3 p-3 h-auto hover:bg-white/10 focus:bg-white/10 focus:ring-2 focus:ring-white/20 rounded-xl transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-white/20 shadow-lg group-hover:border-white/30 transition-colors">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold text-sm">
                {user.avatar || user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white leading-none">
                  {user.name}
                </p>
                {user.role === 'Administrator' && (
                  <Badge className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-0.5 border-yellow-400/20">
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-xs text-white/70 mt-1">
                {user.role} • {user.company}
              </p>
            </div>
          </div>
          
          <ChevronDown className="h-4 w-4 text-white/60 group-hover:text-white/80 transition-colors group-data-[state=open]:rotate-180 duration-200" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        className="w-72 bg-white/95 backdrop-blur-xl border-white/20 shadow-2xl rounded-2xl p-2" 
        align="end"
        sideOffset={8}
      >
        {/* User Info Header */}
        <DropdownMenuLabel className="p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white font-bold">
                {user.avatar || user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-slate-800 truncate">
                  {user.name}
                </p>
                {user.role === 'Administrator' && (
                  <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 border-yellow-200">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-600 truncate">
                {user.email}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {user.role} at {user.company}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-slate-200/50 my-2" />

        {/* Menu Items */}
        <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 focus:bg-slate-100 cursor-pointer group transition-colors">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <User className="h-4 w-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-800">Profile Settings</p>
            <p className="text-xs text-slate-500">Manage your account preferences</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 focus:bg-slate-100 cursor-pointer group transition-colors">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Settings className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-800">Account Settings</p>
            <p className="text-xs text-slate-500">Update billing and preferences</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 focus:bg-slate-100 cursor-pointer group transition-colors">
          <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <Bell className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-800">Notifications</p>
            <p className="text-xs text-slate-500">Configure alert preferences</p>
          </div>
          <Badge className="bg-red-100 text-red-700 text-xs px-2 py-0.5">
            3 New
          </Badge>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 focus:bg-slate-100 cursor-pointer group transition-colors">
          <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
            <HelpCircle className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-800">Help & Support</p>
            <p className="text-xs text-slate-500">Get help and contact support</p>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-200/50 my-2" />

        {/* Logout */}
        <DropdownMenuItem 
          onClick={handleLogout}
          className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 focus:bg-red-50 cursor-pointer group transition-colors text-red-600 hover:text-red-700"
        >
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
            <LogOut className="h-4 w-4 text-red-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium">Sign Out</p>
            <p className="text-xs text-red-500">Log out of your account</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}